import type { GameraScheduleResponse } from '@statmuse/core/gamera'
import { request } from '@lib/gamera/base'
import type { Context } from '@lib/session'

export const getSchedule = async (props: {
  context: Context
  domain: string
  teamId?: string | number
}) => {
  try {
    const { domain, context, ...params } = props
    const league = domain.toLowerCase()
    const path = `${league}/schedule`
    const data = await request<GameraScheduleResponse>(context, path, params)
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
