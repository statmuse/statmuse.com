import { createSessionBuilder } from 'sst/node/future/auth'
import type { Visitor as VisitorT } from '@statmuse/core/visitor/visitor.sql'

export const sessions = createSessionBuilder<{
  visitor: {
    id: string
    bot?: boolean
    cookieStatus: VisitorT['cookie_status']
    origin: VisitorT['origin_name']
  }
  user: {
    id: string
    email: string
    visitorId: string
    upgrade?: boolean
    updated?: boolean
    cookieStatus: VisitorT['cookie_status']
    origin: VisitorT['origin_name']
    subscriptionStatus?: string
  }
}>()
