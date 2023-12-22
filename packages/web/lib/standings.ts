import type { StandingsResponse } from '@statmuse/core/gamera'
import { request } from '@lib/gamera'
import type { Context } from '@lib/session'

export const getStandings = async (props: {
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
