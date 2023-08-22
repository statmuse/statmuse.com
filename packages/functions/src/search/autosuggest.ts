import { ApiHandler, useQueryParam } from 'sst/node/api'
import { autosuggest, financeAutosuggest } from '@statmuse/core/elastic'
import { sample, sampleSize } from 'lodash-es'

const fantasyExamples = [
  'Should I start Ezekiel Elliott?',
  'Who will be the best fantasy wide receiver this week?',
  'Chubb or Dalvin or Kamara?',
  'Which TE is leading in PPR this season?',
  'Who scored the most fantasy points last season?',
].map((display) => ({ type: 'answer', league: 'nfl', display }))

const nbaExamples = [
  'Who leads the NBA in scoring?',
  "What is Steph's career true shooting percentage?",
  'Kevin Durant shot chart in 2013-14',
  'How tall is Yao Ming?',
  'Kobe playoff stats',
].map((display) => ({ type: 'answer', league: 'nba', display }))

const nflExamples = [
  'Did the Chiefs win?',
  'Most rushing touchdowns in a game ever?',
  'Which team has the most two-point conversions?',
  'Who had the most fantasy points last season?',
  'How did Randy Moss do as a rookie?',
].map((display) => ({ type: 'answer', league: 'nfl', display }))

const nhlExamples = [
  'Tell me about Wayne Gretzky',
  'Who won the Stanley Cup last season?',
  'NHL standings',
  'Who had the most game winning goals in the playoffs?',
  'Which team had the most power play points last year?',
].map((display) => ({ type: 'answer', league: 'nhl', display }))

const mlbExamples = [
  "What is the Dodgers' record?",
  'Who has the most RBI in a World Series?',
  'Who has the highest career strikeouts per 9 innings?',
  'Bartolo Colon weight?',
  'Which team has won the most World Series?',
].map((display) => ({ type: 'answer', league: 'mlb', display }))

const pgaExamples = [
  'PGA schedule',
  'Tiger career stats',
  'Who had the best putting average last season?',
  'Who won the PGA Championship in 1980?',
  'Highest FWY% by Phil Mickelson in a season?',
].map((display) => ({ type: 'answer', league: 'pga', display }))

const examples = {
  fantasy: fantasyExamples,
  nba: nbaExamples,
  nfl: nflExamples,
  nhl: nhlExamples,
  mlb: mlbExamples,
  pga: pgaExamples,
}

type League = keyof typeof examples

const financeExmaples = [
  "What's the all-time high price of Apple?",
  "What's the return of DKNG since March 12, 2020?",
  "What's the best returning stock since Jan 3, 2009?",
  "What's the return of Bitcoin since 2017?",
  'How did Zoom do?',
  'Tesla performance over the last 10 years',
  "What's the best return between square, wells fargo and citigroup in the last 5 years?",
  'Best performance in the last 5 years between c, wells fargo, jpm, goldman and BTC?',
  'Uber and Lyft returns this year',
  'Tell me about the S&P 500 this month',
  'How did the NASDAQ do last December?',
  'S&P 500, DJI, NASDAQ returns in the last 20 years',
  'NASDAQ returns in the last 20 years priced in Bitcoin',
  'XAU/GBP return in the last 10 years',
  "What's the return of Gold in terms of BTC since Jan 1, 2017?",
  'When is the next halvening?',
  "What's the hashrate?",
  "What's the return of Bitcoin since the last halving?",
  'Highest return between Bitcoin, Gold, NASDAQ and S&P 500 in the last decade',
  "What's the best return between AAPL, DKNG, ZOOM and Amazon since march 12, 2020?",
].map((x) => ({ display: x }))

const getExampleSuggestions = (league?: League) => {
  if (league) {
    return examples[league]
  }

  return (['nba', 'nfl', 'nhl', 'mlb', 'pga'] as League[]).map((key) =>
    sample(examples[key])
  )
}

export const handler = ApiHandler(async (_evt) => {
  const query = useQueryParam('query') as string
  const league = useQueryParam('league') as League

  if (query === '') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        history: [], // TODO: query user history
        suggestions: getExampleSuggestions(league),
        timestamp: new Date().toISOString(),
      }),
    }
  }

  const suggestions = await autosuggest(query, league)

  if (!suggestions) return { statusCode: 422, body: 'Unprocessable Content' }

  return {
    statusCode: 200,
    body: JSON.stringify({
      history: [], // TODO: query user history
      suggestions,
      timestamp: new Date().toISOString(),
    }),
  }
})

export const moneyHandler = ApiHandler(async (_evt) => {
  const query = useQueryParam('query') as string

  if (query === '') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        history: [], // TODO: query user history
        suggestions: sampleSize(financeExmaples, 5),
        timestamp: new Date().toISOString(),
      }),
    }
  }

  const suggestions = await financeAutosuggest(query)

  if (!suggestions) return { statusCode: 422, body: 'Unprocessable Content' }

  return {
    statusCode: 200,
    body: JSON.stringify({
      history: [], // TODO: query user history
      suggestions,
      timestamp: new Date().toISOString(),
    }),
  }
})
