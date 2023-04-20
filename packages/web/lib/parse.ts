export const parsePlayerId = (x: string) => {
  const regex = /(^|\w{3}\/players?\/)(|.*-)(?<player_id>\d+)($|\/|\?|#)/
  const id = x.match(regex)?.groups?.player_id
  if (!id) throw new Error(`Could not parse player id from '${x}'`)

  return parseId(id)
}

export const parseTeamId = (x: string) => {
  const regex = /(^|\w{3}\/teams?\/)(|.*-)(?<team_id>\d+)($|\/|\?|#)/
  const id = x.match(regex)?.groups?.team_id
  if (!id) throw new Error(`Could not parse team id from '${x}'`)

  return parseId(id)
}

export const parseYearId = (x: string) => {
  const regex = /(^|\/)(?<year_id>\d{4})($|\/|\?|#)/
  const id = x.match(regex)?.groups?.year_id
  if (!id) throw new Error(`Could not parse year id from '${x}'`)

  return parseId(id)
}

export const parseGameId = (x: string) => {
  const regex = /(^|\w{3}\/games?\/)(|.*-)(?<game_id>\d+)($|\/|\?|#)/i
  const id = x.match(regex)?.groups?.game_id
  if (!id) throw new Error(`Could not parse game id from '${x}'`)

  return parseId(id)
}

const parseId = (id: string) => {
  return Math.abs(Number.parseInt(id || '')).toString()
}
