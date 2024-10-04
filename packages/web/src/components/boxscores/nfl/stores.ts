import type {
  NflGameDataResponse,
  NflPlayByPlayResponse,
  NflStatKey,
  StatModel,
} from '@statmuse/core/gamera'
import { map } from 'nanostores'

export const playerStats = map<{
  away?: {
    splits: {
      groupIndex: number
      splitType: string
      statsLookupKey: string
      splits: {
        playerId: number
        splitType: string
        statsLookupKey: string
      }[]
    }[]
    statsLookupKey: string
    statsLookup: Record<string, StatModel<NflStatKey>>
  }
  home?: {
    splits: {
      groupIndex: number
      splitType: string
      statsLookupKey: string
      splits: {
        playerId: number
        splitType: string
        statsLookupKey: string
      }[]
    }[]
    statsLookupKey: string
    statsLookup: Record<string, StatModel<NflStatKey>>
  }
}>({})

export const teamStats = map<{
  away?: {
    statsLookupKey: string
    statsLookup: Record<string, StatModel<NflStatKey>>
  }
  home?: {
    statsLookupKey: string
    statsLookup: Record<string, StatModel<NflStatKey>>
  }
}>({})

export const init = (props: {
  gameData: NflGameDataResponse<NflStatKey>
  playByPlay?: NflPlayByPlayResponse
}) => {
  playerStats.set({
    away: props.gameData.awayTeam.stats.player,
    home: props.gameData.homeTeam.stats.player,
  })
  teamStats.set({
    away: props.gameData.awayTeam.stats.team,
    home: props.gameData.homeTeam.stats.team,
  })
}
