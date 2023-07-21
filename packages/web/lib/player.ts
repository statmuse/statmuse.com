import type {
  GameraDomain,
  GameraPlayerBio,
  GameraPlayerGameLog,
  GameraPlayerProfileResponse,
  GameraPlayerSplits,
  GameraPlayerStats,
} from '@statmuse/core/gamera'
import { parsePlayerId } from './parse'
import { gameraApiUrl } from '@lib/gamera'
import { db } from '@statmuse/core/db'

export const getPlayerBio = async (domain: GameraDomain, player: string) => {
  const playerId = parsePlayerId(player)
  const requestUrl = `${gameraApiUrl}${domain}/players/v2/${playerId}/bio`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as GameraPlayerBio
  return data
}

export const getPlayerProfile = async (
  domain: GameraDomain,
  player: string
) => {
  const playerId = parsePlayerId(player)
  const requestUrl = `${gameraApiUrl}${domain}/players/v2/${playerId}`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as GameraPlayerProfileResponse
  return data
}

export const getPlayerStats = async (props: {
  domain: GameraDomain
  player: string
  params: URLSearchParams
}) => {
  const { player, domain, params } = props
  const playerId = parsePlayerId(player)
  let requestUrl = `${gameraApiUrl}${domain}/players/v2/${playerId}/careerStats`
  if (params) requestUrl += `?${params.toString()}`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as GameraPlayerStats
  return data
}

export const getPlayerGameLog = async (props: {
  domain: GameraDomain
  player: string
  params: URLSearchParams
}) => {
  const { player, domain, params } = props
  const playerId = parsePlayerId(player)
  let requestUrl = `${gameraApiUrl}${domain}/players/v2/${playerId}/gameLog`
  if (params) requestUrl += `?${params.toString()}`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as GameraPlayerGameLog
  return data
}

export const getPlayerSplits = async (props: {
  domain: GameraDomain
  player: string
  params: URLSearchParams
}) => {
  const { player, domain, params } = props
  const playerId = parsePlayerId(player)
  let requestUrl = `${gameraApiUrl}${domain}/players/v2/${playerId}/splits`
  if (params) requestUrl += `?${params.toString()}`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as GameraPlayerSplits
  return data
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

  return query.selectAll('players')
  .select(['leagues.name as league_name'])
  .execute()
}

export type PlayerGalleryItem = Awaited<ReturnType<typeof getPlayerGalleryList>>[number]