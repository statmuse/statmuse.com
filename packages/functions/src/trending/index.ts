import { JobHandler } from 'sst/node/job'
import { Config } from 'sst/node/config'
import { AthenaClient } from '@aws-sdk/client-athena'
import { S3Client } from '@aws-sdk/client-s3'
import { AthenaExpress } from 'athena-express-plus'
import {
  getUrlForEntity,
  type GameraEntity,
  type GameraTeamSeasonBio,
  type GameraResponse,
} from '@statmuse/core/gamera'
import * as Context from '@statmuse/core/context'
import * as Ask from '@statmuse/core/ask'
import { Table } from 'sst/node/table'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { createSlug } from '@statmuse/core/path'
const gameraApiUrl = process.env.GAMERA_API_URL
const gameraApiKey = Config.GAMERA_API_KEY
const kanedamaApiUrl = process.env.KANEDAMA_API_URL
const headers: Record<string, string> = {
  Accept: 'application/json',
  'x-origin': 'trending.bot',
  'x-origin-scope': 'trending',
  'x-origin-version': '1.0',
  'x-visitor-id': 'trending',
  'x-statmuse-api-key': gameraApiKey,
}

const athena = new AthenaClient()
const s3 = new S3Client({})
const athenaProps = { athena, s3, workgroup: 'primary' }
type Query = { uri: string; count: number }
const athenaClient = new AthenaExpress<Query>(athenaProps)

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
})

const stage = process.env.SST_STAGE as string
const isProduction = stage === 'production'

declare module 'sst/node/job' {
  export interface JobTypes {
    trending: {
      interval: 'hourly' | 'daily'
    }
  }
}

export const handler = JobHandler('trending', async (event) => {
  switch (event.interval) {
    case 'hourly':
      await handleHourlyUpdate()
      return

    case 'daily':
      await handleDailyUpdate()
      return

    default:
      throw new Error('Invalid interval')
  }
})

const LIMIT = 1000
const STORE = 100
const leagues = [
  'ALL',
  'FC',
  'NBA',
  'NFL',
  'NHL',
  'MLB',
  'PGA',
  'MONEY',
] as const

const timeframes = [
  'LAST_24_HOURS',
  'LAST_7_DAYS',
  'LAST_30_DAYS',
  'THIS_YEAR',
] as const

const countries = [
  'US',
  'FR',
  'FI',
  'CA',
  'NL',
  'PH',
  'AU',
  'IE',
  'GB',
  'DE',
  'BR',
  'MX',
  'IN',
  'IT',
  'SG',
  'JP',
  'NZ',
  'PL',
  'ES',
  'SE',
] as const

const contexts = await Context.list()

type League = (typeof leagues)[number]
type SportsLeague = Exclude<League, 'MONEY'>
type Timeframe = (typeof timeframes)[number]
type Location = 'GLOBAL' | (typeof countries)[number]

type Player = {
  id: number
  league: League
  name: string
  uri: string
  image: string
  background: string
  foreground: string
  lastAppearanceDate?: string
}

type Team = {
  id: number
  league: League
  name: {
    abbreviation: string
    market?: string
    nickname?: string
    name?: string
  }
  uri: string
  reps: { name: string; image: string }[]
  image: string
  background: string
  foreground: string
}

type Asset = {
  id: string
  name: string
  symbol: string
  uri: string
  image: string
  background: string
  foreground: string
  type: string
  class: string
  exchange: string
}

type Item = {
  title: string
  html?: string
  uri: string
  images: string[]
  background: string
  foreground: string
  count: number
}

const leaguePlayers: Record<SportsLeague, Player[] | undefined> = {
  ALL: undefined,
  PGA: undefined,
  FC: undefined,
  NBA: undefined,
  NFL: undefined,
  MLB: undefined,
  NHL: undefined,
}

const leagueTeams: Record<SportsLeague, Team[] | undefined> = {
  ALL: undefined,
  PGA: undefined,
  FC: undefined,
  NBA: undefined,
  NFL: undefined,
  MLB: undefined,
  NHL: undefined,
}

const assetDetails: Asset[] = []

