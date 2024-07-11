import type {
  GameraDomain,
  StandingsResponse,
  StandingsMlb,
  StandingsNba,
  StandingsNfl,
  StandingsNhl,
  StandingsEpl,
  GameraGrid,
} from '@statmuse/core/gamera'
import { request } from '@lib/gamera'
import type { Context } from '@lib/session'
import { groupBy } from 'lodash-es'

export const getStandings = async (props: {
  context: Context
  domain: string
  seasonYear?: number
}) => {
  try {
    const league = props.domain.toLowerCase()
    const path = `${league}/standings`
    const data = await request<StandingsResponse>(props.context, path)
    if (data) {
      return {
        ...data,
        domain: props.domain as GameraDomain,
        teams:
          league === 'epl'
            ? { all: data.teams }
            : groupBy(
                data.teams,
                league === 'mlb' ? 'league.name' : 'conference.name',
              ),
      }
    }
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export type GetStandingsResponse = Awaited<ReturnType<typeof getStandings>>

export const getStandingsRaw = async (props: {
  context: Context
  domain: string
  seasonYear?: number
}) => {
  try {
    const league = props.domain.toLowerCase()
    const path = `${league}/standings`
    const data = await request<StandingsResponse>(props.context, path)
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

interface StandingsTeam {
  NBA: StandingsNba
  NFL: StandingsNfl
  NHL: StandingsNhl
  MLB: StandingsMlb
  EPL: StandingsEpl
}

type Domain = keyof StandingsTeam

const mapToGridRow = <T extends Domain>(props: {
  domain: T
  team: StandingsTeam[T]
}): GameraGrid['rows'][number] => {
  if (props.domain === 'MLB') {
    const mlbTeam = props.team as StandingsTeam['MLB']
    return {
      RANK: {
        display: mlbTeam.rank.division + '',
        value: mlbTeam.rank.division,
      },
      name: {
        display: mlbTeam.team.nickname,
        value: mlbTeam.team.nickname,
        imageUrl: mlbTeam.team.logoImageUrl,
        entity: mlbTeam.team.entity,
      },
      wins: mlbTeam.stats.wins,
      losses: mlbTeam.stats.losses,
      winPercent: mlbTeam.stats.winPercent,
      gamesBehind: mlbTeam.stats.gamesBehind.division,
    }
  }

  return {}
}

export const mapStandingsToGrid = <T extends Domain>(props: {
  domain: T
  teams: StandingsTeam[T][]
}) => {
  const { domain } = props

  if (domain === 'MLB') {
    const teams = props.teams as StandingsTeam['MLB'][]
    const columns = [
      {
        rowItemKey: 'name',
        title: 'Team',
        type: 'string',
      },
      {
        rowItemKey: 'wins',
        title: 'W',
        type: 'number',
      },
      {
        rowItemKey: 'losses',
        title: 'L',
        type: 'number',
      },
      {
        rowItemKey: 'winPercent',
        title: 'PCT',
        type: 'number',
      },
      {
        rowItemKey: 'gamesBehind',
        title: 'GB',
        type: 'number',
      },
    ]
    const rows = teams
      .map((team) => mapToGridRow({ domain: 'MLB', team }))
      .sort((a, b) => (a?.RANK.value as number) - (b?.RANK.value as number))

    return { columns, rows }
  }

  return {}
}
