import {
  type EplHistoricalBoxScore,
  type GameraAnswerEplBoxScore,
  type GameraResponse,
  type GameraChart,
  type PlayerProfileDetail,
  type TeamProfileDetail,
  tokensToHtml,
  tokensToText,
  getUrlForEntity,
  parameterize,
} from '@statmuse/core/gamera'
import { relativeTimeFromDates } from '@statmuse/core/time'
import type { Musing } from '@statmuse/core/musing'
import type { HeroProps } from '../props'
import type { Context } from '../session'
import { clarify } from '@lib/bedrock'
import { request } from '@lib/gamera/base'
import {
  getTeamFranchiseLatestSeason,
  getTeamSeasonOverview,
} from '@lib/gamera/teams'
import dayjs from 'dayjs'
import { getGameData } from './games'

type AskOptions = {
  league?: string
  query: string
  conversationToken?: string
  preferredDomain?: string
  corrected?: boolean
}

type AskResponse =
  | { response?: GameraResponse; lang?: string; dir?: string }
  | { redirect: string }

export async function ask(
  options: AskOptions,
  context: Context,
): Promise<AskResponse> {
  const league = options.league?.toLowerCase()
  const query = options.query

  const params: Record<string, string> = {
    input: query,
  }

  if (options.conversationToken) {
    params['conversationToken'] = options.conversationToken
  }
  if (options.preferredDomain) {
    params['preferredDomain'] = options.preferredDomain
  }

  const response = await request<GameraResponse>(
    context,
    `${league ? league + '/' : ''}answer`,
    params,
  )

  if (
    !options.corrected && // Don't correct if it's already been corrected
    response?.type === 'error' &&
    response?.disposition.responseType === 'not-understood'
  ) {
    try {
      const correction = await clarify(query)

      // if (correction.domain === 'money') {
      //   const url = createAskPath(correction)
      //   return { redirect: url }
      // }

      // if (correction.lang !== 'en') {
      //   const englishQuery = await translate({
      //     text: query,
      //     from: correction.lang,
      //     to: 'en',
      //   })
      //
      //   if (!englishQuery.text) return { response }
      //
      //   const englishResponse = await ask(
      //     {
      //       query: englishQuery.text,
      //       league:
      //         correction.domain === 'unknown' ? undefined : correction.domain,
      //       corrected: true,
      //     },
      //     context,
      //   )
      //   if ('redirect' in englishResponse) return englishResponse
      //
      //   const gameraResponse = englishResponse.response
      //   if (!gameraResponse) return { response }
      //
      //   if (
      //     gameraResponse.type !== 'nlgPromptForMoreInfoVisualChoicesOptional'
      //   ) {
      //     gameraResponse.visual = await translateObject(
      //       gameraResponse.visual,
      //       'en',
      //       correction.lang,
      //       [
      //         'summaryTokens.*.text',
      //         'summary.answer.*.text',
      //         'additionalQuestions.*.text',
      //         'detail.*.columnCharts.*.categories.*.nameLines.*',
      //         {
      //           key: 'detail.*.grids.*.columns.*.title',
      //           excluded: [
      //             // 'NAME',
      //             // 'SEASON',
      //             'TM',
      //             'GP',
      //             'PTS',
      //             'MPG',
      //             'PPG',
      //             'RPG',
      //             'APG',
      //             'SPG',
      //             'BPG',
      //             'TPG',
      //             'FGM',
      //             'FGA',
      //             'FG%',
      //             '3PM',
      //             '3PA',
      //             '3P%',
      //             'FTM',
      //             'FTA',
      //             'FT%',
      //             'MIN',
      //             'REB',
      //             'AST',
      //             'STL',
      //             'BLK',
      //             'TOV',
      //             'PF',
      //             '+/-',
      //           ],
      //         },
      //         'detail.*.grids.*.rows.*.NAME.display',
      //         'detail.*.grids.*.rows.*.NAME.entity.display',
      //       ],
      //     )
      //   }
      //   return {
      //     response: gameraResponse,
      //     lang: correction.lang,
      //     dir: correction.dir,
      //   }
      // }

      return ask(
        {
          ...options,
          query: correction.query,
          // league: correction.domain === 'unknown' ? undefined : correction.domain,
          corrected: true,
        },
        context,
      )
    } catch (error) {
      console.error('Error using Bedrock to cleanup input', error)
      return { response }
    }
  }

  return { response }
}

export function getHeroProps(props: {
  response?: GameraResponse
  musing?: Musing
  imageAlt: string
}): HeroProps | undefined {
  const answer = props.response ?? props.musing?.answer
  if (!answer) throw new Error('Must provide either response or musing')

  const musing = props.musing

  if (
    answer.type === 'nlgPromptForMoreInfoVisualChoicesOptional' ||
    answer.type === 'error'
  )
    return undefined

  const content = musing
    ? musing.text_markdown ?? (musing.text_plain as string)
    : tokensToHtml(answer.visual.summary.answer ?? answer.visual.summaryTokens)
  const imageUrl = musing
    ? musing.image_url ?? answer.visual.summary.subject.imageUrl
    : answer.visual.summary.subject.imageUrl
  const answered = musing ? relativeTimeFromDates(musing.publish_at) : undefined
  const imageAlt = props.imageAlt

  return {
    content,
    markdown: !!musing,
    html: !musing,
    imageUrl,
    imageAlt,
    answered,
  }
}

