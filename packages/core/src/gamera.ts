export const cdnBaseUrl = "https://cdn.statmuse.com"

export function handleResponse(response: GameraResponse) {
  const subject = response.visual.summary.subject
  const conversationToken = response.conversation.token
  if (response.type === "nlgPromptForMoreInfoVisualChoicesOptional") {
    return { subject, conversationToken }
  }

  let redirectUrl = ""
  const playerProfile = response.visual.detail?.find(
    (d) => d.type === "playerProfile"
  ) as PlayerProfileDetail
  if (playerProfile) {
    redirectUrl = getUrlForEntity(playerProfile.entity)
  }

  const teamProfile = response.visual.detail?.find(
    (d) => d.type === "teamProfile"
  ) as TeamProfileDetail
  if (teamProfile) {
    redirectUrl = getUrlForEntity(teamProfile.entity)
  }

  return {
    subject,
    redirectUrl,
    conversationToken,
  }
}

export const tokensToHtml = (tokens: GameraToken[]) => {
  return tokens.map(formatToken).join("").trim()
}

export const tokensToText = (tokens: GameraToken[]) => {
  return tokens.map(formatTokenTextOnly).join("").trim()
}

const parameterize = (text: string) => {
  return text.replaceAll(" ", "-").replaceAll("/", "-").toLowerCase()
}

export const fallbackIcon = (league: string) => {
  switch (league) {
    case "mlb":
      return "/icons/icon-mlb.svg"
    case "nba":
      return "/icons/icon-nba.svg"
    case "nfl":
      return "/icons/icon-nfl.svg"
    case "nhl":
      return "/icons/icon-nhl.svg"
    case "pga":
      return "/icons/icon-pga.svg"
    default:
      throw new Error("Unknown league")
  }
}

export const getDefaultBustImageUrl = (domain: GameraDomain) => {
  switch (domain) {
    case "NBA":
      return `${cdnBaseUrl}/img/player_profile/generic-basketball-player-silhouette.png`
    case "MLB":
      return `${cdnBaseUrl}/img/player_profile/sm-baseball-player-lg.png`
    case "NHL":
      return `${cdnBaseUrl}/img/player_profile/sm-hockey-player-lg.png`
    case "NFL":
      return `${cdnBaseUrl}/img/player_profile/sm-football-player-lg.png`
    default:
      throw new Error("Unknown domain")
  }
}

export const getDefaultTeamLogoUrl = (domain: GameraDomain) => {
  switch (domain) {
    case "NBA":
      return `${cdnBaseUrl}/img/team_profile/sm-basketball-team-lg.png`
    case "MLB":
      return `${cdnBaseUrl}/img/team_profile/sm-baseball-team-lg.png`
    case "NHL":
      return `${cdnBaseUrl}/img/team_profile/sm-hockey-team-lg.png`
    case "NFL":
      return `${cdnBaseUrl}/img/team_profile/sm-football-team-lg.png`
    default:
      throw new Error("Unknown domain")
  }
}

export const getUrlForEntity = (entity: GameraEntity) => {
  const { display, domain, type, parameters, id } = entity
  const isPga = domain.toUpperCase() === "PGA"
  const [teamId, yearId] = id.split("/")
  const isPostseason = parameters?.seasonType === "postseason"
  let url = ""

  switch (type) {
    case "player":
      url = isPga
        ? `/pga/ask/${parameterize(display)}-career-stats`
        : `/${domain.toLowerCase()}/player/${parameterize(display)}-${id}${
            parameters && parameters["seasonYear"] ? "/game-log" : ""
          }`
      break
    case "teamSeason":
      url = `/${domain.toLowerCase()}/team/${parameterize(
        display.replaceAll(".", "")
      )}-${teamId}${isPostseason ? "/schedule" : ""}${
        yearId ? `/${yearId}` : ""
      }`
      break
    case "teamFranchise":
      url = `/${domain.toLowerCase()}/team/${parameterize(
        display.replaceAll(".", "")
      )}-${id}/history`
      break
    case "game":
      url = `/${domain.toLowerCase()}/game/${parameterize(
        display.replaceAll(" @ ", " at ")
      )}-${id}`
      break
    default:
      throw new Error("Unknown entity type")
  }

  if (parameters && !isPga) {
    url += `?${new URLSearchParams(parameters).toString()}`
  }

  return url
}

