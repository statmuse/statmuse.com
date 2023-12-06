import type {
  GameraDomain,
  GameraEntity,
  GameraTeamFranchiseOverview,
  GameraTeamSeasonBio,
  GameraTeamSeasonGameResults,
  GameraTeamSeasonOverview,
  GameraTeamSeasonPlayerStats,
  GameraTeamSeasonRoster,
  GameraTeamSeasonSchedule,
  GameraTeamSeasonSplits,
  GameraTeamSeasonStats,
} from '@statmuse/core/gamera'
import { parseTeamId, parseYearId } from './parse'
import { request } from '@lib/gamera'
import type { Context } from '@lib/session'

export const getTeamSeasonOverview = async (props: {
  context: Context
  domain: GameraDomain
  team: string
  year: string
}) => {
  try {
    const teamId = parseTeamId(props.team)
    const yearId = parseYearId(props.year)
    const path = `${props.domain}/teams/${teamId}/${yearId}`
    const data = await request<GameraTeamSeasonOverview & { error?: string }>(
      props.context,
      path,
    )
    if (data?.error) return undefined
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getTeamSeasonBio = async (props: {
  context: Context
  domain: GameraDomain
  team: string
  year: string
}) => {
  try {
    const teamId = parseTeamId(props.team)
    const yearId = parseYearId(props.year)
    const path = `${props.domain}/teams/${teamId}/${yearId}/bio`
    return request<GameraTeamSeasonBio>(props.context, path)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getTeamSeasonStats = async (props: {
  context: Context
  domain: GameraDomain
  team: string
  year: string
  params: URLSearchParams
}) => {
  try {
    const teamId = parseTeamId(props.team)
    const yearId = parseYearId(props.year)
    const path = `${props.domain}/teams/${teamId}/${yearId}/stats`
    return request<GameraTeamSeasonStats>(props.context, path, props.params)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getTeamSeasonPlayerStats = async (props: {
  context: Context
  domain: GameraDomain
  team: string
  year: string
  params: URLSearchParams
}) => {
  try {
    const teamId = parseTeamId(props.team)
    const yearId = parseYearId(props.year)
    const path = `${props.domain}/teams/${teamId}/${yearId}/playerStats`
    return request<GameraTeamSeasonPlayerStats>(
      props.context,
      path,
      props.params,
    )
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getTeamSeasonGameResults = async (props: {
  context: Context
  domain: GameraDomain
  team: string
  year: string
}) => {
  try {
    const teamId = parseTeamId(props.team)
    const yearId = parseYearId(props.year)
    const path = `${props.domain}/teams/${teamId}/${yearId}/gameResults`
    return request<GameraTeamSeasonGameResults>(props.context, path)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getTeamSeasonSchedule = async (props: {
  context: Context
  domain: GameraDomain
  team: string
  year: string
}) => {
  try {
    const teamId = parseTeamId(props.team)
    const yearId = parseYearId(props.year)
    const path = `${props.domain}/teams/${teamId}/${yearId}/schedule`
    return request<GameraTeamSeasonSchedule>(props.context, path)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getTeamSeasonRoster = async (props: {
  context: Context
  domain: GameraDomain
  team: string
  year: string
}) => {
  try {
    const teamId = parseTeamId(props.team)
    const yearId = parseYearId(props.year)
    const path = `${props.domain}/teams/${teamId}/${yearId}/roster`
    return request<GameraTeamSeasonRoster>(props.context, path)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getTeamSeasonSplits = async (props: {
  context: Context
  domain: GameraDomain
  team: string
  year: string
  params: URLSearchParams
}) => {
  try {
    const teamId = parseTeamId(props.team)
    const yearId = parseYearId(props.year)
    const path = `${props.domain}/teams/${teamId}/${yearId}/splits`
    return request<GameraTeamSeasonSplits>(props.context, path, props.params)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getTeamFranchiseOverview = async (props: {
  context: Context
  domain: GameraDomain
  team: string
}) => {
  try {
    const teamId = parseTeamId(props.team)
    const path = `${props.domain}/teams/${teamId}`
    return request<GameraTeamFranchiseOverview>(props.context, path)
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getTeamFranchiseLatestSeason = async (props: {
  context: Context
  domain: GameraDomain
  teamId: string
}) => {
  try {
    const path = `${props.domain}/teams/${props.teamId}/latestseason`
    const data = await request<{
      name: string
      entity: GameraEntity
      error?: {
        code: string
        message: string
      }
    }>(props.context, path)
    if (data?.error) return undefined
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
