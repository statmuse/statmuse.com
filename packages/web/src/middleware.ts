import * as Session from '@lib/session'
import { defineMiddleware } from 'astro:middleware'
import * as User from '@statmuse/core/user'
import * as Visitor from '@statmuse/core/visitor'

export const onRequest = defineMiddleware(async (context, next) => {
  const locals = context.locals
  let session = Session.get(context)
  if (!session || session.type === 'public')
    session = await Session.create(context)

  locals.session = session

  if (!locals.visitor) {
    const visitorId =
      session.type === 'visitor'
        ? session.properties.id
        : session.type === 'user'
        ? session.properties.visitorId
        : undefined

    const visitor = await Visitor.get(visitorId!)
    if (!visitor) throw new Error('No visitor found')
    locals.visitor = visitor
  }

  locals.user =
    session.type === 'user'
      ? await User.fromEmail(session.properties.email)
      : undefined

  return next()
})
