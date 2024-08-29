import type {
  AdditionalQuestion,
  Colors,
  GameraDomain,
  GameraEntity,
  GameraGrid,
  GameraToken,
} from './base'

export const cdnBaseUrl = 'https://cdn.statmuse.com'

export const tokensToHtml = (tokens?: GameraToken[]) => {
  return tokens ? tokens.map(formatToken).join('').trim() : ''
}

export const tokensToText = (tokens?: GameraToken[]) => {
  return tokens ? tokens.map(formatTokenTextOnly).join('').trim() : ''
}

export const parameterize = (text: string) => {
  return text.replaceAll(' ', '-').replaceAll('/', '-').toLowerCase()
}

const arrangeTeamInfo = (text: string) => {
  const gameDisplayRegex = /(.*)\s(.*)\s@\s(.*)/
  if (gameDisplayRegex.test(text)) {
    const [_all, date, awayTeam, homeTeam] = Array.from(
      text.match(gameDisplayRegex) || [],
    )
    return `${date} ${homeTeam} vs ${awayTeam}`
  }
  return ''
}

export const getDomain = (response: GameraResponse) => {
  try {
    return (
      response.domain ??
      // @ts-ignore
      response.visual?.domain ??
      // @ts-ignore
      response.Domain ??
      // @ts-ignore
      response.Context
    )
  } catch {
    return undefined
  }
}

const fantasyPatterns = [
  // fantasy
  'f+a+n+t+a+s+y+',
  'f+a+\\S{0,3}[sc]+y\\W*(point|pt)',

  // draft kings
  'dk',
  'd+r+a+f+t+.{0,2}\\W*k+(i|$)',
  'd+r+.{0,1}a+[fk]?t+.{0,2}\\W*k+(i|$)',
  'd+r+a+f+t+.{0,2}\\W*k+\\W*(point|pt)',

  // fanduel
  'fd',
  'f+a+u?n+.{0,2}\\W*d+e?u+',
]

const fantasyRegex = new RegExp(`(${fantasyPatterns.join('|')})`, 'i')

export const isFantasyQuery = (query: string) => {
  return fantasyRegex.test(query)
}

const excludedRegex = /(joe biden|trump|xnxx)/i
export const isExcludedQuery = (query: string) => {
  return excludedRegex.test(query)
}

const voiceRegex =
  /((^|\s)a+l+e+x+a+($|\s+)|(^|\s)g+o{2,}g+l+e+($|\s+)|joe buck|scott\s+(\w+\s+|)pelt)/i
export const isVoiceQuery = (query: string) => {
  return voiceRegex.test(query)
}

export const fallbackIcon = (league: string) => {
  switch (league) {
    case 'mlb':
      return '/icons/icon-mlb.svg'
    case 'nba':
      return '/icons/icon-nba.svg'
    case 'nfl':
      return '/icons/icon-nfl.svg'
    case 'nhl':
      return '/icons/icon-nhl.svg'
    case 'pga':
      return '/icons/icon-pga.svg'
    case 'fc':
      return '/icons/icon-nfl.svg'
    default:
      throw new Error('Unknown league')
  }
}

export const getDefaultBustImageUrl = (domain: GameraDomain) => {
  switch (domain) {
    case 'NBA':
      return `${cdnBaseUrl}/img/player_profile/generic-basketball-player-silhouette.png`
    case 'MLB':
      return `${cdnBaseUrl}/img/player_profile/sm-baseball-player-lg.png`
    case 'NHL':
      return `${cdnBaseUrl}/img/player_profile/sm-hockey-player-lg.png`
    case 'NFL':
      return `${cdnBaseUrl}/img/player_profile/sm-football-player-lg.png`
    case 'EPL':
      return `${cdnBaseUrl}/img/player_profile/sm-football-player-lg.png`
    default:
      throw new Error('Unknown domain')
  }
}