const formatToken = (token: GameraToken) => {
  let text = token.text
  if (token.type === "entity") {
    const url = getUrlForEntity(token.entity)

    text =
      text === token.entity?.display
        ? `<a href="${url}">${text}</a>`
        : `<a href="${url}" title="${token.entity.display}">${text}</a>`
  }

  if (token.type === "inferred") {
    text = `<span class="visual-inferred-token">${text}</span>`
  }

  return token.omitLeadingSpace ? text : " " + text
}

const formatTokenTextOnly = (token: GameraToken) => {
  const text = token.text
  return token.omitLeadingSpace ? text : " " + text
}

export type GameraDomain = "NBA" | "NFL" | "MLB" | "NHL" | "PGA"

export type GameraToken = {
  text: string
  omitLeadingSpace: boolean
} & (
  | {
      type: "general"
    }
  | {
      type: "inferred"
    }
  | {
      type: "entity"
      entity: GameraEntity
    }
)

export type GameraEntity = {
  display: string
  domain: GameraDomain
  type: "player" | "teamFranchise" | "teamSeason" | "game" | "player-ask"
  id: string
  parameters?: Record<string, string>
  baseResourcePath?: string
}

export interface GameraPlayerBio {
  domain: GameraDomain
  playerId: number
  usedName: string
  bustImageUrl: string
  bustImageUrlGallery: GameraGalleryImage[]
  team: {
    name: string
    nickname: string
    abbreviation: string
    logoImageUrl: string
    colors: {
      foregroundColor: string
      backgroundColor: string
    }
    entity: GameraEntity
  }
  position: string
  jerseyNumber: string
  heightFeetInches: string
  weightLbs: number
  birthdate: string
  birthplace: string
  age: number
  college: string
  drafted: string
  experience: string
  summaryNlg?: GameraToken[]
  awards: {
    name: string
    years: number[]
  }[]
  additionalQuestions: {
    domain: string
    text: string
  }[]
  statsSummary: {
    statsScope: string
    stats: {
      label: string
      value: string
    }[]
  }
  disposition: {
    responseType: string
    resultsType: string
    intent: string
  }
}

export interface GameraGrid {
  name: string
  columns: [
    {
      rowItemKey: string
      title: string
      type: string
    }
  ]
  rows: Record<
    string,
    {
      display: string
      value: unknown
      imageUrl?: string
      entity?: GameraEntity
    }
  >[]
  aggregations: Record<
    string,
    {
      display: string
      value: unknown
      imageUrl?: string
      entity?: GameraEntity
    }
  >[]
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
        }
      ]
      color: string
    }
  ]
  categories: [
    {
      nameLines: [string]
    }
  ]
}

export interface GameraParameter {
  values: {
    id: string
    display: string
  }[]
  selectedValueId: string
  order: number
}

export interface GameraPlayerStats {
  playerId: number
  parameters: Record<string, GameraParameter>
  grids: GameraGrid[]
}

export interface GameraPlayerGameLog {
  playerId: number
  parameters: Record<string, GameraParameter>
  grids: GameraGrid[]
}

export interface GameraPlayerSplits {
  playerId: number
  parameters: Record<string, GameraParameter>
  grids: GameraGrid[]
}

export interface GameraPlayerProfileResponse {
  bio: GameraPlayerBio
  nextGame: {
    date: string
    time: string
    network: string
    homeTeam: {
      name: string
      nickname: string
      abbreviation: string
      logoImageUrl: string
      colors: {
        foregroundColor: string
        backgroundColor: string
      }
      entity: GameraEntity
    }
    awayTeam: {
      name: string
      nickname: string
      abbreviation: string
      logoImageUrl: string
      colors: {
        foregroundColor: string
        backgroundColor: string
      }
      entity: GameraEntity
    }
    odds: {
      team: {
        name: string
        nickname: string
        abbreviation: string
        logoImageUrl: string
        colors: {
          foregroundColor: string
          backgroundColor: string
        }
        entity: GameraEntity
      }
      opponent: {
        name: string
        nickname: string
        abbreviation: string
        logoImageUrl: string
        colors: {
          foregroundColor: string
          backgroundColor: string
        }
        entity: GameraEntity
      }
      seasonYear: number
      moneyline: number
      opponentMoneyline: number
      spread: number
      spreadOdds: number
      opponentSpreadOdds: number
      overUnder: number
    }
    grid: GameraGrid
  }
  stats: {
    grid: GameraGrid
  }
  recentGames: {
    grid: GameraGrid
  }
}

