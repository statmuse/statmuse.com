import type { Context } from '../session'
import { Config } from 'sst/node/config'

const gameraApiUrl = import.meta.env.GAMERA_API_URL
const gameraApiKey = Config.GAMERA_API_KEY

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
