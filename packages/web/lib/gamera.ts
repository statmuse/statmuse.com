import {
  type PlayerProfileDetail,
  type TeamProfileDetail,
  type GameraResponse,
  tokensToHtml,
  type GameraChart,
  getUrlForEntity,
} from '@statmuse/core/gamera'
import { relativeTimeFromDates } from '@statmuse/core/time'
import type { Musing } from '@statmuse/core/musing'
import type { HeroProps } from './props'
import type { Context } from './session'
import { Config } from 'sst/node/config'
import { clarify } from '@lib/bedrock'
import { translate, translateObject } from '@lib/translate'
import { createAskPath } from '@statmuse/core/path'
import { getTeamFranchiseLatestSeason, getTeamSeasonOverview } from './team'
export const gameraApiUrl = import.meta.env.GAMERA_API_URL
export const gameraApiKey = Config.GAMERA_API_KEY

export async function request<T>(
  context: Context,
  path: string,
  params?: Record<string, string | number> | URLSearchParams,
): Promise<T | undefined> {
  const requestUrl = `${gameraApiUrl}${path}?${new URLSearchParams(
    params as Record<string, string>,
  ).toString()}`

  try {
    const response = await fetch(requestUrl, {
      headers: getGameraHeaders(context),
    })
    return response.json() as Promise<T>
  } catch (error) {
    console.error(error)
    return undefined
  }
}

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

  let response = await request<GameraResponse>(
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

export const getGameraHeaders = (context: Context) => {
  const visitor = context.locals.visitor

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'x-origin': visitor.origin_name,
    'x-origin-scope': 'browser',
    'x-origin-version': '2.0',
    'x-visitor-id': visitor.id,
    'x-statmuse-api-key': gameraApiKey,
    // 'x-request-id': context.request.
  }

  if (visitor.last_request_ip) {
    headers['x-visitor-ip'] = visitor.last_request_ip
  }

  const timezoneOffset = getTimezoneOffset(visitor.timezone_name)
  if (timezoneOffset) {
    headers['x-visitor-tz'] = timezoneOffset
  }

  return headers
}

const getTimezoneOffset = (timeZone: string | undefined) => {
  if (!timeZone) return undefined

  const date = new Date()
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }))
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone }))
  const minutes = (tzDate.getTime() - utcDate.getTime()) / 6e4
  return (minutes / 60).toString()
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
  const audioUrl =
    props.musing?.audio_answer_url ||
    answer.visual.summary.narrator?.answerWithIntroAudioUrl ||
    answer.visual.summary.narrator?.answerAudioUrl

  return {
    content,
    markdown: !!musing,
    html: !musing,
    imageUrl,
    imageAlt,
    answered,
    audioUrl,
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
  const subject = response.visual?.summary?.subject
  const conversationToken = response.conversation?.token
  if (!subject) console.log({ response })

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
      team: teamProfile.entity.id,
      year: teamProfile.entity.id,
    })

    if (teamOverview?.bio.hasStats) {
      redirectUrl = getUrlForEntity(teamProfile.entity)
    } else {
      const team = await getTeamFranchiseLatestSeason({
        context,
        domain: teamProfile.entity.domain,
        teamId: teamProfile.entity.id.split('/')[0],
      })

      redirectUrl = getUrlForEntity(team?.entity)
    }
  }

  return {
    subject,
    redirectUrl,
    conversationToken,
  }
}
