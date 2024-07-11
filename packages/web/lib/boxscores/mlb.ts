import { request } from '@lib/gamera'
import type { GameraToken, GameraEntity } from '@statmuse/core/gamera'
import type { Context } from '@lib/session'

type Value = {
  value: number
  display?: string
}

type GameStatus =
  | 'scheduled'
  | 'postponed'
  | 'delayed'
  | 'inProgress'
  | 'suspended'
  | 'completed'
  | 'canceled'

type SeasonPhase = {
  type: 'regularSeason' | 'postseason'
  year: number
  yearDisplay?: string
}

type Position =
  | 'pitcher'
  | 'catcher'
  | 'firstBase'
  | 'secondBase'
  | 'thirdBase'
  | 'shortStop'
  | 'leftField'
  | 'centerField'
  | 'rightField'
  | 'designatedHitter'
  | 'pinchHitter'
  | 'pinchRunner'

interface PlayerGameModel {
  playerId: number
  lineup: {
    posistions?: Position[]
    battingOrder: number
    battingOrderSequence: number
    pitchingSequence: number
  }
}

interface StatModel {
  'Pitching-EarnedRunAverage'?: Value
  'Pitching-EarnedRuns'?: Value
  'Pitching-GamesPitched'?: Value
  'Pitching-HitBatsmen'?: Value
  'Pitching-Hits'?: Value
  'Pitching-HomeRuns'?: Value
  'Pitching-InningsPitched'?: Value
  'Pitching-Runs'?: Value
  'Pitching-Strikeouts'?: Value
  'Pitching-Walks'?: Value
  'Batting-AtBats'?: Value
  'Batting-BattingAverage'?: Value
  'Batting-CaughtStealing'?: Value
  'Batting-Doubles'?: Value
  'Batting-HitByPitches'?: Value
  'Batting-Hits'?: Value
  'Batting-HomeRuns'?: Value
  'Batting-OnBasePercentage'?: Value
  'Batting-Runs'?: Value
  'Batting-RunsBattedIn'?: Value
  'Batting-SluggingPercentage'?: Value
  'Batting-StolenBases'?: Value
  'Batting-Strikeouts'?: Value
  'Batting-Triples'?: Value
  'Batting-Walks'?: Value
}

export const getStatDisplayValue = (
  statModel: StatModel | undefined,
  key: keyof StatModel,
) => {
  if (!statModel) return undefined
  return statModel[key]?.display
}

interface TeamGameModel {
  teamId: number
  score: number
  record: {
    wins: number
    losses: number
  }
  gameResult: 'win' | 'loss' | 'noDecision' | 'suspended'
  stats?: {
    stats?: StatModel
    splits?: {
      splitType?: string
      playerId: number
      stats?: StatModel
    }[]
  }
  probablePitcher: {
    playerId: number
  }
  lineScore?: {
    inning: number
    runs: number
  }[]
  players?: PlayerGameModel[]
}

interface Official {
  assignment:
    | 'homePlate'
    | 'firstBase'
    | 'secondBase'
    | 'thirdBase'
    | 'leftField'
    | 'rightField'
  firstName?: string
  lastName?: string
  fullName?: string
}

interface Team {
  teamId: number
  seasonYear: number
  name?: string
  nickname?: string
  abbreviation?: string
  logoImageUrl?: string
  colors: {
    foregroundColor: string
    backgroundColor: string
  }
  entity: GameraEntity
}

interface Player {
  id: number
  usedName?: string
  firstName?: string
  lastName?: string
  entity: GameraEntity
  imageUrl?: string
  colors: {
    foregroundColor: string
    backgroundColor: string
  }
}

type TeamLine = {
  spread: Value
  moneyline: Value
}

interface SportsbookLine {
  id: 'consensus' | 'draftKings' | 'fanDuel' | 'mgm' | 'williamHill'
  homeTeam: TeamLine
  awayTeam: TeamLine
  overUnder: Value
}

interface BettingOdds {
  sportsbook?: SportsbookLine[]
}

export interface MLBGameDataResponse {
  gameId: number
  gameStatus: GameStatus
  seasonYearDisplay?: string
  season: SeasonPhase
  gameDate: string
  gameTimestamp: string
  networkName: string
  homeTeam: TeamGameModel
  awayTeam: TeamGameModel
  weather?: {
    temperatureFahrenheit: number
    cloudCoveragePercentage: number
    wind: {
      speedMph: number
      direction?: string
    }
  }
  venue: {
    name?: string
    location?: string
  }
  officials?: Official[]
  teams?: Team[]
  players?: Player[]
  odds?: BettingOdds
  summary?: GameraToken[]
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
    const data = await request<MLBGameDataResponse>(
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

interface Injury {
  description: string
  injuryStatus:
    | 'day7InjuredList'
    | 'day10InjuredList'
    | 'day15InjuredList'
    | 'day60InjuredList'
    | 'dayToDay'
}

interface PlayerInjury {
  player: Player
  injuries: Injury[]
}

interface TeamInjury {
  team: Team
  players: PlayerInjury[]
}

export interface TeamInjuryResponse {
  teams: TeamInjury[]
}

export const getInjuries = async (props: { context: Context }) => {
  try {
    const data = await request<TeamInjuryResponse>(
      props.context,
      'mlb/injuries',
    )
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
