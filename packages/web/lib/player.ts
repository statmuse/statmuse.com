import type {
  GameraDomain,
  GameraPlayerBio,
  GameraPlayerGameLog,
  GameraPlayerProfileResponse,
  GameraPlayerSplits,
  GameraPlayerStats,
} from '@statmuse/core/gamera'
import { parsePlayerId } from './parse'
import { request } from '@lib/gamera'
import { db } from '@statmuse/core/db'
import type { Context } from '@lib/session'

export const getPlayerBio = async (
  context: Context,
  domain: GameraDomain,
  player: string,
) => {
  try {
    const playerId = parsePlayerId(player)
    const path = `${domain}/players/v2/${playerId}/bio`
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
    const path = `${domain}/players/v2/${playerId}`
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
    const path = `${props.domain}/players/v2/${playerId}/careerStats`
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
    const path = `${props.domain}/players/v2/${playerId}/gameLog`
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
    const path = `${props.domain}/players/v2/${playerId}/splits`
    return request<GameraPlayerSplits>(props.context, path, props.params)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getPlayerGalleryList = async (league?: string) => {
  let query = db
    .selectFrom('players')
    .innerJoin('leagues', 'leagues.id', 'players.league_id')
    .where('players.bust_image_url', 'is not', null)
    .orderBy('players.last_name')
    .orderBy('players.first_name')
    .orderBy('players.resource_id')

  if (league) {
    query = query.where('leagues.name', '=', league)
  }

  return query.selectAll('players').select(['leagues.name as domain']).execute()
}

export type PlayerGalleryItem = Awaited<
  ReturnType<typeof getPlayerGalleryList>
>[number]
