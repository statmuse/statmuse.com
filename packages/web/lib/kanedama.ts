import { tokensToHtml } from '@statmuse/core/gamera'
import type { KanedamaResponse } from '@statmuse/core/kanedama'
import type { HeroProps } from './props'
export const kanedamaApiUrl = import.meta.env.KANEDAMA_API_URL

export async function ask(options: {
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

  const requestUrl = `${kanedamaApiUrl}answer?${new URLSearchParams(
    params
  ).toString()}`

  console.log(requestUrl)

  try {
    const response = await fetch(requestUrl)
    return response.json() as Promise<KanedamaResponse>
  } catch (error) {
    console.error(error)
  }
}

export function getHeroProps(props: {
  imageAlt: string
  response?: KanedamaResponse
}): HeroProps | undefined {
  const answer = props.response
  if (!answer) throw new Error('Must provide either data')

  if (answer.type === 'nlgPromptForMoreInfoVisualChoicesOptional')
    return undefined

  // const content = tokensToHtml(answer.nlg.text.answer)
  const imageUrl = answer.visual.summary.subject.imageUrl
  const imageAlt = props.imageAlt

  return {
    content: '',
    imageUrl,
    imageAlt,
  }
}
