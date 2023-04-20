import type {
  GameraDomain,
  GameraTeamSeasonBio,
  GameraTeamSeasonOverview,
  GameraTeamSeasonStats,
  GameraTeamSeasonPlayerStats,
  GameraTeamSeasonGameResults,
  GameraTeamSeasonRoster,
  GameraTeamSeasonSplits,
  GameraTeamFranchiseOverview,
} from '@lib/gamera'
import { parseTeamId, parseYearId } from './parse'

const gameraApiUrl = import.meta.env.GAMERA_API_URL

export const getTeamSeasonOverview = async (props: {
  domain: GameraDomain
  team: string
  year: string
}) => {
  const { team, domain, year } = props
  const teamId = parseTeamId(team)
  const yearId = parseYearId(year)
  const requestUrl = `${gameraApiUrl}${domain}/teams/v2/${teamId}/${yearId}`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as GameraTeamSeasonOverview
  return data
}

export const getTeamSeasonBio = async (props: {
  domain: GameraDomain
  team: string
  year: string
}) => {
  const { team, domain, year } = props
  const teamId = parseTeamId(team)
  const yearId = parseYearId(year)
  const requestUrl = `${gameraApiUrl}${domain}/teams/v2/${teamId}/${yearId}/bio`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as GameraTeamSeasonBio
  return data
}

export const getTeamSeasonStats = async (props: {
  domain: GameraDomain
  team: string
  year: string
  params: URLSearchParams
}) => {
  const { team, year, domain, params } = props
  const teamId = parseTeamId(team)
  const yearId = parseYearId(year)
  let requestUrl = `${gameraApiUrl}${domain}/teams/v2/${teamId}/${yearId}/stats`
  if (params) requestUrl += `?${params.toString()}`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as GameraTeamSeasonStats
  return data
}

export const getTeamSeasonPlayerStats = async (props: {
  domain: GameraDomain
  team: string
  year: string
  params: URLSearchParams
}) => {
  const { team, year, domain, params } = props
  const teamId = parseTeamId(team)
  const yearId = parseYearId(year)
  let requestUrl = `${gameraApiUrl}${domain}/teams/v2/${teamId}/${yearId}/playerStats`
  if (params) requestUrl += `?${params.toString()}`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as GameraTeamSeasonPlayerStats
  return data
}

export const getTeamSeasonGameResults = async (props: {
  domain: GameraDomain
  team: string
  year: string
}) => {
  const { team, year, domain } = props
  const teamId = parseTeamId(team)
  const yearId = parseYearId(year)
  const requestUrl = `${gameraApiUrl}${domain}/teams/v2/${teamId}/${yearId}/gameResults`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as GameraTeamSeasonGameResults
  return data
}

export const getTeamSeasonRoster = async (props: {
  domain: GameraDomain
  team: string
  year: string
}) => {
  const { team, year, domain } = props
  const teamId = parseTeamId(team)
  const yearId = parseYearId(year)
  const requestUrl = `${gameraApiUrl}${domain}/teams/v2/${teamId}/${yearId}/roster`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as GameraTeamSeasonRoster
  return data
}

export const getTeamSeasonSplits = async (props: {
  domain: GameraDomain
  team: string
  year: string
  params: URLSearchParams
}) => {
  const { team, year, domain, params } = props
  const teamId = parseTeamId(team)
  const yearId = parseYearId(year)
  let requestUrl = `${gameraApiUrl}${domain}/teams/v2/${teamId}/${yearId}/splits`
  if (params) requestUrl += `?${params.toString()}`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as GameraTeamSeasonSplits
  return data
}

export const getTeamFranchiseOverview = async (props: {
  domain: GameraDomain
  team: string
}) => {
  const { team, domain } = props
  const teamId = parseTeamId(team)
  const requestUrl = `${gameraApiUrl}${domain}/teams/v2/${teamId}`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as GameraTeamFranchiseOverview
  return data
}
