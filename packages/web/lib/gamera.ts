import type { GameraResponse } from '@statmuse/core/gamera'
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
  console.log(requestUrl)

  try {
    const response = await fetch(requestUrl)
    return response.json() as Promise<GameraResponse>
  } catch (error) {
    console.error(error)
  }
}