export const getDefaultTeamLogoUrl = (domain: GameraDomain) => {
  switch (domain) {
    case 'NBA':
      return `${cdnBaseUrl}/img/team_profile/sm-basketball-team-lg.png`
    case 'MLB':
      return `${cdnBaseUrl}/img/team_profile/sm-baseball-team-lg.png`
    case 'NHL':
      return `${cdnBaseUrl}/img/team_profile/sm-hockey-team-lg.png`
    case 'NFL':
      return `${cdnBaseUrl}/img/team_profile/sm-football-team-lg.png`
    case 'EPL':
      return `${cdnBaseUrl}/img/team_profile/sm-football-team-lg.png`
    default:
      throw new Error('Unknown domain')
  }
}

export const getUrlForEntity = (entity: GameraEntity | undefined) => {
  if (!entity) return ''

  const { display, domain, type, parameters, id } = entity
  const league = domain.toUpperCase() === 'EPL' ? 'fc' : domain.toLowerCase()
  const isPga = domain.toUpperCase() === 'PGA'
  const isEpl = domain.toUpperCase() === 'EPL'
  const [teamId, yearId] = id.split('/')
  const isPostseason = parameters?.seasonType === 'postseason'
  let url = ''

  switch (type) {
    case 'player':
      url = isPga
        ? `/pga/ask/${parameterize(display)}-career-stats`
        : `/${league}/player/${parameterize(display)}-${id}${
            parameters && parameters['seasonYear']
              ? isEpl
                ? '/matches'
                : '/game-log'
              : ''
          }`
      break
    case 'teamSeason':
      url = `/${league}/${isEpl ? 'club' : 'team'}/${parameterize(
        display.replaceAll('.', ''),
      )}-${teamId}${isPostseason ? '/schedule' : ''}${
        yearId ? `/${yearId}` : ''
      }`
      break
    case 'teamFranchise':
      url = `/${league}/${isEpl ? 'club' : 'team'}/${parameterize(
        display.replaceAll('.', ''),
      )}-${id}/history`
      break
    case 'game':
      if (isEpl) {
        url = `/${league}/match/${parameterize(arrangeTeamInfo(display))}-${id}`
      } else {
        url = `/${league}/game/${parameterize(
          display.replaceAll(' @ ', ' at '),
        )}-${id}`
      }
      break
    default:
      throw new Error('Unknown entity type: ' + type)
  }

  if (parameters && !isPga) {
    url += `?${new URLSearchParams(parameters).toString()}`
  }

  return url
}

export const isGameraDefaultResponse = (
  resp: GameraResponse,
): resp is GameraDefaultResponse =>
  resp.type !== 'nlgPromptForMoreInfoVisualChoicesOptional'

const formatToken = (token: GameraToken) => {
  let text = token.text
  if (token.type === 'entity') {
    const url = getUrlForEntity(token.entity)

    text =
      text === token.entity?.display
        ? `<a href="${url}">${text}</a>`
        : `<a href="${url}" title="${token.entity.display}">${text}</a>`
  }

  if (token.type === 'inferred') {
    text = `<span class="visual-inferred-token">${text}</span>`
  }

  return token.omitLeadingSpace ? text : ' ' + text
}

const formatTokenTextOnly = (token: GameraToken) => {
  const text = token.text
  return token.omitLeadingSpace ? text : ' ' + text
}

export interface GameraChart {
  name: string
  series: [
    {
      name: string
      data: [
        {
          nameLines: [string]
          y: number
          label: string
          color: string
          series?: string
          float?: boolean
        },
      ]
      color: string
    },
  ]
  categories: [
    {
      nameLines: [string]
    },
  ]
}

export interface Nlg {
  text: Text
  ssml?: {
    answer: string
    promptConversational: string
    repromptConversational: string
  }
}

export interface Text {
  answer: GameraToken[]
  promptConversational: string
}

export interface Subject {
  actor: Actor
  imageUrl: string
  colors: SubjectColors
  entities?: GameraEntity[]
}

export interface SubjectColors {
  foreground: string
  background: string
}

export interface Actor {
  year?: number
  ids: {
    id: string
    type: string
  }[]
}

