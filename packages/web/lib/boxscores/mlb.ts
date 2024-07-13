import { request } from '@lib/gamera'
import type { GameraToken, GameraEntity, Value } from '@statmuse/core/gamera'
import type { Context } from '@lib/session'

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
  'Pitching-EarnedRunAverage'?: Value<number>
  'Pitching-EarnedRuns'?: Value<number>
  'Pitching-GamesPitched'?: Value<number>
  'Pitching-HitBatsmen'?: Value<number>
  'Pitching-Hits'?: Value<number>
  'Pitching-HomeRuns'?: Value<number>
  'Pitching-InningsPitched'?: Value<number>
  'Pitching-Runs'?: Value<number>
  'Pitching-Strikeouts'?: Value<number>
  'Pitching-Walks'?: Value<number>
  'Batting-AtBats'?: Value<number>
  'Batting-BattingAverage'?: Value<number>
  'Batting-CaughtStealing'?: Value<number>
  'Batting-Doubles'?: Value<number>
  'Batting-HitByPitches'?: Value<number>
  'Batting-Hits'?: Value<number>
  'Batting-HomeRuns'?: Value<number>
  'Batting-OnBasePercentage'?: Value<number>
  'Batting-Runs'?: Value<number>
  'Batting-RunsBattedIn'?: Value<number>
  'Batting-SluggingPercentage'?: Value<number>
  'Batting-StolenBases'?: Value<number>
  'Batting-Strikeouts'?: Value<number>
  'Batting-Triples'?: Value<number>
  'Batting-Walks'?: Value<number>
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
  probablePitcher?: {
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
  spread: Value<number>
  moneyline: Value<number>
}

interface SportsbookLine {
  id: 'consensus' | 'draftKings' | 'fanDuel' | 'mgm' | 'williamHill'
  homeTeam: TeamLine
  awayTeam: TeamLine
  overUnder: Value<number>
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