export const getColumnCharts = (answer: GameraResponse) => {
  if (answer.type === 'nlgPromptForMoreInfoVisualChoicesOptional')
    return undefined
  return answer.visual.detail?.reduce((out: GameraChart[] | undefined, d) => {
    if (out !== undefined) return out
    return d.type === 'stats' ? d.columnCharts : undefined
  }, undefined)
}

export const getIsSuperlative = (answer: GameraResponse) => {
  if (answer.type === 'nlgPromptForMoreInfoVisualChoicesOptional') return false
  return answer.visual.isSuperlative
}

export async function handleResponse(
  context: Context,
  response: GameraResponse,
) {
  const subject = response.visual.summary.subject
  const conversationToken = response.conversation.token
  if (response.type === 'nlgPromptForMoreInfoVisualChoicesOptional') {
    return { subject, conversationToken }
  }

  let redirectUrl = ''
  const playerProfile = response.visual.detail?.find(
    (d) => d.type === 'playerProfile',
  ) as PlayerProfileDetail
  if (playerProfile) {
    redirectUrl = getUrlForEntity(playerProfile.entity)
  }

  const teamProfile = response.visual.detail?.find(
    (d) => d.type === 'teamProfile',
  ) as TeamProfileDetail
  if (teamProfile) {
    const teamOverview = await getTeamSeasonOverview({
      context,
      domain: teamProfile.entity.domain,
      team: teamProfile.entity.id ?? '',
      year: teamProfile.entity.id ?? '',
    })

    if (teamOverview?.bio.hasStats) {
      redirectUrl = getUrlForEntity(teamProfile.entity)
    } else {
      const team = await getTeamFranchiseLatestSeason({
        context,
        domain: teamProfile.entity.domain,
        teamId: teamProfile.entity.id?.split('/')[0] ?? '',
      })

      redirectUrl = getUrlForEntity(team?.entity)
    }
  }

  const boxscore = response.visual.detail?.find((d) => d.type === 'boxScore')
  if (boxscore && response.visual.domain === 'MLB') {
    const game = await getGameData({
      context,
      domain: 'MLB',
      gameId: boxscore.gameId,
    })

    if (game) {
      const awayTeam = game.teams?.find(
        (t) => t.teamId === game.awayTeam.teamId,
      )
      const homeTeam = game.teams?.find(
        (t) => t.teamId === game.homeTeam.teamId,
      )

      redirectUrl = getUrlForEntity({
        type: 'game',
        domain: response.visual.domain ?? 'MLB',
        id: boxscore.gameId.toString(),
        display: `${dayjs(game.gameDate).format(
          'M/D/YYYY',
        )} ${awayTeam?.abbreviation} @ ${homeTeam?.abbreviation}`,
      })
    }
  }

  return {
    subject,
    redirectUrl,
    conversationToken,
  }
}

export function handleAskResponseFromPost(response: GameraResponse) {
  const query = tokensToText(
    response.visual.summaryTokens?.filter((t) => t.type !== 'inferred'),
  ).toLowerCase()

  if (response.type === 'nlgPromptForMoreInfoVisualChoicesOptional') {
    return { query }
  }

  const playerProfile = response.visual.detail?.find(
    (d) => d.type === 'playerProfile',
  ) as PlayerProfileDetail

  if (playerProfile) {
    if (playerProfile.entity.domain === 'PGA') {
      return {
        query: `${playerProfile.entity.display} career stats`,
      }
    }
    return {
      query,
      type: playerProfile.entity.type,
      player: `${parameterize(playerProfile.entity.display)}-${
        playerProfile.entity.id
      }`,
      league: playerProfile.entity.domain,
    }
  }

  const teamProfile = response.visual.detail?.find(
    (d) => d.type === 'teamProfile',
  ) as TeamProfileDetail

  if (teamProfile && teamProfile.entity.type === 'teamSeason') {
    const [teamId, year] = teamProfile.entity.id?.split('/') ?? ['', '']
    return {
      query,
      type: teamProfile.entity.type,
      team: `${parameterize(teamProfile.entity.display)}-${teamId}`,
      year,
      league: teamProfile.entity.domain,
    }
  }

  if (teamProfile && teamProfile.entity.type === 'teamFranchise') {
    return {
      query,
      type: teamProfile.entity.type,
      team: `${parameterize(teamProfile.entity.display)}-${
        teamProfile.entity.id
      }`,
      league: teamProfile.entity.domain,
    }
  }

  const eplBoxscore = response.visual.detail?.find(
    (d) => d.type === 'eplHistoricalBoxScore',
  ) as EplHistoricalBoxScore

  if (eplBoxscore) {
    return {
      query,
      type: eplBoxscore.type,
      data: response as GameraAnswerEplBoxScore,
    }
  }

  return { query }
}
