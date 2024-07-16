import type {
  GameraAnswerEplBoxScore,
  GameraAnswerMlbBoxScore,
  GameraAnswerNbaBoxScore,
  GameraAnswerNflBoxScore,
  GameraAnswerNhlBoxScore,
  MlbGameDataResponse,
  GameResultsResponse,
  MlbPlayByPlayResponse,
} from '@statmuse/core/gamera'
import { parseGameId } from '@lib/parse'
import { request } from '@lib/gamera/base'
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

type StatKey = 'pitchingStandard' | 'battingStandard'

export const getGameData = async (props: {
  context: Context
  gameId: string | number
  statKeySet: StatKey[]
}) => {
  try {
    const { gameId, context, statKeySet } = props
    const path = `mlb/games/${gameId}`
    const data = await request<MlbGameDataResponse>(
      context,
      path,
      new URLSearchParams(statKeySet.map((key) => ['statKeySet', key])),
    )
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getPlayByPlay = async (props: {
  context: Context
  gameId: string | number
}) => {
  try {
    const { gameId, context } = props
    const path = `mlb/games/${gameId}/playByPlay`
    const data = await request<MlbPlayByPlayResponse>(context, path)
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
