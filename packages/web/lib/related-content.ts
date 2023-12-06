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
    const path = `${props.domain}/relatedContent/playerCards`
    const data = await request<PlayerCardResponse>(props.context, path)
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
    const path = `${props.domain}/relatedContent/teamCards`
    const data = await request<TeamCardResponse>(props.context, path)
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
