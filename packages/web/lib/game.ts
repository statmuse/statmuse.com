import type {
  GameraEplBoxScore,
  GameraMlbBoxScore,
  GameraNbaBoxScore,
  GameraNflBoxScore,
  GameraNhlBoxScore,
  ScheduleResponse,
} from '@statmuse/core/gamera'
import { parseGameId } from '@lib/parse'
import { request } from '@lib/gamera'
import type { Context } from '@lib/session'

interface Response {
  NBA: GameraNbaBoxScore
  NFL: GameraNflBoxScore
  MLB: GameraMlbBoxScore
  NHL: GameraNhlBoxScore
  EPL: GameraEplBoxScore
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

export const getSchedule = async (props: {
  context: Context
  domain: string
  seasonYear?: number
}) => {
  try {
    const league = props.domain.toLowerCase()
    const path = `${league}/schedule`
    const data = await request<ScheduleResponse>(props.context, path)
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
