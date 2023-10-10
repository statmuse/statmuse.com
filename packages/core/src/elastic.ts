import { Client } from '@elastic/elasticsearch'
import type { SearchResponse } from '@elastic/elasticsearch/lib/api/types'
import { Config } from 'sst/node/config'

const creds = JSON.parse(Config.ELASTICSEARCH_CREDENTIALS) as {
  url: string
  username: string
  password: string
}

const client = new Client({
  node: creds.url,
  auth: {
    username: creds.username,
    password: creds.password,
  },
})

export type AskDocument = {
  color_background: string
  color_foreground: string
  display: string
  id: string
  image_url?: string
  'image_url?': boolean
  league: string
  path?: string
  type: string
  updated_at: string
}

export type FinanceAskDocument = {
  query: string
}

export const autosuggest = async (query: string, league?: string) => {
  const results: SearchResponse<AskDocument> | undefined = await client.search({
    index: 'asks.v2',
    size: 5,
    query: {
      bool: {
        filter: [],
        must: {
          bool: {
            should: [
              {
                multi_match: {
                  query: query,
                  fields: ['display', 'nickname'],
                  type: 'phrase_prefix',
                },
              },
              {
                multi_match: {
                  query: query,
                  fields: ['display', 'nickname^1'],
                  fuzziness: 2,
                  boost: 1,
                },
              },
              ...(query.length <= 3
                ? [
                    {
                      term: {
                        abbrev: {
                          boost: 1,
                          value: query.toUpperCase(),
                        },
                      },
                    },
                  ]
                : []),
            ],
          },
        },
        should: [
          {
            function_score: {
              boost_mode: 'replace',
              max_boost: 0.5,
              functions: [{ random_score: { field: '_seq_no' } }],
            },
          },
          ...(league
            ? [
                {
                  constant_score: {
                    filter: {
                      term: { league: league.toUpperCase() },
                    },
                    boost: 2,
                  },
                },
              ]
            : []),
        ],
      },
    },
  })

  if (!results) return results

  const x = results.hits.hits.reduce(
    (acc, x) => {
      if (x._source) {
        const score = x._score as number
        const { id, display, league, path, image_url, type } = x._source
        if (!(id in acc) || acc[id].score < score) {
          return {
            ...acc,
            [id]: {
              display,
              image_url,
              league,
              path,
              type,
              score,
            },
          }
        }
      }
      return acc
    },
    {} as Record<string, Partial<AskDocument> & { score: number }>,
  )

  return Object.values(x).sort((a, b) => b.score - a.score)
}

export const financeAutosuggest = async (query: string) => {
  const results: SearchResponse<FinanceAskDocument> | undefined =
    await client.search({
      index: 'finance_asks',
      size: 10,
      query: {
        function_score: {
          boost_mode: 'multiply',
          functions: [
            { gauss: { count_web_search: { origin: 1, scale: 10000 } } },
            {
              gauss: {
                last_web_search_at: {
                  offset: '1h',
                  origin: 'now',
                  scale: '3d',
                },
              },
            },
          ],
          query: { match: { query: `${query}` } },
          score_mode: 'sum',
        },
      },
    })

  if (!results) return results

  return results.hits.hits
    .map((x) => ({
      score: x._score || 0,
      display: x._source?.query,
    }))
    .sort((a, b) => b.score - a.score)
}
