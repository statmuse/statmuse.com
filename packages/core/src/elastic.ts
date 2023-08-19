import { Client } from '@elastic/elasticsearch'
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types'
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

export const autosuggest = async (query: string, league?: string) => {
  const results: SearchResponse<AskDocument> = await client.search({
    index: 'asks.v2',
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
            ].concat(
              query.length <= 3
                ? {
                    term: {
                      abbrev: {
                        boost: 1,
                        value: query.toUpperCase(),
                      },
                    },
                  }
                : []
            ),
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
        ].concat(
          league
            ? {
                constant_score: {
                  filter: {
                    term: { league: league.toUpperCase() },
                  },
                  boost: 2,
                },
              }
            : []
        ),
      },
    },
  })

  const x = results.hits.hits.reduce((acc, x) => {
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
  }, {} as Record<string, Partial<AskDocument> & { score: number }>)

  return Object.values(x).sort((a, b) => b.score - a.score)
}
