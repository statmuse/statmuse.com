import type { MlbGameScore } from '@statmuse/core/gamera'
import { atom } from 'nanostores'

export const scores = atom<Record<string, MlbGameScore | undefined>>({})

export const addMlbGame = (game: MlbGameScore) => {
  const allGames = scores.get()
  scores.set({
    ...allGames,
    [`${game.domain}-${game.gameId}`]: game,
  })
}
