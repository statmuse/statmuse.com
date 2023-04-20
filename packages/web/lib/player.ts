import type {
  GameraDomain,
  GameraPlayerBio,
  GameraPlayerProfileResponse,
  GameraPlayerStats,
  GameraPlayerGameLog,
  GameraPlayerSplits,
} from '@lib/gamera'
import { parsePlayerId } from './parse'

const gameraApiUrl = import.meta.env.GAMERA_API_URL

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
