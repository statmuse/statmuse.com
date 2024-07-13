import type {
  GameraAnswerEplBoxScore,
  GameraAnswerMlbBoxScore,
  GameraAnswerNbaBoxScore,
  GameraAnswerNflBoxScore,
  GameraAnswerNhlBoxScore,
  ScheduleResponse,
  GameResultsResponse,
} from '@statmuse/core/gamera'
import { parseGameId } from '@lib/parse'
import { request } from '@lib/gamera'
import type { Context } from '@lib/session'

interface Response {
  NBA: GameraAnswerNbaBoxScore
  NFL: GameraAnswerNflBoxScore
  MLB: GameraAnswerMlbBoxScore
  NHL: GameraAnswerNhlBoxScore
  EPL: GameraAnswerEplBoxScore
  PGA: never
}

type Domain = keyof Response

export async function getGame<T extends Domain>(props: {
  context: Context
  domain: T
  game: string
  params?: Record<string, string>
}) {
  if (props.domain === 'PGA')
    throw new Error('There are no PGA boxscores, dummy!')

  try {
    const gameId = parseGameId(props.game)
    const league = props.domain.toLowerCase()
    const path = `${league}/games/${gameId}/answer`
    const data = await request<Response[T]>(props.context, path, props.params)
    if (data) data.domain = props.domain
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getGames = async (props: {
  context: Context
  domain: string
  teamId?: string | number
  seasonYear?: number
}) => {
  try {
    const { domain, context, ...params } = props
    const league = domain.toLowerCase()
    const path = `${league}/games/v2`
    const data = await request<GameResultsResponse>(context, path, params)
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getSchedule = async (props: {
  context: Context
  domain: string
  teamId?: string | number
}) => {
  try {
    const { domain, context, ...params } = props
    const league = domain.toLowerCase()
    const path = `${league}/schedule`
    const data = await request<ScheduleResponse>(context, path, params)
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
