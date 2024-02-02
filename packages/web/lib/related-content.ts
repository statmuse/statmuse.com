import type {
  PlayerCardResponse,
  TeamCardResponse,
} from '@statmuse/core/gamera'
import { request } from '@lib/gamera'
import type { Context } from '@lib/session'

export const getPlayerCards = async (props: {
  context: Context
  domain: string
  teamId?: number
  seasonYear?: number
}) => {
  try {
    const { context, domain, ...params } = props
    const league = domain.toLowerCase()
    const path = `${league}/relatedContent/playerCards`
    const data = await request<PlayerCardResponse>(context, path, params)
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getTeamCards = async (props: {
  context: Context
  domain: string
  teamId?: number
}) => {
  try {
    const { context, domain, ...params } = props
    const league = domain.toLowerCase()
    const path = `${league}/relatedContent/teamCards`
    const data = await request<TeamCardResponse>(context, path, params)
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
