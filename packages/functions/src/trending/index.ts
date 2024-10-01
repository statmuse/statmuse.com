import { JobHandler } from 'sst/node/job'
import { Config } from 'sst/node/config'
import { AthenaClient } from '@aws-sdk/client-athena'
import { S3Client } from '@aws-sdk/client-s3'
import { AthenaExpress } from 'athena-express-plus'
import {
  getUrlForEntity,
  type GameraEntity,
  type GameraTeamSeasonBio,
} from '@statmuse/core/gamera'
import { Table } from 'sst/node/table'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { createSlug } from '@statmuse/core/path'
import { last } from 'lodash-es'
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
type Query = {
  url: string
  count: number
  domain: string
  page_type: string
  query?: string
  players?: string
  teams?: string
  assets?: string
  image?: string
  background?: string
  foreground?: string
}
const athenaClient = new AthenaExpress<Query>(athenaProps)

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
})

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
  latestAppearanceDate?: string
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
      latestAppearanceDate: gp.latestAppearanceDate,
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
  if (!profile?.asset) {
    console.log('profile', profile)
    return undefined
  }

  const image = profile?.subjectImage
  const name = profile?.asset.canonicalName || profile?.asset.officialName || ''
  const asset = {
    id: profile?.asset.assetId,
    name,
    symbol: profile?.asset.symbol,
    uri:
      profile?.asset.type === 'Stock'
        ? `/money/symbol/${profile.asset.symbol}`
        : `/money/ask/${createSlug(name)}`,
    image: image?.imageUrl,
    background: image?.colors?.background,
    foreground: image?.colors?.foreground,
    class: profile?.asset.class,
    type: profile?.asset.type,
    exchange: profile?.asset.exchange,
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
    SELECT context_page_url as url, query, page_domain as domain, page_type, players, teams, assets, subject_image as image, subject_background_color as background, subject_foreground_color as foreground, count(*) as count
    FROM statmuse.pageview
    WHERE 
      is_search = True
      AND (origin = 'web' OR origin = 'native')
      AND channel = 'client'
      AND ${timeframePredicate}
      ${location !== 'GLOBAL' ? `AND country = '${location}'` : ''}
      ${
        league !== 'ALL'
          ? `AND page_domain = '${
              league === 'FC'
                ? 'epl'
                : league === 'MONEY'
                ? 'finance'
                : league.toLowerCase()
            }'`
          : ''
      }
      AND page_type NOT IN ('schedule', 'game')
    GROUP BY context_page_url, players, teams, assets, page_domain, page_type, query, subject_image, subject_background_color, subject_foreground_color
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
    type: string
  }[] = []

  const chunks = chunk(results, 10)
  for (const batch of chunks) {
    const promises = batch.map(async (record) => {
      const playerIds = JSON.parse(record.players ?? '[]') as number[]
      const teamIds = JSON.parse(record.players ?? '[]') as number[]
      const assetIds = JSON.parse(record.assets ?? '[]') as string[]
      const query = record.query
      const domain = record.domain
      const count = Number(record.count)
      const image = record.image
      const background = record.background
      const foreground = record.foreground
      const url = new URL(record.url)
      const pageType = record.page_type

      if (pageType === 'player') {
        const playerSlug = url.pathname.split('/')[3]
        const playerId = last(playerSlug.split('-'))
        if (playerId) {
          playerIds.push(Number(playerId))
        }
      }
      if (pageType === 'team') {
        const teamSlug = url.pathname.split('/')[3]
        const teamId = last(teamSlug.split('-'))
        if (teamId) {
          teamIds.push(Number(teamId))
        }
      }

      if (league === 'MONEY') {
        const assets: Asset[] = []
        for (const assetId of assetIds) {
          const asset = await getAsset(assetId)

          if (!asset) {
            console.log('no asset found: ', assetId)
            console.log('query: ', query)
            continue
          }

          assets.push(asset)
        }

        queries.push({
          uri: url.pathname + url.search,
          type: pageType,
          league,
          query: query ?? assets[0]?.name.toLowerCase(),
          count,
          image: image ?? assets[0]?.image,
          background: background ?? assets[0]?.background,
          foreground: foreground ?? assets[0]?.background,
          assets,
        })
      } else {
        const players =
          playerIds
            .map((id) => {
              const player = leaguePlayers[
                domain === 'epl' ? 'FC' : domain.toUpperCase()
              ]?.find((p) => p.id === id)
              if (!player) {
                if (league !== 'PGA') {
                  console.log('no player found: ', id)
                  console.log('query: ', query)
                }
                return undefined
              }

              return player as Player
            })
            .filter((p) => !!p) || []

        const teams =
          teamIds
            .map((id) => {
              const team = leagueTeams[
                domain === 'epl' ? 'FC' : domain.toUpperCase()
              ]?.find((t) => t.id === id)
              if (!team) {
                if (league !== 'PGA') {
                  console.log('no team found: ', id)
                  console.log('query: ', query)
                }
                return undefined
              }

              return team as Team
            })
            .filter((p) => !!p) || []

        queries.push({
          uri: url.pathname + url.search,
          type: pageType,
          league,
          query:
            query ??
            players[0]?.name.toLowerCase() ??
            teams[0]?.name.name?.toLowerCase(),
          count,
          image: image ?? players[0]?.image ?? teams[0]?.image,
          background:
            background ?? players[0]?.background ?? teams[0]?.background,
          foreground:
            foreground ?? players[0]?.foreground ?? teams[0]?.foreground,
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
          latestAppearanceDate: p.latestAppearanceDate,
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
      .filter(
        (q) => q.type === 'ask' && q.players?.map((p) => p.id).includes(id),
      )
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
      .filter(
        (q) => q.type === 'ask' && q.teams?.map(uniqueTeamId).includes(id),
      )
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
  latestAppearanceDate?: string
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