export interface GameraTeamSeasonBio {
  domain: GameraDomain
  teamId: number
  yearId: number
  name: string
  nameDetail: {
    abbreviation: string
    market: string
    nickname: string
  }
  season: {
    name: string
    all: {
      name: string
      entity: GameraEntity
    }[]
  }
  logoImageUrl: string
  colors: {
    foregroundColor: string
    backgroundColor: string
  }
  teamRepresentatives: GameraGalleryImage[]
  statsSummary?: {
    statsScope: string
    stats: {
      label: string
      value: string
      rank: string
    }[]
  }
  standing: {
    record: string
    leagueRank: string
    conferenceRank: string
    divisionRank: string
    championship: string
  }
  franchise: GameraEntity
  hasStats: boolean
  hasRoster: boolean
  summaryNlg?: GameraToken[]
  disposition: {
    responseType: string
    resultsType: string
    intent: string
  }
}

export interface GameraGalleryImage {
  url: string
  colors: {
    foregroundColor: string
    backgroundColor: string
  }
  entity?: GameraEntity
}

export interface GameraTeamLeader {
  galleryImage: GameraGalleryImage
  stat: {
    label: string
    value: string
  }
  name: string
}

export interface GameraTeamSeasonOverview {
  domain: GameraDomain
  teamId: number
  yearId: number
  bio: GameraTeamSeasonBio
  scoresAndSchedule: GameraGrid
  teamLeaders: GameraTeamLeader[]
  standings: GameraGrid
  stats: GameraGrid | GameraGrid[]
  playerGallery: GameraGalleryImage[]
}

export interface GameraTeamSeasonStats {
  parameters: Record<string, GameraParameter>
  grids: GameraGrid[]
  gridGroups: GameraGrid[]
}

export interface GameraTeamSeasonPlayerStats {
  parameters: Record<string, GameraParameter>
  grids: GameraGrid[]
  gridGroups: GameraGrid[]
}

export interface GameraTeamSeasonGameResults {
  grids: GameraGrid[]
}

export interface GameraTeamSeasonRoster {
  grid: GameraGrid
}

export interface GameraTeamSeasonSplits {
  parameters: Record<string, GameraParameter>
  grids: GameraGrid[]
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
  colors: Colors
  entities: GameraEntity[]
}

export interface Colors {
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
  answer: GameraToken[]
  subject: Subject
  narrator: Narrator
  text: Text[]
}

export interface AdditionalQuestion {
  domain: string
  text: string
}

export interface DetailBase {
  type:
    | "genericGrids"
    | "mlbHistoricalBoxScore"
    | "nbaHistoricalBoxScore"
    | "nflHistoricalBoxScore"
    | "nhlHistoricalBoxScore"
    | "playerProfile"
    | "teamProfile"
    | "stats"
    | "standings"
    | "schedule"
    | "nbaShots"
    | "gameOddsIndicator"
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
  type: "standings"
  topic?: { group?: string; team?: string }
  standings: Standings[]
}

export interface ScheduledGame {
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
  completedGameStatus?: "Final"
}

export interface ScheduleDetail extends DetailBase {
  scheduled: ScheduledGame[]
  inProgress: ScheduledGame[]
  completed: ScheduledGame[]
  type: "schedule"
}

export interface PlayerProfileDetail extends DetailBase {
  type: "playerProfile"
  entity: GameraEntity
}

export interface TeamProfileDetail extends DetailBase {
  type: "teamProfile"
  entity: GameraEntity
}

export interface StatsDetail extends DetailBase {
  type: "stats"
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
  abbrev: string
  record: string
  score: number
  logoUrl: string
  entity: GameraEntity
}

