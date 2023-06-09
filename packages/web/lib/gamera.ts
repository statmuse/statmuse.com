const cdnBaseUrl = 'https://cdn.statmuse.com'

export const tokensToHtml = (tokens: GameraToken[]) => {
  return tokens.map(formatToken).join('').trim()
}

export const tokensToText = (tokens: GameraToken[]) => {
  return tokens.map(formatTokenTextOnly).join('').trim()
}

const parameterize = (text: string) => {
  return text.replaceAll(' ', '-').replaceAll('/', '-').toLowerCase()
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
    default:
      throw new Error('Unknown domain')
  }
}

export const getUrlForEntity = (entity: GameraEntity) => {
  const { display, domain, type, parameters, id } = entity
  const isPga = domain.toUpperCase() === 'PGA'
  const [teamId, yearId] = id.split('/')
  const isPostseason = parameters?.seasonType === 'postseason'
  let url = ''

  switch (type) {
    case 'player':
      url = isPga
        ? `/pga/ask/${parameterize(display)}-career-stats`
        : `/${domain.toLowerCase()}/player/${parameterize(display)}-${id}${
            parameters && parameters['seasonYear'] ? '/game-log' : ''
          }`
      break
    case 'teamSeason':
      url = `/${domain.toLowerCase()}/team/${parameterize(
        display.replaceAll('.', '')
      )}-${teamId}${isPostseason ? '/schedule' : ''}${
        yearId ? `/${yearId}` : ''
      }`
      break
    case 'teamFranchise':
      url = `/${domain.toLowerCase()}/team/${parameterize(
        display.replaceAll('.', '')
      )}-${id}/history`
      break
    case 'game':
      url = `/${domain.toLowerCase()}/game/${parameterize(
        display.replaceAll(' @ ', ' at ')
      )}-${id}`
      break
    default:
      throw new Error('Unknown entity type')
  }

  if (parameters && !isPga) {
    url += `?${new URLSearchParams(parameters).toString()}`
  }

  return url
}

const formatToken = (token: GameraToken) => {
  let text = token.text
  if (token.type === 'entity') {
    const url = getUrlForEntity(token.entity)

    text =
      text === token.entity?.display
        ? `<a href="${url}">${text}</a>`
        : `<a href="${url}" title="${token.entity.display}">${text}</a>`
  }

  return token.omitLeadingSpace ? text : ' ' + text
}

const formatTokenTextOnly = (token: GameraToken) => {
  const text = token.text
  return token.omitLeadingSpace ? text : ' ' + text
}

export type GameraDomain = 'NBA' | 'NFL' | 'MLB' | 'NHL' | 'PGA'

export type GameraToken = {
  text: string
  omitLeadingSpace: boolean
} & (
  | {
      type: 'general'
    }
  | {
      type: 'entity'
      entity: GameraEntity
    }
)

export type GameraEntity = {
  display: string
  domain: GameraDomain
  type: 'player' | 'teamFranchise' | 'teamSeason' | 'game'
  id: string
  parameters?: Record<string, string>
  baseResourcePath?: string
}

