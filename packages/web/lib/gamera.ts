import { type GameraResponse, tokensToHtml } from '@statmuse/core/gamera'
import { relativeTimeFromDates } from '@statmuse/core/time'
import type { Musing } from '@statmuse/core/musing'
import type { HeroProps } from './props'
import type { Context } from './session'
export const gameraApiUrl = import.meta.env.GAMERA_API_URL
export const vpcEndpointUrl = import.meta.env.VPC_ENDPOINT_URL
import { createSignedFetcher } from 'aws-sigv4-fetch'

const signedFetcher = createSignedFetcher({
  service: 'apigateway',
  region: 'us-east-1',
})

export async function request<T>(
  context: Context,
  path: string,
  params?: Record<string, string> | URLSearchParams,
): Promise<T | undefined> {
  const requestUrl = `${vpcEndpointUrl}${path}${
    params ? '?' + new URLSearchParams(params).toString() : ''
  }`

  try {
    const response = await signedFetcher(requestUrl, {
      method: 'get',
      headers: getGameraHeaders(context),
    })
    console.log(response)
    return response.json() as Promise<T>
  } catch (error) {
    console.error(error)
    return undefined
  }
}

export async function ask(
  options: {
    league?: string
    query: string
    conversationToken?: string
    preferredDomain?: string
  },
  context: Context,
) {
  const league = options.league
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

  return request(context, `${league ? league + '/' : ''}answer`, params)
}

export async function fantasyAsk(
  options: {
    query: string
    conversationToken?: string
  },
  context: Context,
) {
  const query = options.query

  const params: Record<string, string> = {
    input: query,
  }

  if (options.conversationToken) {
    params['conversationToken'] = options.conversationToken
  }

  return request(context, 'nfl/fantasy/answer', params)
}

export const getGameraHeaders = (context: Context) => {
  const visitor = context.locals.visitor

  const headers: Record<string, string> = {
    Accept: 'application/json',
    Host: gameraApiUrl,
    'x-origin': visitor.origin_name,
    'x-origin-scope': 'browser',
    'x-origin-version': '2.0',
    'x-visitor-id': visitor.id,
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
  if (!answer) throw new Error('Must provide either data or musing')

  const musing = props.musing

  if (
    answer.type === 'nlgPromptForMoreInfoVisualChoicesOptional' ||
    answer.type === 'error'
  )
    return undefined

  const content = musing
    ? musing.text_markdown ?? (musing.text_plain as string)
    : tokensToHtml(answer.nlg.text.answer)
  const imageUrl = musing
    ? musing.image_url ?? undefined
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
    imageUrl,
    imageAlt,
    answered,
    audioUrl,
  }
}
