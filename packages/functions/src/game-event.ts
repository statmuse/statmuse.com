import { Config } from 'sst/node/config'
import type {
  MlbGameDataResponse,
  MlbPlayByPlayResponse,
} from '@statmuse/core/gamera'
import * as Realtime from '@statmuse/core/realtime'
import { last } from 'lodash-es'

const gameraApiUrl = process.env.GAMERA_API_URL
const gameraApiKey = Config.GAMERA_API_KEY

const headers: Record<string, string> = {
  Accept: 'application/json',
  'x-origin': 'game-event.bot',
  'x-origin-scope': 'game-event',
  'x-origin-version': '1.0',
  'x-visitor-id': `game-event.${Config.STAGE}`,
  'x-statmuse-api-key': gameraApiKey,
}

type StatKey = 'pitchingStandard' | 'battingStandard'

const fetchGameData = async (props: {
  gameId: string | number
  statKeySet: StatKey[]
  version?: string
}): Promise<MlbGameDataResponse | undefined> => {
  try {
    const { gameId, statKeySet, version } = props
    const requestUrl =
      `${gameraApiUrl}mlb/games/${gameId}?` +
      new URLSearchParams(
        statKeySet
          .map((key) => ['statKeySet', key])
          .concat(version ? [['version', version]] : []),
      ).toString()
    const response = await fetch(requestUrl, { headers })
    return response.json()
  } catch (error) {
    console.error(error)
    return undefined
  }
}

const fetchPlayByPlay = async (props: {
  gameId: string | number
  version?: string
}): Promise<MlbPlayByPlayResponse | undefined> => {
  try {
    const { gameId, ...params } = props
    const requestUrl = `${gameraApiUrl}mlb/games/${gameId}/playByPlay?${new URLSearchParams(
      params,
    ).toString()}`
    const response = await fetch(requestUrl, { headers })
    return response.json()
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export const handler = async (event: any) => {
  try {
    const { gameId, gameVersion: version } = event.detail
    const [gameData, playByPlay] = await Promise.all([
      fetchGameData({
        gameId,
        version,
        statKeySet: ['battingStandard', 'pitchingStandard'],
      }),
      fetchPlayByPlay({ gameId, version }),
    ])

    const payload = {
      lastInning: last(playByPlay.innings),
      players: gameData.players,
      gameScore: {
        away: gameData.awayTeam.score,
        home: gameData.homeTeam.score,
      },
      lineup: {
        away: gameData.awayTeam.players,
        home: gameData.homeTeam.players,
      },
      stats: {
        away: gameData.awayTeam.stats,
        home: gameData.homeTeam.stats,
      },
      lineScore: {
        away: gameData.awayTeam.lineScore,
        home: gameData.homeTeam.lineScore,
      },
    }

    Realtime.publish(`mlb/game/${gameId}/all`, payload)
  } catch (error) {
    console.error(error)
  }
}
