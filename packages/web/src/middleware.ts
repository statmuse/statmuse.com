import * as Session from '@lib/session'
import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const locals = context.locals
  let session = Session.get(context)
  if (!session || session.type === 'public')
    session = await Session.create(context)

  const { type, properties } = session
  // @ts-expect-error
  locals.session = { type, ...properties }

  return next()
})
