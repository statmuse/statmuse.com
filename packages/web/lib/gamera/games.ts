import type {
  Game,
  GameraAnswerEplBoxScore,
  GameraAnswerMlbBoxScore,
  GameraAnswerNbaBoxScore,
  GameraAnswerNflBoxScore,
  GameraAnswerNhlBoxScore,
  GameraGamesResponse,
  MlbGameDataResponse,
  MlbPlayByPlayResponse,
  MlbStatKeySet,
  MlbStatKey,
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

type Season = 'regularSeaaon' | 'postseason'

export const getGames = async <
  G extends 'scheduled' | 'inProgress' | 'completed',
>(props: {
  context: Context
  domain: string
  teamId?: string | number
  seasonYear?: string | number
  startGameTimestamp?: string
  endGameTimestamp?: string
  seasonType?: Season | Season[]
  gameState?: G | G[]
}) => {
  try {
    const { domain, context, ...params } = props
    const league = domain.toLowerCase()
    const path = `${league}/games/v2`
    const data = await request<GameraGamesResponse<Extract<Game, { type: G }>>>(
      context,
      path,
      new URLSearchParams(
        Object.entries(params)
          .map(([k, v]) => (Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v]]))
          .flat() as string[][],
      ),
    )
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getGameData = async <
  SetKey extends keyof MlbStatKeySet,
  Key extends MlbStatKey,
>(props: {
  context: Context
  gameId: string | number
  statKeySet?: SetKey[] | SetKey
  statKey?: Key[] | Key
}) => {
  try {
    const { gameId, context, ...params } = props
    const path = `mlb/games/${gameId}`
    const data = await request<
      MlbGameDataResponse<MlbStatKeySet[SetKey] | Key>
    >(
      context,
      path,
      new URLSearchParams(
        Object.entries(params)
          .map(([k, v]) => (Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v]]))
          .flat() as string[][],
      ),
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
    if (data.error) {
      return undefined
    }
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