export interface Narrator {
  introAudioUrl: string
  answerWithIntroAudioUrl: string
  answerAudioUrl: string
  imageUrl: string
  actorId: string
}

export interface Summary {
  answer?: GameraToken[]
  subject: Subject
  narrator?: Narrator
  text: Text[]
}

export interface ContentReference {
  domainTags?: {
    domain?: GameraDomain
  }
  questionTags?: {
    actorType?: string
    teamIds?: number[]
    playerIds?: number[]
    seasonYears?: number[]
  }
  answerTags?: {
    teamIds?: number[]
    playerIds?: number[]
    seasonYears?: number[]
  }
}

export interface DetailBase {
  type:
    | 'genericGrids'
    | 'mlbHistoricalBoxScore'
    | 'nbaHistoricalBoxScore'
    | 'nflHistoricalBoxScore'
    | 'nhlHistoricalBoxScore'
    | 'eplHistoricalBoxScore'
    | 'playerProfile'
    | 'teamProfile'
    | 'stats'
    | 'standings'
    | 'schedule'
    | 'nbaShots'
    | 'gameOddsIndicator'
}

export interface Standings {
  group: string
  teams: {
    name: string
    abbrev: string
    logoUrl: string
  }[]
  grid: GameraGrid
}

export interface StandingsDetail extends DetailBase {
  type: 'standings'
  topic?: { group?: string; team?: string }
  standings: Standings[]
}

export interface NbaShotChart {
  name: string
  cumulative: boolean
  series: {
    name: string
    zones: {
      Z: number
      lFGM: number
      lFGA: number
      lFGPCT: number
      lPTS: number
      lPPS: number
      FGM: number
      FGA: number
      FGPCT: number
      PTS: number
      PPS: number
      FGPCT_Delta: number
      PPS_Delta: number
    }[]
    colors: string[]
    shots: {
      X: number
      Y: number
      M: number
      Z: number
    }[]
  }[]
}

export interface NbaShotsDetail extends DetailBase {
  type: 'nbaShots'
  charts: NbaShotChart[]
}

export interface ScheduleDetailGame {
  date: string
  time?: string
  status?: string
  network?: string
  gameId: string
  homeTeam: {
    name: string
    logoUrl: string
    score?: number
    entity: GameraEntity
  }
  awayTeam: {
    name: string
    logoUrl: string
    score?: number
    entity: GameraEntity
  }
  entity: GameraEntity
  completedGameStatus?: 'Final'
}

export interface ScheduleDetail extends DetailBase {
  scheduled: ScheduleDetailGame[]
  inProgress: ScheduleDetailGame[]
  completed: ScheduleDetailGame[]
  type: 'schedule'
}

export interface PlayerProfileDetail extends DetailBase {
  type: 'playerProfile'
  entity: GameraEntity
}

export interface TeamProfileDetail extends DetailBase {
  type: 'teamProfile'
  entity: GameraEntity
}

export interface StatsDetail extends DetailBase {
  type: 'stats'
  grids: GameraGrid[]
  columnCharts: GameraChart[]
}

export interface NbaTeamGameStats {
  fieldGoalMadeAttempt: string
  fieldGoalPercent: string
  threePointMadeAttempt: string
  threePointPercent: string
  freeThrowMadeAttempt: string
  freeThrowPercent: string
  assists: string
  steals: string
  blocks: string
  turnovers: string
  personalFouls: string
  totalRebounds: string
  offensiveRebounds: string
  defensiveRebounds: string
}

export interface Team {
  name: string
  shortName?: string
  abbrev: string
  record: string
  score: number
  logoUrl: string
  entity?: GameraEntity
  lineup?: {
    entity: GameraEntity
    imageUrl: string
    colors: Colors
    hasBustImage: boolean
    isStarter: boolean
    isCaptain: boolean
    formationIndex: number
    formationPosition?:
      | 'goalkeeper'
      | 'defender'
      | 'defensive_midfielder'
      | 'midfielder'
      | 'attacking_midfielder'
      | 'forward'
    formationAlignment?: 'left' | 'center' | 'right'
    position: 'goalkeeper' | 'defender' | 'midfielder' | 'forward'
    shirtNumber: number
  }[]
}

