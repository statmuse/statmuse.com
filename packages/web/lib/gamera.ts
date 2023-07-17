import type { GameraResponse } from '@statmuse/core/gamera'
export const gameraApiUrl = import.meta.env.GAMERA_API_URL

export async function ask(league: string | undefined, query: string) {
  const requestUrl = `${gameraApiUrl}${league}/answer?input=${encodeURIComponent(
    query as string
  )}`
  const response = await fetch(requestUrl)
  return response.json() as Promise<GameraResponse>
}
