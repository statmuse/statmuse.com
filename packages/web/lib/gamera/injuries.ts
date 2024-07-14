import { request } from '@lib/gamera/base'
import type { TeamInjuryResponse } from '@statmuse/core/gamera'
import type { Context } from '@lib/session'

export const getInjuries = async (props: { context: Context }) => {
  try {
    const data = await request<TeamInjuryResponse>(
      props.context,
      'mlb/injuries',
    )
    return data
  } catch (error) {
    console.error(error)
    return undefined
  }
}
