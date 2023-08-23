import { GameraResponse, tokensToHtml } from '@statmuse/core/gamera'
import { relativeTimeFromDates } from '@statmuse/core/time'
import type { Musing } from '@statmuse/core/musings'
import type { HeroProps } from './props'
export const gameraApiUrl = import.meta.env.GAMERA_API_URL

export async function ask(options: {
  league?: string
  query: string
  conversationToken?: string
  preferredDomain?: string
}) {
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

  const requestUrl = `${gameraApiUrl}${
    league ? league + '/' : ''
  }answer?${new URLSearchParams(params).toString()}`

  try {
    const response = await fetch(requestUrl)
    return response.json() as Promise<GameraResponse>
  } catch (error) {
    console.error(error)
  }
}

export async function fantasyAsk(options: {
  query: string
  conversationToken?: string
}) {
  const query = options.query

  const params: Record<string, string> = {
    input: query,
  }

  if (options.conversationToken) {
    params['conversationToken'] = options.conversationToken
  }

  const requestUrl = `${gameraApiUrl}nfl/fantasy/answer?${new URLSearchParams(
    params
  ).toString()}`

  try {
    const response = await fetch(requestUrl)
    return response.json() as Promise<GameraResponse>
  } catch (error) {
    console.error(error)
  }
}

export function getHeroProps(props: {
  response?: GameraResponse
  musing?: Musing
  imageAlt: string
}): HeroProps | undefined {
  const answer = props.response ?? props.musing?.answer
  if (!answer) throw new Error('Must provide either data or musing')

  const musing = props.musing

  if (answer.type === 'nlgPromptForMoreInfoVisualChoicesOptional')
    return undefined

  const content = musing
    ? musing.text_markdown ?? (musing.text_plain as string)
    : tokensToHtml(answer.nlg.text.answer)
  const imageUrl = musing
    ? musing.image_url ?? undefined
    : answer.visual.summary.subject.imageUrl
  const answered = musing ? relativeTimeFromDates(musing.publish_at) : undefined
  const imageAlt = props.imageAlt

  return {
    content,
    markdown: !!musing,
    imageUrl,
    imageAlt,
    answered,
  }
}
