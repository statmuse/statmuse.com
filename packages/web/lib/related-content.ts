import type {
  GameraDomain,
  PlayerCardResponse,
  TeamCardResponse,
  TeamInfo,
} from '@statmuse/core/gamera'
import { request } from '@lib/gamera'
import type { Context } from '@lib/session'
import { find } from 'lodash-es'

export const getPlayerCards = async (props: {
  context: Context
  domain: string
  teamId?: string | number
  seasonYear?: number
}) => {
  try {
    const { context, domain, ...params } = props
    const league = domain.toLowerCase()
    const path = `${league}/relatedContent/playerCards`
    const data = await request<PlayerCardResponse>(context, path, params)
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const getTeamCards = async (props: {
  context: Context
  domain: string
  teamId?: number
}) => {
  try {
    const { context, domain, ...params } = props
    const league = domain.toLowerCase()
    const path = `${league}/relatedContent/teamCards`
    const data = await request<TeamCardResponse>(context, path, params)
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}

const playerMapByDomain: Record<
  GameraDomain,
  { stat: string; title: string; query: string }[]
> = {
  NBA: [
    { stat: 'mostPointsPerGame', title: 'PPG', query: 'ppg leaders' },
    { stat: 'mostReboundsPerGame', title: 'RPG', query: 'rpg leaders' },
    { stat: 'mostAssistsPerGame', title: 'APG', query: 'apg leaders' },
    { stat: 'mostThreePointsMade', title: '3PM', query: 'most 3pm' },
    { stat: 'bestTrueShootingPercentage', title: 'TS%', query: 'ts% leaders' },
  ],
  NFL: [
    {
      stat: 'mostPassingYards',
      title: 'Pass Yards',
      query: 'pass yards leaders',
    },
    {
      stat: 'mostRushingYards',
      title: 'Rush Yards',
      query: 'rush yards leaders',
    },
    {
      stat: 'mostReceivingYards',
      title: 'Rec Yards',
      query: 'rec yards leaders',
    },
    { stat: 'mostDefensiveSacks', title: 'Sacks', query: 'sack leaders' },
    {
      stat: 'mostFantasyPoints',
      title: 'Fantasy Points',
      query: 'fantasy points leaders',
    },
  ],
  NHL: [
    { stat: 'mostGoals', title: 'Goals', query: 'goal leaders' },
    { stat: 'mostAssists', title: 'Assists', query: 'assist leaders' },
    { stat: 'mostPoints', title: 'Points', query: 'points leaders' },
    { stat: 'mostWins', title: 'Wins', query: 'wins leaders' },
    {
      stat: 'bestSavePercentage',
      title: 'Save%',
      query: 'save percentage leaders',
    },
  ],
  MLB: [
    { stat: 'mostBattingHomeRuns', title: 'Home Runs', query: 'hr leaders' },
    { stat: 'mostBattingRunsBattedIn', title: 'RBI', query: 'rbi leaders' },
    {
      stat: 'bestBattingAverage',
      title: 'Batting Average',
      query: 'batting average leaders',
    },
    {
      stat: 'bestPitchingEarnedRunAverage',
      title: 'ERA',
      query: 'era leaders',
    },
    {
      stat: 'mostPitchingStrikeouts',
      title: 'Strikeouts',
      query: 'pitching strikeout leaders',
    },
  ],
  EPL: [
    { stat: 'mostGoals', title: 'Goals', query: 'goal leaders' },
    { stat: 'mostAssists', title: 'Assists', query: 'assist leaders' },
    {
      stat: 'mostGoalsPlusAssists',
      title: 'G+A',
      query: 'goals plus assist leaders',
    },
    {
      stat: 'mostBigChancesCreated',
      title: 'Big Chances Created',
      query: 'big chances created leaders',
    },
    {
      stat: 'mostCleanSheets',
      title: 'Clean Sheets',
      query: 'clean sheet leaders',
    },
  ],
}

export const homeLeadersByDomain = async (props: {
  context: Context
  domain: GameraDomain
  league?: 'epl' | 'lal'
}) => {
  const leaders = await getPlayerCards(props)
  if (leaders) {
    return playerMapByDomain[props.domain].map((x) => ({
      ...x,
      domain: props.domain,
      query: `${x.query} ${leaders.seasonYearDisplay}${
        leaders.seasonType === 'postseason' ? ' postseason' : ''
      }`,
      seasonType: leaders.seasonType,
      players: find(leaders.cards, { stat: x.stat })?.players ?? [],
    }))
  }
}

export type PlayerLeadersResponse = Awaited<
  ReturnType<typeof homeLeadersByDomain>
>

const teamMapByDomain: Record<
  GameraDomain,
  { stat: string; title: string; query: string }[]
> = {
  NBA: [
    {
      stat: 'bestOffensiveRating',
      title: 'Offensive Rating',
      query: 'team ortg rankings',
    },
    {
      stat: 'bestDefensiveRating',
      title: 'Defensive Rating',
      query: 'team drtg rankings',
    },
    {
      stat: 'bestNetRating',
      title: 'Net Rating',
      query: 'team net rating rankings',
    },
    {
      stat: 'bestThreePointPercentage',
      title: '3P%',
      query: 'team three point percentage rankings',
    },
    {
      stat: 'mostAssistsPerGame',
      title: 'APG',
      query: 'team assists per game rankings',
    },
  ],
  NFL: [
    { stat: 'mostPointsPerGame', title: 'PPG', query: 'team ppg rankings' },
    {
      stat: 'leastPointsAllowedPerGame',
      title: 'Defense PPG',
      query: 'fewest points allowed per game by a team',
    },
    {
      stat: 'mostPassingYardsPerGame',
      title: 'Pass Yards',
      query: 'team pass yards per game rankings',
    },
    {
      stat: 'mostRushingYardsPerGame',
      title: 'Rush Yards',
      query: 'team rush yards per game rankings',
    },
    { stat: 'mostDefensiveSacks', title: 'Sacks', query: 'team sack rankings' },
  ],
  NHL: [
    {
      stat: 'mostGoalsPerGame',
      title: 'Goals',
      query: 'most goals per game by a team',
    },
    {
      stat: 'leastGoalsAllowedPerGame',
      title: 'Goals Against',
      query: 'fewest goals against per game by a team',
    },
    {
      stat: 'bestPowerPlayPercentage',
      title: 'Power Play%',
      query: 'highest pp%',
    },
    {
      stat: 'bestPenaltyKillPercentage',
      title: 'Penalty Kill%',
      query: 'best pk% by a team',
    },
    {
      stat: 'bestShootingPlusSavePercentage',
      title: 'PDO',
      query: 'highest pdo by a team',
    },
  ],
  MLB: [
    {
      stat: 'mostBattingHomeRuns',
      title: 'Home Runs',
      query: 'teams with the most hr',
    },
    {
      stat: 'mostBattingRuns',
      title: 'Runs',
      query: 'teams with the most runs scored',
    },
    {
      stat: 'bestBattingAverage',
      title: 'Batting Average',
      query: 'team with the highest batting average',
    },
    {
      stat: 'bestPitchingEarnedRunAverage',
      title: 'ERA',
      query: 'team with the lowest era',
    },
    {
      stat: 'mostPitchingStrikeouts',
      title: 'Strikeouts',
      query: 'teams with the most pitching strikouts',
    },
  ],
  EPL: [
    { stat: 'mostGoals', title: 'Goals', query: 'most goals by a team' },
    {
      stat: 'leastGoalsAgainst',
      title: 'Goals Conceded',
      query: 'fewest goals against by a team',
    },
    {
      stat: 'bestGoalDifferential',
      title: 'Goal Difference',
      query: 'highest goal difference by a team',
    },
    {
      stat: 'bestPossessionPercentage',
      title: 'Possession',
      query: 'team with the highest possession percentage',
    },
    {
      stat: 'mostCleanSheets',
      title: 'Clean Sheets',
      query: 'most clean sheets by a team',
    },
  ],
}

export const homeRankingsByDomain = async (props: {
  context: Context
  domain: GameraDomain
  league?: 'epl' | 'lal'
}) => {
  const leaders = await getTeamCards(props)
  if (leaders) {
    return teamMapByDomain[props.domain].map((x) => ({
      ...x,
      domain: props.domain,
      query: `${x.query} ${leaders.seasonYearDisplay}${
        leaders.seasonType === 'postseason' ? ' postseason' : ''
      }`,
      seasonType: leaders.seasonType,
      teams: find(leaders.cards, { stat: x.stat })?.teams.slice(0, 3) ?? [],
    }))
  }
}

export type TeamRankingsResponse = {
  domain: GameraDomain
  query: string
  teams: TeamInfo[]
  stat: string
  title: string
  images?: string[]
  seasonType: string
}[]

const bettingMapByDomain: Record<
  GameraDomain,
  { stat: string; title: string; query: string }[]
> = {
  NBA: [
    {
      stat: 'bestRecordAgainstTheSpread',
      title: 'Best Record Against the Spread',
      query: 'best record against the spread',
    },
    {
      stat: 'worstRecordAgainstTheSpread',
      title: 'Worst Record Against the Spread',
      query: 'worst record against the spread',
    },
  ],
  NFL: [
    {
      stat: 'bestRecordAgainstTheSpread',
      title: 'Best Record Against the Spread',
      query: 'best record against the spread',
    },
    {
      stat: 'worstRecordAgainstTheSpread',
      title: 'Worst Record Against the Spread',
      query: 'worst record against the spread',
    },
  ],
  NHL: [
    {
      stat: 'bestRecordAgainstTheSpread',
      title: 'Best Record Against the Puck Line',
      query: 'best record against the puck line',
    },
    {
      stat: 'worstRecordAgainstTheSpread',
      title: 'Worst Record Against the Puck Line',
      query: 'worst record against the puck line',
    },
  ],
  MLB: [
    {
      stat: 'bestRecordAgainstTheSpread',
      title: 'Best Record Against the Run Line',
      query: 'best record against the run line',
    },
    {
      stat: 'worstRecordAgainstTheSpread',
      title: 'Worst Record Against the Run Line',
      query: 'worst record against the run line',
    },
  ],
}

export const homeBettingByDomain = async (props: {
  context: Context
  domain: GameraDomain
}) => {
  if (props.domain === 'EPL') return undefined
  const leaders = await getTeamCards(props)
  if (leaders) {
    return bettingMapByDomain[props.domain].map((x) => ({
      ...x,
      domain: props.domain,
      query: `${x.query} ${leaders.seasonYearDisplay}`,
      teams: find(leaders.cards, { stat: x.stat })?.teams.slice(0, 3) ?? [],
    }))
  }
}
