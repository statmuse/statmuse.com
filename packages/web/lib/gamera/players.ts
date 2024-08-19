import type {
  GameraDomain,
  GameraPlayerBio,
  GameraPlayerGameLog,
  GameraPlayerProfileResponse,
  GameraPlayerSplits,
  GameraPlayerStats,
  MlbPlayerStatsResponse,
  MlbSplitType,
  MlbStatKeySet,
  SeasonType,
} from '@statmuse/core/gamera'
import { parsePlayerId } from '../parse'
import { request } from '@lib/gamera/base'
import { dbReader } from '@statmuse/core/db'
import type { Context } from '@lib/session'
import { orderBy } from 'lodash-es'

export const getPositionName = (bio: GameraPlayerBio) => {
  if (bio.domain === 'NBA') {
    switch (bio.position) {
      case 'PG':
        return 'Point Guard'
      case 'SG':
        return 'Shooting Guard'
      case 'SF':
        return 'Small Forward'
      case 'PF':
        return 'Power Forward'
      case 'C':
        return 'Center'
    }
  }

  if (bio.domain === 'NFL') {
    switch (bio.position) {
      case 'QB':
        return 'Quarterback'
      case 'RB':
        return 'Running Back'
      case 'WR':
        return 'Wide Receiver'
      case 'TE':
        return 'Tight End'
      case 'OL':
        return 'Offensive Lineman'
      case 'DL':
        return 'Defensive Lineman'
      case 'LB':
        return 'Linebacker'
      case 'DB':
        return 'Defensive Back'
      case 'K':
        return 'Kicker'
      case 'P':
        return 'Punter'
      case 'LS':
        return 'Long Snapper'
    }
  }

  if (bio.domain === 'MLB') {
    switch (bio.position) {
      case 'P':
        return 'Pitcher'
      case 'C':
        return 'Catcher'
      case '1B':
        return 'First Base'
      case '2B':
        return 'Second Base'
      case '3B':
        return 'Second Base'
      case 'SS':
        return 'Shortstop'
      case 'LF':
        return 'Left Fielder'
      case 'CF':
        return 'Center Fielder'
      case 'RF':
        return 'Right Fielder'
      case 'DH':
        return 'Designated Hitter'
      case 'PH':
        return 'Pinch Hitter'
      case 'PR':
        return 'Pinch Runner'
    }
  }

  if (bio.domain === 'NHL') {
    switch (bio.position) {
      case 'L':
        return 'Left Wing'
      case 'C':
        return 'Center'
      case 'R':
        return 'Right Wing'
      case 'D':
        return 'Defenseman'
      case 'G':
        return 'Goalie'
    }
  }

  return bio.position
}

export const getPlayerBio = async (
  context: Context,
  domain: GameraDomain,
  player: string,
) => {
  try {
    const playerId = parsePlayerId(player)
    const league = domain.toLowerCase()
    const path = `${league}/players/${playerId}/bio`
    const data = await request<GameraPlayerBio & { error?: string }>(
      context,
      path,
    )
    if (data?.error) return undefined
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getPlayerProfile = async (
  context: Context,
  domain: GameraDomain,
  player: string,
) => {
  try {
    const playerId = parsePlayerId(player)
    const league = domain.toLowerCase()
    const path = `${league}/players/${playerId}`
    const data = await request<
      GameraPlayerProfileResponse & { error?: string }
    >(context, path)
    if (data?.error) return undefined
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getPlayerStats = async (props: {
  context: Context
  domain: GameraDomain
  player: string
  params: Record<string, string> | URLSearchParams
}) => {
  try {
    const playerId = parsePlayerId(props.player)
    const league = props.domain.toLowerCase()
    const path = `${league}/players/${playerId}/careerStats`
    return request<GameraPlayerStats>(props.context, path, props.params)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getPlayerGameLog = async (props: {
  context: Context
  domain: GameraDomain
  player: string
  params: Record<string, string> | URLSearchParams
}) => {
  try {
    const playerId = parsePlayerId(props.player)
    const league = props.domain.toLowerCase()
    const path = `${league}/players/${playerId}/gameLog`
    return request<GameraPlayerGameLog>(props.context, path, props.params)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getPlayerSplits = async (props: {
  context: Context
  domain: GameraDomain
  player: string
  params: Record<string, string> | URLSearchParams
}) => {
  try {
    const playerId = parsePlayerId(props.player)
    const league = props.domain.toLowerCase()
    const path = `${league}/players/${playerId}/splits`
    return request<GameraPlayerSplits>(props.context, path, props.params)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getPlayerGalleryList = async (league?: string) => {
  let query = dbReader
    .selectFrom('players')
    .innerJoin('leagues', 'leagues.id', 'players.league_id')
    .where('players.bust_image_url', 'is not', null)

  if (league) {
    query = query.where('leagues.name', '=', league)
  }

  const results = await query
    .selectAll('players')
    .select(['leagues.name as domain'])
    .execute()

  return orderBy(results, (p) =>
    p.last_name && p.used_name.includes(p.last_name)
      ? p.last_name
      : p.used_name,
  )
}

export type PlayerGalleryItem = Awaited<
  ReturnType<typeof getPlayerGalleryList>
>[number]

export const getMlbPlayerSplits = async <
  KS extends keyof MlbStatKeySet,
  // K extends MlbStatKey,
  S extends MlbSplitType,
>(props: {
  context: Context
  seasontype: SeasonType
  teamId: number
  split: S | S[]
  statKeySet: KS | KS[]
  // statKey?: K | K[]
  seasonYear?: number | string
  currentTeamId?: number
  opponentPitcherId?: number
}) => {
  try {
    const { context, ...params } = props
    const path = `mlb/players/stats`
    const data = await request<MlbPlayerStatsResponse<MlbStatKeySet[KS], S>>(
      context,
      path,
      new URLSearchParams(
        Object.entries(params)
          .map(([k, v]) => (Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v]]))
          .flat() as string[][],
      ),
    )
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
