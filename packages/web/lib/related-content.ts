import type {
  GameraDomain,
  PlayerCardResponse,
  TeamCardResponse,
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
  { stat: string; title: string }[]
> = {
  NBA: [
    { stat: 'mostPointsPerGame', title: 'PPG' },
    { stat: 'mostReboundsPerGame', title: 'RPG' },
    { stat: 'mostAssistsPerGame', title: 'APG' },
    { stat: 'mostThreePointersMade', title: '3PM' },
    { stat: 'bestTrueShootingPercentage', title: 'TS%' },
  ],
  NFL: [
    { stat: 'mostPassingYards', title: 'Pass Yards' },
    { stat: 'mostRushingYards', title: 'Rush Yards' },
    { stat: 'mostReceivingYards', title: 'Rec Yards' },
    { stat: 'mostDefensiveSacks', title: 'Sacks' },
    { stat: 'mostFantasyPoints', title: 'Fantasy Points' },
  ],
  NHL: [
    { stat: 'mostGoals', title: 'Goals' },
    { stat: 'mostAssists', title: 'Assists' },
    { stat: 'mostPoints', title: 'Points' },
    { stat: 'mostWins', title: 'Wins' },
    { stat: 'bestSavePercentage', title: 'Save%' },
  ],
  MLB: [
    { stat: 'mostBattingHomeRuns', title: 'Home Runs' },
    { stat: 'mostBattingRunsBattedIn', title: 'RBI' },
    { stat: 'bestBattingAverage', title: 'Batting Average' },
    { stat: 'bestPitchingEarnedRunAverage', title: 'ERA' },
    { stat: 'mostPitchingStrikeouts', title: 'Strikeouts' },
  ],
  EPL: [
    { stat: 'mostGoals', title: 'Goals' },
    { stat: 'mostAssists', title: 'Assists' },
    { stat: 'mostGoalsPlusAssists', title: 'G+A' },
    { stat: 'mostBigChancesCreated', title: 'Big Chances Created' },
    { stat: 'mostCleanSheets', title: 'Clean Sheets' },
  ],
}

export const homeLeadersByDomain = async (props: {
  context: Context
  domain: GameraDomain
}) => {
  const leaders = await getPlayerCards(props)
  if (leaders) {
    return playerMapByDomain[props.domain].map((x) => ({
      ...x,
      players: find(leaders.cards, { stat: x.stat })?.players ?? [],
    }))
  }
}

const teamMapByDomain: Record<GameraDomain, { stat: string; title: string }[]> =
  {
    NBA: [
      { stat: 'bestOffensiveRating', title: 'Offensive Rating' },
      { stat: 'bestDefensiveRating', title: 'Defensive Rating' },
      { stat: 'bestNetRating', title: 'Net Rating' },
      { stat: 'bestThreePointPercentage', title: '3P%' },
      { stat: 'mostAssistsPerGame', title: 'APG' },
    ],
    NFL: [
      { stat: 'mostPointsPerGame', title: 'PPG' },
      { stat: 'leastPointsAllowedPerGame', title: 'Defense PPG' },
      { stat: 'mostPassingYardsPerGame', title: 'Pass Yards' },
      { stat: 'mostRushingYardsPerGame', title: 'Rush Yards' },
      { stat: 'mostDefensiveSacks', title: 'Sacks' },
    ],
    NHL: [
      { stat: 'mostGoalsPerGame', title: 'Goals' },
      { stat: 'leastGoalsAllowedPerGame', title: 'Goals Against' },
      { stat: 'bestPowerPlayPercentage', title: 'Power Play%' },
      { stat: 'bestPenaltyKillPercentage', title: 'Penalty Kill%' },
      { stat: 'bestSavePercentage', title: 'PDO' },
    ],
    MLB: [
      { stat: 'mostBattingHomeRuns', title: 'Home Runs' },
      { stat: 'mostBattingRuns', title: 'Runs' },
      { stat: 'bestBattingAverage', title: 'Batting Average' },
      { stat: 'bestPitchingEarnedRunAverage', title: 'ERA' },
      { stat: 'mostPitchingStrikeouts', title: 'Strikeouts' },
    ],
    EPL: [
      { stat: 'mostGoals', title: 'Goals' },
      { stat: 'leastGoalsAgainst', title: 'Goals Conceded' },
      { stat: 'bestGoalDifferential', title: 'Goal Difference' },
      { stat: 'mostPossession', title: 'Possession' },
      { stat: 'mostCleanSheets', title: 'Clean Sheets' },
    ],
  }

export const homeRankingsByDomain = async (props: {
  context: Context
  domain: GameraDomain
}) => {
  const leaders = await getTeamCards(props)
  if (leaders) {
    return teamMapByDomain[props.domain].map((x) => ({
      ...x,
      teams: find(leaders.cards, { stat: x.stat })?.teams.slice(0, 3) ?? [],
    }))
  }
}

const bettingMapByDomain: Record<
  GameraDomain,
  { stat: string; title: string }[]
> = {
  NBA: [
    {
      stat: 'bestRecordAgainstTheSpread',
      title: 'Best Record Against the Spread',
    },
    {
      stat: 'worstRecordAgainstTheSpread',
      title: 'Worst Record Against the Spread',
    },
  ],
  NFL: [
    {
      stat: 'bestRecordAgainstTheSpread',
      title: 'Best Record Against the Spread',
    },
    {
      stat: 'worstRecordAgainstTheSpread',
      title: 'Worst Record Against the Spread',
    },
  ],
  NHL: [
    {
      stat: 'bestRecordAgainstTheSpread',
      title: 'Best Record Against the Puck Line',
    },
    {
      stat: 'worstRecordAgainstTheSpread',
      title: 'Worst Record Against the Puck Line',
    },
  ],
  MLB: [
    {
      stat: 'bestRecordAgainstTheSpread',
      title: 'Best Record Against the Run Line',
    },
    {
      stat: 'worstRecordAgainstTheSpread',
      title: 'Worst Record Against the Run Line',
    },
  ],
}

export const homeBettingByDomain = async (props: {
  context: Context
  domain: GameraDomain
}) => {
  if (props.domain === 'EPL') return undefined
  const leaders = await getTeamCards(props)
  console.log(leaders)
  if (leaders) {
    return bettingMapByDomain[props.domain].map((x) => ({
      ...x,
      teams: find(leaders.cards, { stat: x.stat })?.teams.slice(0, 3) ?? [],
    }))
  }
}