async function populatePlayers() {
  for (const league of leagues) {
    if (league === 'ALL' || league === 'MONEY') continue

    const gameraPlayers = await getPlayers({ league })
    const players = gameraPlayers.map((gp) => ({
      id: gp.id,
      league,
      name: gp.usedName,
      uri: getUrlForEntity(gp.entity),
      image: gp.bustImageUrl,
      background: gp.colors?.backgroundColor,
      foreground: gp.colors?.foregroundColor,
      lastAppearanceDate: gp.lastAppearanceDate,
    }))

    leaguePlayers[league] = players
  }
}

async function populateTeams() {
  for (const league of leagues) {
    if (league === 'ALL' || league === 'PGA' || league === 'MONEY') continue

    const gameraTeams = await getTeams({ league })
    const teams: Team[] = []
    for (const team of gameraTeams.teams.filter((t) => t.isActive)) {
      let gameraTeam = await getTeam({
        league,
        id: team.teamId,
        year: team.endYear,
      })
      if (!gameraTeam || !gameraTeam.season) continue

      if (!gameraTeam.teamRepresentatives?.length) {
        const previousYear = await getTeam({
          league,
          id: team.teamId,
          year: team.endYear - 1,
        })

        if (previousYear?.teamRepresentatives?.length) gameraTeam = previousYear
      }

      const [season] = gameraTeam.season.all
      teams.push({
        id: gameraTeam.teamId,
        league,
        name: gameraTeam.nameDetail,
        uri: getUrlForEntity(season.entity),
        reps: gameraTeam.teamRepresentatives.map((r) => ({
          name: r.entity?.display,
          image: r.url,
        })),
        image: gameraTeam.logoImageUrl,
        background: gameraTeam.colors?.backgroundColor,
        foreground: gameraTeam.colors?.foregroundColor,
      })
    }

    leagueTeams[league] = teams
  }
}

async function getAsset(assetId: string) {
  const existing = assetDetails.find((a) => a.id === assetId)
  if (existing) return existing

  const profile = await fetchAsset(assetId)
  if (!profile.asset) {
    console.log('profile', profile)
    return undefined
  }

  const image = profile.subjectImage
  const name = profile.asset.canonicalName || profile.asset.officialName
  const asset = {
    id: profile.asset.assetId,
    name,
    symbol: profile.asset.symbol,
    uri:
      profile.asset.type === 'Stock'
        ? `/money/symbol/${profile.asset.symbol}`
        : `/money/ask/${createSlug(name)}`,
    image: image?.imageUrl,
    background: image.colors?.background,
    foreground: image.colors?.foreground,
    class: profile.asset.class,
    type: profile.asset.type,
    exchange: profile.asset.exchange,
  }
  assetDetails.push(asset)

  return asset
}

function* chunk<T>(arr: T[], n: number): Generator<T[], void> {
  for (let i = 0; i < arr.length; i += n) {
    yield arr.slice(i, i + n)
  }
}

