import type {
  GameraDomain,
  GameraMlbBoxScore,
  GameraNbaBoxScore,
  GameraNflBoxScore,
  GameraNhlBoxScore,
} from '@statmuse/core/gamera'
import { parseGameId } from '@lib/parse'
import { request } from '@lib/gamera'
import type { Context } from '@lib/session'

interface Response {
  NBA: GameraNbaBoxScore
  NFL: GameraNflBoxScore
  MLB: GameraMlbBoxScore
  NHL: GameraNhlBoxScore
  PGA: never
}

export async function getGame<T extends GameraDomain>(props: {
  context: Context
  domain: T
  game: string
  params?: Record<string, string>
}) {
  if (props.domain === 'PGA')
    throw new Error('There are no PGA boxscores, dummy!')

  try {
    const gameId = parseGameId(props.game)
    const league =
      props.domain.toLowerCase() === 'fc' ? 'epl' : props.domain.toLowerCase()
    const path = `${league}/games/${gameId}/answer`
    const data = await request<Response[T]>(props.context, path, props.params)
    if (data) data.domain = props.domain
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