export interface GameraResponse {
  nlg: Nlg
  visual: {
    domain: GameraDomain
    summary: {
      answer: GameraToken[]
      subject: {
        actor: {
          year: number
          ids: [
            {
              id: string
              type: string
            }
          ]
        }
        imageUrl: string
        colors: {
          foreground: string
          background: string
        }
        entities: GameraEntity[]
      }
      narrator: {
        introAudioUrl: string
        answerWithIntroAudioUrl: string
        answerAudioUrl: string
        imageUrl: string
        actorId: string
      }
    }
    detail: [
      {
        entity: GameraEntity
      },
      {
        entity: GameraEntity
      },
      {
        gameId: 0
        completedGameStatus: string
        homeTeam: {
          name: string
          abbrev: string
          record: string
          score: 0
          logoUrl: string
          entity: GameraEntity
        }
        awayTeam: {
          name: string
          abbrev: string
          record: string
          score: 0
          logoUrl: string
          entity: GameraEntity
        }
        summary: {
          name: string
          columns: [
            {
              rowItemKey: string
              title: string
              type: string
            }
          ]
          rows: [
            {
              additionalProp1: {
                display: string
                imageUrl: string
                entity: GameraEntity
              }
              additionalProp2: {
                display: string
                imageUrl: string
                entity: GameraEntity
              }
              additionalProp3: {
                display: string
                imageUrl: string
                entity: GameraEntity
              }
            }
          ]
          aggregations: [
            {
              additionalProp1: {
                display: string
                imageUrl: string
                entity: GameraEntity
              }
              additionalProp2: {
                display: string
                imageUrl: string
                entity: GameraEntity
              }
              additionalProp3: {
                display: string
                imageUrl: string
                entity: GameraEntity
              }
            }
          ]
        }
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
            homeTeamScore: 0
            awayTeamScore: 0
          }
        ]
      },
      {
        gameId: 0
        completedGameStatus: string
        homeTeam: {
          name: string
          abbrev: string
          record: string
          score: 0
          logoUrl: string
          entity: GameraEntity
        }
        awayTeam: {
          name: string
          abbrev: string
          record: string
          score: 0
          logoUrl: string
          entity: GameraEntity
        }
        summary: GameraGrid
        teamDetail: {
          homeTeam: {
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
          awayTeam: {
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
            quarter: string
            team: string
            description: string
            homeTeamScore: 0
            awayTeamScore: 0
          }
        ]
      },
      {
        charts: [
          {
            name: string
            cumulative: true
            series: [
              {
                name: string
                zones: [
                  {
                    Z: 0
                    lFGM: 0
                    lFGA: 0
                    lFGPCT: 0
                    lPTS: 0
                    lPPS: 0
                    FGM: 0
                    FGA: 0
                    FGPCT: 0
                    PTS: 0
                    PPS: 0
                    FGPCT_Delta: 0
                    PPS_Delta: 0
                  }
                ]
                colors: [string]
                shots: [
                  {
                    X: 0
                    Y: 0
                    M: 0
                    Z: 0
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        gameId: 0
        completedGameStatus: string
        homeTeam: {
          name: string
          abbrev: string
          record: string
          score: 0
          logoUrl: string
          entity: GameraEntity
        }
        awayTeam: {
          name: string
          abbrev: string
          record: string
          score: 0
          logoUrl: string
          entity: GameraEntity
        }
        summary: GameraGrid
        teamDetail: {
          homeTeam: {
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
          awayTeam: {
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
      },
      {
        gameId: 0
        completedGameStatus: string
        homeTeam: {
          name: string
          abbrev: string
          record: string
          score: 0
          logoUrl: string
          entity: GameraEntity
        }
        awayTeam: {
          name: string
          abbrev: string
          record: string
          score: 0
          logoUrl: string
          entity: GameraEntity
        }
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
        scoringSummary: [
          {
            inning: string
            team: string
            description: string
            homeTeamScore: 0
            awayTeamScore: 0
          }
        ]
      },
      {
        scheduled: [
          {
            date: string
            time: string
            network: string
            homeTeam: {
              name: string
              logoUrl: string
              entity: GameraEntity
            }
            awayTeam: {
              name: string
              logoUrl: string
              entity: GameraEntity
            }
          }
        ]
        inProgress: [
          {
            date: string
            status: string
            gameId: string
            homeTeam: {
              name: string
              logoUrl: string
              score: 0
              entity: GameraEntity
            }
            awayTeam: {
              name: string
              logoUrl: string
              score: 0
              entity: GameraEntity
            }
          }
        ]
        completed: [
          {
            date: string
            gameId: string
            homeTeam: {
              name: string
              logoUrl: string
              score: 0
              entity: GameraEntity
            }
            awayTeam: {
              name: string
              logoUrl: string
              score: 0
              entity: GameraEntity
            }
            entity: GameraEntity
            completedGameStatus: string
          }
        ]
      },
      {
        topic: {
          additionalProp1: string
          additionalProp2: string
          additionalProp3: string
        }
        standings: [
          {
            group: string
            teams: [
              {
                name: string
                abbrev: string
                logoUrl: string
              }
            ]
            grid: GameraGrid
          }
        ]
      },
      {
        columnCharts: [
          {
            name: string
            series: [
              {
                name: string
                data: [
                  {
                    nameLines: [string]
                    y: 0
                    label: string
                    color: string
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
        ]
        grids: GameraGrid[]
      },
      {
        grids: GameraGrid[]
      }
    ]
    disclaimers: [string]
    summaryTokens: [
      {
        text: string
        type: string
        omitLeadingSpace: true
      }
    ]
    isSuperlative: true
    choices: [
      {
        display: string
        assetId: string
        input: string
      }
    ]
    additionalQuestions: [
      {
        domain: string
        text: string
      }
    ]
  }
  conversation: {
    token: string
    complete: boolean
  }
  disposition: {
    responseType: string
    resultsType: string
    intent: string
  }
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
  statsSummary: {
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
  stats: GameraGrid
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

// gameOddsIndicator
// genericGrids
// mlbHistoricalBoxScore
// nbaHistoricalBoxScore
// nbaShots
// nflHistoricalBoxScore
// nhlHistoricalBoxScore
// playerProfile
// schedule
// standings
// stats
// teamProfile

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

export interface NbaHistoricalBoxScore {
  type: 'nbaHistoricalBoxScore'
  gameId: number
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

export interface NflHistoricalBoxScore {
  type: 'nflHistoricalBoxScore'
  gameId: number
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

export interface MlbHistoricalBoxScore {
  type: 'mlbHistoricalBoxScore'
  gameId: number
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

export interface NhlHistoricalBoxScore {
  type: 'nhlHistoricalBoxScore'
  gameId: number
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

export interface GameraGenericGridsDetail {
  type: 'genericGrids'
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
  summary: Summary
  summaryTokens: GameraToken[]
  isSuperlative: boolean
  additionalQuestions: AdditionalQuestion[]
}

export interface NbaVisual extends Visual {
  domain: 'NBA'
  detail: [NbaHistoricalBoxScore, GameraGenericGridsDetail]
}

export interface NflVisual extends Visual {
  domain: 'NFL'
  detail: [NflHistoricalBoxScore, GameraGenericGridsDetail]
}

export interface MlbVisual extends Visual {
  domain: 'MLB'
  detail: [MlbHistoricalBoxScore, GameraGenericGridsDetail]
}

export interface NhlVisual extends Visual {
  domain: 'NHL'
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

export interface GameraBoxScoreBase {
  nlg: Nlg
  conversation: Conversation
  disposition: Disposition
  tokenizationScore: TokenizationScore
}

export interface GameraNbaBoxScore extends GameraBoxScoreBase {
  domain: 'NBA'
  visual: NbaVisual
}
export interface GameraNflBoxScore extends GameraBoxScoreBase {
  domain: 'NFL'
  visual: NflVisual
}
export interface GameraMlbBoxScore extends GameraBoxScoreBase {
  domain: 'MLB'
  visual: MlbVisual
}
export interface GameraNhlBoxScore extends GameraBoxScoreBase {
  domain: 'NHL'
  visual: NhlVisual
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