export interface NbaHistoricalBoxScore extends DetailBase {
  type: 'nbaHistoricalBoxScore'
  gameId: number
  gameDate: string
  completedGameStatus: 'Final'
  homeTeam: Team
  awayTeam: Team
  summary: GameraGrid
  teamDetail: {
    homeTeam: NbaTeamGameStats
    awayTeam: NbaTeamGameStats
  }
  playerDetail: {
    homeTeam: {
      team: string
      grids: GameraGrid[]
    }
    awayTeam: {
      team: string
      grids: GameraGrid[]
    }
  }
}

export interface NflTeamGameStats {
  firstDowns: string
  firstDownsRushing: string
  firstDownsPassing: string
  firstDownsPenalty: string
  thirdDownConversions: string
  thirdDownAttempts: string
  thirdDownEfficiency: string
  fourthDownConversions: string
  fourthDownAttempts: string
  fourthDownEfficiency: string
  totalYards: string
  totalPlays: string
  yardsPerPlay: string
  totalDrives: string
  netPassingYards: string
  passingCompletions: string
  passingAttempts: string
  yardsPerPass: string
  passingInterceptions: string
  passingSacks: string
  passingSacksYardsLost: string
  rushingYards: string
  rushingAttempts: string
  rushingAverage: string
  penalties: string
  penaltyYardsLost: string
  turnovers: string
  fumblesLost: string
  defensiveTouchdowns: string
  specialTeamsTouchdowns: string
  possession: string
}

export interface NflHistoricalBoxScore extends DetailBase {
  type: 'nflHistoricalBoxScore'
  gameId: number
  gameDate: string
  completedGameStatus: 'Final'
  homeTeam: Team
  awayTeam: Team
  summary: GameraGrid
  teamDetail: {
    homeTeam: NflTeamGameStats
    awayTeam: NflTeamGameStats
  }
  playerDetail: {
    homeTeam: {
      team: string
      grids: GameraGrid[]
    }
    awayTeam: {
      team: string
      grids: GameraGrid[]
    }
  }
  scoringSummary: {
    quarter: string
    team: string
    description: string
    homeTeamScore: number
    awayTeamScore: number
  }[]
}

export interface MlbHistoricalBoxScore extends DetailBase {
  type: 'mlbHistoricalBoxScore'
  gameId: number
  gameDate: string
  completedGameStatus: 'Final'
  homeTeam: Team
  awayTeam: Team
  stats: {
    homeTeam: {
      team: string
      batterStats: GameraGrid
      pitcherStats: GameraGrid
    }
    awayTeam: {
      team: string
      batterStats: GameraGrid
      pitcherStats: GameraGrid
    }
  }
  lineScore: GameraGrid
  scoringSummary: {
    inning: string
    team: string
    description: string
    homeTeamScore: number
    awayTeamScore: number
  }[]
}

export interface NhlTeamGameStats {
  goals: string
  shots: string
  penaltyMinutes: string
  powerPlayGoals: string
  powerPlayOpportunities: string
  faceoffWins: string
  hits: string
  giveaways: string
  takeaways: string
}

export interface NhlHistoricalBoxScore extends DetailBase {
  type: 'nhlHistoricalBoxScore'
  gameId: number
  gameDate: string
  completedGameStatus: 'Final'
  homeTeam: Team
  awayTeam: Team
  summary: GameraGrid
  teamDetail: {
    homeTeam: NhlTeamGameStats
    awayTeam: NhlTeamGameStats
  }
  playerDetail: {
    homeTeam: {
      team: string
      grids: GameraGrid[]
    }
    awayTeam: {
      team: string
      grids: GameraGrid[]
    }
  }
  scoringSummary: {
    period: string
    time: string
    team: string
    description: string
    homeTeamScore: number
    awayTeamScore: number
  }[]
}

