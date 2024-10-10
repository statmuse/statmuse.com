import { request } from '@lib/gamera/base'
import type {
  GameraDomain,
  InjuriesResponseByDomain,
} from '@statmuse/core/gamera'
import type { Context } from '@lib/session'

export const getInjuries = async <
  D extends Extract<GameraDomain, 'MLB' | 'NFL'>,
>(props: {
  context: Context
  domain: D
  teamId?: number | number[]
}) => {
  try {
    const { domain, context, ...params } = props
    const data = await request<InjuriesResponseByDomain[D]>(
      context,
      `${domain.toLowerCase()}/injuries`,
      new URLSearchParams(
        Object.entries(params)
          .map(([k, v]) => (Array.isArray(v) ? v.map((x) => [k, x]) : [[k, v]]))
          .flat() as string[][],
      ),
    )
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
