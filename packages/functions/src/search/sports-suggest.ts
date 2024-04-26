import { ApiHandler, useQueryParam } from 'sst/node/api'
import { type AskDocument, autosuggest } from '@statmuse/core/elastic'
import { getUserAskSuggestions } from '@statmuse/core/ask'
import { sample } from 'lodash-es'

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

const eplExamples = [
  'Most xG by a U21 player this season?',
  'Score of the last North London derby?',
  'Who leads the league in big chances created?',
  'Which active winger has the most hat tricks?',
  'Non-penalty goal record for an Asian player',
].map((display) => ({ type: 'answer', league: 'epl', display }))

const examples = {
  fantasy: fantasyExamples,
  nba: nbaExamples,
  nfl: nflExamples,
  nhl: nhlExamples,
  mlb: mlbExamples,
  pga: pgaExamples,
  epl: eplExamples,
}

type League = keyof typeof examples

const getExampleSuggestions = (league?: League) => {
  if (league) {
    return examples[league]
  }

  return (['nba', 'nfl', 'nhl', 'mlb', 'epl', 'pga'] as League[]).map((key) =>
    sample(examples[key]),
  )
}

export const handler = ApiHandler(async (_evt) => {
  const query = useQueryParam('query') as string
  const league = useQueryParam('league') as League
  const userId = useQueryParam('userId')

  let history: Partial<AskDocument>[] = []
  if (userId) {
    history = await getUserAskSuggestions(userId)
  }

  if (query === '') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        sections: [
          { type: 'example', suggestions: getExampleSuggestions(league) },
          ...(history.length > 0
            ? [{ type: 'history', suggestions: history }]
            : []),
        ],
        timestamp: new Date().toISOString(),
      }),
    }
  }

  const suggestions = await autosuggest(query, league)

  if (!suggestions) return { statusCode: 422, body: 'Unprocessable Content' }

  return {
    statusCode: 200,
    body: JSON.stringify({
      sections: [
        { type: 'ask', suggestions },
        ...(history.length > 0
          ? [{ type: 'history', suggestions: history }]
          : []),
      ],
      timestamp: new Date().toISOString(),
    }),
  }
})
