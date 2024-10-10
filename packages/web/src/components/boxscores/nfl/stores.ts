import type {
  GameraPlayerReference,
  NflDrive,
  NflEvent,
  NflGameDataResponse,
  NflPlayByPlayResponse,
  NflScoringEvent,
  NflStatKey,
  StatModel,
} from '@statmuse/core/gamera'
import { map, atom } from 'nanostores'

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

export const drives = atom<NflDrive[]>([])

export const events = atom<NflEvent[]>([])

export const scoringEvents = atom<NflScoringEvent[]>([])

export const players = map<Record<number, GameraPlayerReference | undefined>>(
  {},
)

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
  drives.set(props.playByPlay?.drives ?? [])
  events.set(props.playByPlay?.events ?? [])
  scoringEvents.set(props.playByPlay?.scoringEvents ?? [])
}