export type SoccerFormation =
  | '3-1-4-2'
  | '3-2-4-1'
  | '3-4-1-2'
  | '3-4-2-1'
  | '3-4-3'
  | '3-4-3 diamond'
  | '3-5-1-1'
  | '3-5-2'
  | '4-1-3-2'
  | '4-1-4-1'
  | '4-2-2-2'
  | '4-2-3-1'
  | '4-2-4-0'
  | '4-3-1-2'
  | '4-3-2-1'
  | '4-3-3'
  | '4-3-3 flat'
  | '4-4-1-1'
  | '4-4-2'
  | '4-4-2 diamond'
  | '4-4-2-diamond'
  | '4-5-1'
  | '5-3-2'
  | '5-4-1'

export interface EplTeamGameStats {
  goals: string
  assists: string
  shots: string
  shotsOnTarget: string
  saves: string
  tackles: string
  fouls: string
  yellowCards: string
  redCards: string
  possessionPercentage: string
  touches: string
  touchesInOpponentsBox: string
  passes: string
  passesCompleted: string
  offsides: string
  corners: string
  formation: SoccerFormation
  clearances: string
  bigChancesCreated: string
}

export interface EplHistoricalBoxScore extends DetailBase {
  type: 'eplHistoricalBoxScore'
  gameId: number
  gameDate: string
  completedGameStatus: 'FT'
  dameDate: string
  homeTeam: Team
  awayTeam: Team
  teamDetail: {
    homeTeam: EplTeamGameStats
    awayTeam: EplTeamGameStats
  }
  playerDetail: {
    homeTeam: {
      team: string
      grids: GameraGrid[]
    }
    awayTeam: {
      team: string
      grids: GameraGrid[]
    }
  }
  gameSummary: {
    eventType: string
    period: string
    minute: string
    team: string
    playerName: string
    relatedPlayerName: string
    homeTeamScore: number
    awayTeamScore: number
  }[]
}

export interface GameraGenericGridsDetail extends DetailBase {
  type: 'genericGrids'
  grids: GameraGrid[]
}

export interface Visual {
  domain?: GameraDomain
  summary: Summary
  summaryTokens?: GameraToken[]
  isSuperlative: boolean
  additionalQuestions?: AdditionalQuestion[]
  contentReference?: ContentReference
  detail?: Detail[]
  disclaimers?: [string]
}

export interface Conversation {
  token: string
  complete: boolean
}

export interface Disposition {
  responseType: string
  resultsType: string
  intent: string
}

export interface TokenizationScore {
  max: number
  median: number
  average: number
}

export interface GameraResponseBase {
  domain: GameraDomain
  conversation: Conversation
  disposition: Disposition
  tokenizationScore: TokenizationScore
}

export interface GameraDefaultResponse extends GameraResponseBase {
  type:
    | 'fullNlgAnswerVisualsOptional'
    | 'nlgAnswerNotPossibleVisualsRequired'
    | 'error'
  visual: Visual
  nlg: Nlg
}

export interface GameraChoicesResponse extends GameraResponseBase {
  type: 'nlgPromptForMoreInfoVisualChoicesOptional'
  visual: ChoicesVisual
  nlg: ChoicesNlg
}

export interface ChoicesVisual
  extends Omit<
    Visual,
    | 'domain'
    | 'detail'
    | 'disclaimers'
    | 'additionalQuestions'
    | 'isSuperlative'
  > {
  choices: [
    {
      display: string
      assetId: string
      input: string
    },
  ]
}

export interface ChoicesNlg {
  text: {
    promptForMoreInfo: string
  }
  ssml: {
    promptForMoreInfo: string
    repromptForMoreInfo: string
  }
}

export type GameraResponse = GameraDefaultResponse | GameraChoicesResponse

export type Detail =
  | StatsDetail
  | NbaHistoricalBoxScore
  | NflHistoricalBoxScore
  | NhlHistoricalBoxScore
  | MlbHistoricalBoxScore
  | EplHistoricalBoxScore
  | GameraGenericGridsDetail
  | PlayerProfileDetail
  | TeamProfileDetail
  | StandingsDetail
  | ScheduleDetail
  | NbaShotsDetail