async function update(
  timeframe: Timeframe,
  league: League,
  location: Location,
) {
  if (leaguePlayers.NBA === undefined) await populatePlayers()
  if (leagueTeams.NBA === undefined) await populateTeams()

  const thisYearPredicate = `DATE(day) >= DATE('${new Date().getFullYear()}-01-01')`
  const last24HoursPredicate = `
    ((DATE(day) >= current_date - interval '1' day
    AND CAST(hr AS BIGINT) >= extract(HOUR FROM current_time))
    OR DATE(day) > current_date - interval '1' day)
  `.trim()
  const lastNDaysPredicate = (n: number) =>
    `DATE(day) >= current_date - interval '${n}' day`

  const timeframePredicate =
    timeframe === 'THIS_YEAR'
      ? thisYearPredicate
      : timeframe === 'LAST_30_DAYS'
      ? lastNDaysPredicate(30)
      : timeframe === 'LAST_7_DAYS'
      ? lastNDaysPredicate(7)
      : last24HoursPredicate

  const sql = `
    SELECT uri, COUNT(*) as count
    FROM statmuse.cdn_request
    WHERE 
      regexp_like(uri, '^/${
        league === 'ALL' ? '\\w+' : `${league.toLowerCase()}`
      }/ask[/|?]')
      AND method = 'GET'
      AND prefetch = false
      AND ${timeframePredicate}
      ${location !== 'GLOBAL' ? `AND country = '${location}'` : ''}
    GROUP BY uri
    ORDER BY COUNT(*) DESC
    LIMIT ${LIMIT};
  `.trim()

  const results = await athenaClient.query(sql).then((r) => r.Items)

  const queries: {
    uri: string
    league: string
    query: string
    count: number
    image: string
    background: string
    foreground: string
    players?: Player[]
    teams?: Team[]
    assets?: Asset[]
  }[] = []

  const chunks = chunk(results, 10)
  for (const batch of chunks) {
    const promises = batch.map(async (record) => {
      const uri = decodeURIComponent(record.uri)
      const count = Number(record.count)

      let [, leagueName, , query] = record.uri.split('/')
      const league = leagueName.toUpperCase() as League
      if (query) query = query.replace(/-/g, ' ')
      if (!query && !record.uri.includes('?q=')) return

      if (!query) query = record.uri.split('?q=')[1]?.replace(/\+/g, ' ')
      try {
        query = decodeURIComponent(query)
      } catch (error) {
        console.log('error decoding', query)
        console.error(error)
      }

      if (league === 'MONEY') {
        const ask = await Ask.getFinance({ query })
        const response = ask?.answer
        if (!response || response.type === 'error') return

        const subject = response.visual?.summary?.subject
        const contentReference = response.visual?.contentReference

        const assets: Asset[] = []
        for (const assetId of contentReference?.questionTags?.assetIds || []) {
          const asset = await getAsset(assetId)

          if (!asset) {
            console.log('no asset found', assetId)
            console.log('query', query)
            console.log('contentReference', contentReference)
            continue
          }

          assets.push(asset)
        }

        const image = subject?.imageUrl
        const background = subject?.colors?.background
        const foreground = subject?.colors?.foreground

        queries.push({
          uri,
          league,
          query,
          count,
          image,
          background,
          foreground,
          assets,
        })
      } else {
        const context_id = contexts.find((c) =>
          leagueName === 'fc' ? c.name === 'epl' : c.name === leagueName,
        )?.id

        let { answer: response } = (await Ask.get({ context_id, query })) || {}
        if (!response && !isProduction) response = await ask({ league, query })
        if (!response || response.type === 'error') return

        const subject = response.visual?.summary?.subject
        const contentReference = response.visual?.contentReference

        const players =
          contentReference?.questionTags?.playerIds
            .map((id) => {
              const player = leaguePlayers[league].find((p) => p.id === id)
              if (!player) {
                console.log('no player found', id)
                console.log('query', query)
                console.log('contentReference', contentReference)
                return undefined
              }

              return player
            })
            .filter((p) => !!p) || []
        const teams =
          contentReference?.questionTags?.teamIds
            .map((id) => {
              const team = leagueTeams[league].find((t) => t.id === id)
              if (!team) {
                console.log('no team found', id)
                console.log('query', query)
                console.log('contentReference', contentReference)
                return undefined
              }

              return team
            })
            .filter((p) => !!p) || []

        const image = subject?.imageUrl
        const background = subject?.colors?.background
        const foreground = subject?.colors?.foreground

        queries.push({
          uri,
          league,
          query,
          count,
          image,
          background,
          foreground,
          players,
          teams,
        })
      }
    })

    await Promise.all(promises)
  }

  const uniquePlayers = Array.from(
    new Set(
      queries
        .filter((q) => q.players && q.players.length)
        .map((q) => q.players.map((p) => JSON.stringify(p)))
        .flat(),
    ),
  ).map((s) => JSON.parse(s) as Player)

  const players = uniquePlayers
    .map((player) => {
      const id = player.id
      const queriesForPlayer = queries
        .filter((q) => q.players?.map((p) => p.id).includes(id))
        .sort((a, b) => b.count - a.count)
      const count = queriesForPlayer.reduce((a, b) => a + b.count, 0)
      return { ...player, count }
    })
    .sort((a, b) => b.count - a.count)

  const [topPlayer] = players || []

  const uniqueTeams = Array.from(
    new Set(
      queries
        .filter((q) => q.teams && q.teams.length)
        .map((q) => q.teams.map((t) => JSON.stringify(t)))
        .flat(),
    ),
  ).map((s) => JSON.parse(s) as Team)

  const uniqueTeamId = (team: Team) => `${team.league}.${team.id}`

  const teams = uniqueTeams
    .map((team) => {
      const id = uniqueTeamId(team)
      const queriesForTeam = queries
        .filter((q) => q.teams?.map(uniqueTeamId).includes(id))
        .sort((a, b) => b.count - a.count)
      const count = queriesForTeam.reduce((a, b) => a + b.count, 0)
      return { ...team, count }
    })
    .sort((a, b) => b.count - a.count)

  const [topTeam] = teams || []

  const uniqueAssets = Array.from(
    new Set(
      queries
        .filter((q) => q.assets && q.assets.length)
        .map((q) => q.assets.map((p) => JSON.stringify(p)))
        .flat(),
    ),
  ).map((s) => JSON.parse(s) as Asset)

  const assets = uniqueAssets
    .map((asset) => {
      const id = asset.id
      const queriesForAsset = queries
        .filter((q) => q.assets?.map((p) => p.id).includes(id))
        .sort((a, b) => b.count - a.count)
      const count = queriesForAsset.reduce((a, b) => a + b.count, 0)
      return { ...asset, count }
    })
    .sort((a, b) => b.count - a.count)

  const [topAsset] = assets || []
  const bitcoinAsset = assets.find((a) => a.name === 'Bitcoin')

  const stocks = assets
    .filter((a) => a.type === 'Stock')
    .sort((a, b) => b.count - a.count)

  const etfs = assets
    .filter((a) => a.type === 'ETF')
    .sort((a, b) => b.count - a.count)

  const currencies = assets
    .filter((a) => a.type.includes('Currency'))
    .sort((a, b) => b.count - a.count)

  const nyse = assets
    .filter((a) => a.exchange === 'NYSE')
    .sort((a, b) => b.count - a.count)

  const nasdaq = assets
    .filter((a) => a.exchange === 'NASDAQ')
    .sort((a, b) => b.count - a.count)

  const datasets: {
    name: string
    key: string
    prominent?: boolean
    items: Item[]
  }[] = [
    {
      name: 'Searches',
      key: 'searches',
      items: queries
        .map((q) => ({
          title: q.query,
          uri: q.uri,
          images: [q.image],
          background: q.background,
          foreground: q.foreground,
          count: q.count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, STORE),
    },
  ]

  if (players?.length) {
    datasets.push({
      name: 'Players',
      key: 'players',
      prominent: true,
      items: players
        .map((p) => ({
          title: p.name,
          uri: p.uri,
          images: [p.image],
          background: p.background,
          foreground: p.foreground,
          count: p.count,
          lastAppearanceDate: p.lastAppearanceDate,
        }))
        .slice(0, STORE),
    })
  }

  if (teams?.length) {
    datasets.push({
      name: 'Teams',
      key: 'teams',
      prominent: true,
      items: teams
        .map((t) => ({
          title: t.name.nickname ?? t.name.name ?? t.name.abbreviation,
          images: t.reps?.length ? t.reps.map((r) => r.image) : [t.image],
          uri: t.uri,
          background: t.background,
          foreground: t.foreground,
          count: t.count,
        }))
        .slice(0, STORE),
    })
  }

  if (league === 'MONEY' && assets?.length) {
    datasets.push({
      name: 'Assets',
      key: 'assets',
      items: assets
        .map((s) => ({
          title: s.name,
          uri: s.uri,
          images: [s.image],
          background: s.background,
          foreground: s.foreground,
          count: s.count,
        }))
        .slice(0, STORE),
    })
  }

  if (topPlayer) {
    const id = topPlayer.id
    const queriesForPlayer = queries
      .filter((q) => q.players?.map((p) => p.id).includes(id))
      .sort((a, b) => b.count - a.count)
      .slice(0, STORE)

    datasets.push({
      name: topPlayer.name + ' Searches',
      key: 'player',
      items: queriesForPlayer
        .map((q) => ({
          title: q.query,
          uri: q.uri,
          images: [q.image],
          background: q.background,
          foreground: q.foreground,
          count: q.count,
        }))
        .slice(0, STORE),
    })
  }

  if (topTeam) {
    const id = uniqueTeamId(topTeam)
    const queriesForTeam = queries
      .filter((q) => q.teams?.map(uniqueTeamId).includes(id))
      .sort((a, b) => b.count - a.count)
      .slice(0, STORE)

    datasets.push({
      name: (topTeam.name.nickname || topTeam.name.name) + ' Searches',
      key: 'team',
      items: queriesForTeam
        .map((q) => ({
          title: q.query,
          uri: q.uri,
          images: [q.image],
          background: q.background,
          foreground: q.foreground,
          count: q.count,
        }))
        .slice(0, STORE),
    })
  }

  if (league === 'MONEY' && topAsset) {
    const id = topAsset.id
    const queriesForAsset = queries
      .filter((q) => q.assets?.map((p) => p.id).includes(id))
      .sort((a, b) => b.count - a.count)
      .slice(0, STORE)

    datasets.push({
      name: topAsset.name + ' Searches',
      key: 'asset',
      items: queriesForAsset
        .map((q) => ({
          title: q.query,
          uri: q.uri,
          images: [q.image],
          background: q.background,
          foreground: q.foreground,
          count: q.count,
        }))
        .slice(0, STORE),
    })
  }

  if (league === 'MONEY' && bitcoinAsset && topAsset.name !== 'Bitcoin') {
    const id = bitcoinAsset.id
    const queriesForAsset = queries
      .filter((q) => q.assets?.map((p) => p.id).includes(id))
      .sort((a, b) => b.count - a.count)
      .slice(0, STORE)

    datasets.push({
      name: bitcoinAsset.name + ' Searches',
      key: 'asset',
      items: queriesForAsset
        .map((q) => ({
          title: q.query,
          uri: q.uri,
          images: [q.image],
          background: q.background,
          foreground: q.foreground,
          count: q.count,
        }))
        .slice(0, STORE),
    })
  }

  if (league === 'MONEY' && stocks?.length) {
    datasets.push({
      name: 'Stocks',
      key: 'stocks',
      prominent: true,
      items: stocks
        .map((s) => ({
          title: s.name,
          uri: s.uri,
          images: [s.image],
          background: s.background,
          foreground: s.foreground,
          count: s.count,
        }))
        .slice(0, STORE),
    })
  }

  if (league === 'MONEY' && currencies?.length) {
    datasets.push({
      name: 'Currencies',
      key: 'currencies',
      prominent: true,
      items: currencies
        .map((s) => ({
          title: s.name,
          uri: s.uri,
          images: [s.image],
          background: s.background,
          foreground: s.foreground,
          count: s.count,
        }))
        .slice(0, STORE),
    })
  }

  if (league === 'MONEY' && nyse?.length) {
    datasets.push({
      name: 'NYSE Stocks',
      key: 'nyse',
      prominent: true,
      items: nyse
        .map((s) => ({
          title: s.name,
          uri: s.uri,
          images: [s.image],
          background: s.background,
          foreground: s.foreground,
          count: s.count,
        }))
        .slice(0, STORE),
    })
  }

  if (league === 'MONEY' && nasdaq?.length) {
    datasets.push({
      name: 'NASDAQ Stocks',
      key: 'nasdaq',
      prominent: true,
      items: nasdaq
        .map((s) => ({
          title: s.name,
          uri: s.uri,
          images: [s.image],
          background: s.background,
          foreground: s.foreground,
          count: s.count,
        }))
        .slice(0, STORE),
    })
  }

  if (league === 'MONEY' && etfs?.length) {
    datasets.push({
      name: 'ETFs',
      key: 'etfs',
      prominent: true,
      items: etfs
        .map((s) => ({
          title: s.symbol,
          uri: s.uri,
          images: [s.image],
          background: s.background,
          foreground: s.foreground,
          count: s.count,
        }))
        .slice(0, STORE),
    })
  }

  const item = {
    pk: `${league}#${timeframe}#${location}`,
    sk: new Date().toISOString().split('T')[0],
    updated: new Date().toISOString(),
    datasets,
  }

  await db.send(
    new PutCommand({
      TableName: Table['trending-table'].tableName,
      Item: item,
    }),
  )

  console.log('pk updated', item.pk)
}

async function handleHourlyUpdate() {
  for (const league of leagues) {
    await update('LAST_24_HOURS', league, 'GLOBAL')

    for (const country of countries) {
      await update('LAST_24_HOURS', league, country)
    }
  }
}

async function handleDailyUpdate() {
  for (const league of leagues) {
    for (const timeframe of timeframes) {
      if (timeframe === 'LAST_24_HOURS') continue

      await update(timeframe, league, 'GLOBAL')

      for (const country of countries) {
        await update(timeframe, league, country)
      }
    }
  }
}

async function ask(options: {
  league: League
  query: string
  conversationToken?: string
  preferredDomain?: string
}) {
  const league = options.league === 'FC' ? 'epl' : options.league
  const query = options.query
  const params: Record<string, string> = {
    input: query,
  }
  if (options.conversationToken) {
    params['conversationToken'] = options.conversationToken
  }
  if (options.preferredDomain) {
    params['preferredDomain'] = options.preferredDomain
  }
  const path = `${league ? league.toLowerCase() + '/' : ''}answer`
  const requestUrl = `${gameraApiUrl}${path}?${new URLSearchParams(
    params as Record<string, string>,
  ).toString()}`
  try {
    const response = await fetch(requestUrl, { headers })
    return response.json() as Promise<GameraResponse>
  } catch (error) {
    console.error(error)
    return undefined
  }
}

async function getPlayers(options: { league: League }) {
  const league = options.league
  if (league === 'ALL') throw new Error('Invalid league')

  const path = `${league === 'FC' ? 'epl' : league.toLowerCase()}/players/v2`
  const requestUrl = `${gameraApiUrl}${path}`
  const players: GameraPlayer[] = []

  const inner = async (cursor?: string): Promise<GameraPlayer[]> => {
    try {
      const response = await fetch(
        requestUrl + (cursor ? '?cursor=' + cursor : ''),
        { headers },
      )
      const json: GameraPlayers = await response.json()
      players.push(...json.items)

      if (json.paging.cursor) {
        return inner(json.paging.cursor)
      }

      return players
    } catch (error) {
      console.error(error)
      return undefined
    }
  }

  return inner()
}

async function fetchAsset(assetId: string) {
  const path = `asset/${assetId}`
  const requestUrl = `${kanedamaApiUrl}${path}`

  try {
    const response = await fetch(requestUrl, { headers })
    const json: KanedamaAssetProfile = await response.json()
    return json
  } catch (error) {
    console.error(error)
    return undefined
  }
}

async function getTeams(options: { league: League }) {
  const league = options.league
  if (league === 'ALL') throw new Error('Invalid league')

  const path = `${league === 'FC' ? 'epl' : league.toLowerCase()}/teams/v2`
  const requestUrl = `${gameraApiUrl}${path}`

  try {
    const response = await fetch(requestUrl, { headers })
    return response.json() as Promise<GameraTeams>
  } catch (error) {
    console.error(error)
    return undefined
  }
}

async function getTeam(options: {
  league: League
  id: number
  year: number
}): Promise<GameraTeamSeasonBio | undefined> {
  const league = options.league
  if (league === 'ALL') throw new Error('Invalid league')

  const id = options.id
  const year = options.year
  const path =
    league === 'FC'
      ? `epl/teams/${id}/${year}/bio`
      : `${league.toLowerCase()}/teams/v2/${id}/${year}/bio`
  const requestUrl = `${gameraApiUrl}${path}`

  try {
    const response = await fetch(requestUrl, { headers })
    const json = (await response.json()) as GameraTeamSeasonBio
    if (json['error']) return undefined

    return json
  } catch (error) {
    console.error(error)
    return undefined
  }
}

type GameraTeams = {
  domain: League
  teams: [
    {
      abbreviation: string
      actorId: string
      beginYear: number
      endYear: number
      imageUrl: string
      isActive: boolean
      name: string
      nickname: string
      teamId: number
    },
  ]
}

type GameraPlayer = {
  id: number
  usedName: string
  firstName: string
  lastName: string
  entity: GameraEntity
  colors: {
    foregroundColor: string
    backgroundColor: string
  }
  bustImageUrl: string
  lastAppearanceDate?: string
}

type GameraPlayers = {
  items: GameraPlayer[]
  paging: {
    totalCount: number
    cursor: string
  }
}

type KanedamaAsset = {
  assetId: string
  canonicalName: string
  officialName: string
  symbol: string
  exchange: string
  class: AssetClass
  type: string
  shouldSyncPrice: boolean
  isActive: boolean
  dataCoverage: {
    value: {
      minDailyTimestamp: {
        value: number
      }
      maxDailyTimestamp: {
        value: number
      }
      minIntradayTimestamp: {
        value: number
      }
      maxIntradayTimestamp: {
        value: number
      }
    }
  }
}

type KanedamaImage = {
  imageId?: string
  imageUrl: string
  colors: [
    {
      colorId?: string
      background: string
      foreground: string
    },
  ]
}

type AssetClass = 'money' | 'equity'

type KanedamaAssetProfile = {
  asset: KanedamaAsset
  images: KanedamaImage[]
  subjectImage: {
    imageUrl: string
    colors: {
      background: string
      foreground: string
    }
  }
}
