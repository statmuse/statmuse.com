import type {
  GameraDomain,
  GameraNbaBoxScore,
  GameraNflBoxScore,
  GameraMlbBoxScore,
  GameraNhlBoxScore,
} from './gamera'
import { parseGameId } from './parse'

const gameraApiUrl = import.meta.env.GAMERA_API_URL

interface Response {
  NBA: GameraNbaBoxScore
  NFL: GameraNflBoxScore
  MLB: GameraMlbBoxScore
  NHL: GameraNhlBoxScore
  PGA: never
}

export async function getGame<T extends GameraDomain>(props: {
  domain: T
  game: string
  params?: URLSearchParams
}) {
  if (props.domain === 'PGA')
    throw new Error('There are no PGA boxscores, dummy!')

  const gameId = parseGameId(props.game)
  let requestUrl = `${gameraApiUrl}${props.domain}/games/${gameId}/answer`
  if (props.params) requestUrl += `?${props.params.toString()}`
  const response = await fetch(requestUrl)
  const data = (await response.json()) as Response[T]
  data.domain = props.domain
  return data
}
