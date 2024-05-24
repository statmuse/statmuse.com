import type { GameraDomain, StandingsResponse } from '@statmuse/core/gamera'
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
