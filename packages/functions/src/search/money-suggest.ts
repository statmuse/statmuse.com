import { ApiHandler, useQueryParam } from 'sst/node/api'
import { type AskDocument, financeAutosuggest } from '@statmuse/core/elastic'
import { getUserFinanceAskSuggestions } from '@statmuse/core/ask'
import { sampleSize } from 'lodash-es'

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

export const handler = ApiHandler(async (_evt) => {
  const query = useQueryParam('query') as string
  const userId = useQueryParam('userId')

  let history: Partial<AskDocument>[] = []
  if (userId) {
    history = await getUserFinanceAskSuggestions(userId)
  }

  if (query === '') {
    return {
      statusCode: 200,
      body: JSON.stringify({
        history,
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
      history,
      suggestions,
      timestamp: new Date().toISOString(),
    }),
  }
})