export interface NbaHistoricalBoxScore extends DetailBase {
  type: "nbaHistoricalBoxScore"
  gameId: number
  completedGameStatus: "Final"
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
  type: "nflHistoricalBoxScore"
  gameId: number
  completedGameStatus: "Final"
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
  type: "mlbHistoricalBoxScore"
  gameId: number
  completedGameStatus: "Final"
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
  type: "nhlHistoricalBoxScore"
  gameId: number
  completedGameStatus: "Final"
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

export interface GameraGenericGridsDetail extends DetailBase {
  type: "genericGrids"
  grids: GameraGrid[]
}

export interface NhlBoxScoreDetail {
  gameId: number
  completedGameStatus: string
  homeTeam: {
    name: string
    abbrev: string
    record: string
    score: number
    logoUrl: string
    entity: GameraEntity
  }
  awayTeam: {
    name: string
    abbrev: string
    record: string
    score: number
    logoUrl: string
    entity: GameraEntity
  }
  summary: GameraGrid
  teamDetail: {
    homeTeam: {
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
    awayTeam: {
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
  scoringSummary: [
    {
      period: string
      time: string
      team: string
      description: string
      homeTeamScore: number
      awayTeamScore: number
    }
  ]
}

export interface Visual {
  domain: GameraDomain
  summary: Summary
  summaryTokens: GameraToken[]
  isSuperlative: boolean
  additionalQuestions?: AdditionalQuestion[]
  detail?: Detail[]
  disclaimers?: [string]
}

export interface NbaVisual extends Visual {
  domain: "NBA"
  detail: [NbaHistoricalBoxScore, GameraGenericGridsDetail]
}

export interface NflVisual extends Visual {
  domain: "NFL"
  detail: [NflHistoricalBoxScore, GameraGenericGridsDetail]
}

export interface MlbVisual extends Visual {
  domain: "MLB"
  detail: [MlbHistoricalBoxScore, GameraGenericGridsDetail]
}

export interface NhlVisual extends Visual {
  domain: "NHL"
  detail: [NhlHistoricalBoxScore, GameraGenericGridsDetail]
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
    | "fullNlgAnswerVisualsOptional"
    | "nlgAnswerNotPossibleVisualsRequired"
    | "error"
  visual: Visual
  nlg: Nlg
}

export interface GameraChoicesResponse extends GameraResponseBase {
  type: "nlgPromptForMoreInfoVisualChoicesOptional"
  visual: ChoicesVisual
  nlg: ChoicesNlg
}

export interface ChoicesVisual
  extends Omit<
    Visual,
    | "domain"
    | "detail"
    | "disclaimers"
    | "additionalQuestions"
    | "isSuperlative"
  > {
  choices: [
    {
      display: string
      assetId: string
      input: string
    }
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

export interface GameraNbaBoxScore extends GameraResponseBase {
  domain: "NBA"
  visual: NbaVisual
  nlg: Nlg
}
export interface GameraNflBoxScore extends GameraResponseBase {
  domain: "NFL"
  visual: NflVisual
  nlg: Nlg
}
export interface GameraMlbBoxScore extends GameraResponseBase {
  domain: "MLB"
  visual: MlbVisual
  nlg: Nlg
}
export interface GameraNhlBoxScore extends GameraResponseBase {
  domain: "NHL"
  visual: NhlVisual
  nlg: Nlg
}

export type GameraBoxScore =
  | GameraNbaBoxScore
  | GameraNflBoxScore
  | GameraMlbBoxScore
  | GameraNhlBoxScore

export interface GameraTeamFranchiseOverview {
  domain: GameraDomain
  teamId: number
  bio: {
    domain: GameraDomain
    teamId: number
    name: string
    nameDetail: {
      abbreviation: string
      market: string
      nickname: string
    }
    logoImageUrl: string
    colors: {
      foregroundColor: string
      backgroundColor: string
    }
    division: string
    conference: string
    league: string
    franchiseRepresentatives: GameraGalleryImage[]
    recordSummaries: {
      recordScope: string
      winPercentage: string
      record: string
    }[]
  }
  seasons: {
    name: string
    entity: GameraEntity
  }[]
  teamHistory: GameraGrid
  franchiseInfo: GameraGrid
  franchiseLeaders: GameraTeamLeader[]
  playerGallery: GameraGalleryImage[]
  disposition: {
    responseType: string
    resultsType: string
    intent: string
  }
}

export type Detail =
  | StatsDetail
  | NbaHistoricalBoxScore
  | NflHistoricalBoxScore
  | NhlHistoricalBoxScore
  | MlbHistoricalBoxScore
  | GameraGenericGridsDetail
  | PlayerProfileDetail
  | TeamProfileDetail
  | StandingsDetail
  | ScheduleDetail
