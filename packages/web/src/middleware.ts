import * as Session from '@lib/session'
import * as User from '@statmuse/core/user'
import * as Visitor from '@statmuse/core/visitor'
import { defineMiddleware, sequence } from 'astro:middleware'
import { getTrendingData } from '@lib/trending'

export const logging = defineMiddleware(async (context, next) => {
  if (context.url.pathname.startsWith('/_image')) {
    return next()
  }

  const req = context.request
  console.log(`${req.method} ${context.url.pathname}${context.url.search}`)
  return next()
})

export const platform = defineMiddleware(async (context, next) => {
  if (context.url.pathname.startsWith('/_image')) {
    return next()
  }

  const platform = (context.request.headers?.get('x-statmuse-platform') ??
    context.cookies?.get('statmuse-platform')?.value ??
    'web') as 'web' | 'native'

  context.locals.platform = platform

  if (platform === 'native') {
    const localsCookie = context.cookies?.get('statmuse-locals')?.value
    if (localsCookie) context.locals = JSON.parse(localsCookie)

    const colorScheme = context.request.headers?.get('x-statmuse-color-scheme')
    if (colorScheme)
      context.locals.colorScheme = colorScheme as 'light' | 'dark'

    const nativeView = context.request.headers?.get('x-statmuse-native-view')
    if (nativeView)
      context.locals.nativeView = nativeView as typeof context.locals.nativeView

    const deviceId = context.request.headers?.get('x-statmuse-device-id')
    if (deviceId) context.locals.deviceId = deviceId

    console.log('context.locals', context.locals)

    const nextYear = new Date()
    nextYear.setDate(nextYear.getDate() + 365)

    const local = context.url.hostname === 'localhost'
    const commonCookieProps = {
      path: '/',
      domain: local ? undefined : 'statmuse.com',
      expires: nextYear,
      maxAge: 31536000,
    }
    context.cookies.set('statmuse-platform', platform, commonCookieProps)
    context.cookies.set(
      'statmuse-locals',
      JSON.stringify({ ...context.locals, nativeView: undefined }),
      commonCookieProps,
    )
  }

  return next()
})

export const session = defineMiddleware(async (context, next) => {
  if (context.url.pathname.startsWith('/_image')) {
    return next()
  }

  if (
    context.locals.session &&
    (context.locals.user || context.locals.visitor)
  ) {
    return next()
  }

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

    console.log({ visitorId })
    const visitor = await Visitor.get(visitorId!)
    if (!visitor) throw new Error('No visitor found')
    locals.visitor = visitor
  }

  locals.user =
    session.type === 'user'
      ? await User.fromEmail(session.properties.email)
      : undefined

  console.log('visitor', locals.visitor.id)
  if (locals.user) console.log('user', locals.user.id)

  // if user subscription status changes and differs from session
  // then update session cookie
  if (
    locals.user &&
    session.type === 'user' &&
    session.properties.subscriptionStatus !==
      locals.user.stripe_subscription_status
  ) {
    Session.update(context, {
      subscriptionStatus: locals.user.stripe_subscription_status,
    })
  }

  if (locals.platform === 'native') {
    const visitorId =
      session.type === 'visitor'
        ? session.properties.id
        : session.type === 'user'
        ? session.properties.visitorId
        : undefined
    session.type = 'user'
    Session.update(context, {
      id: visitorId,
      userId: visitorId,
      visitorId,
      subscriptionStatus: 'active',
    })
  }

  locals.subscribed =
    locals.user?.stripe_subscription_status === 'active' ||
    locals.platform === 'native'

  // set timezone in locals
  locals.timezone = context.cookies.get('tz')?.value ?? 'America/New_York'

  return next()
})

export const headers = defineMiddleware(async (_context, next) => {
  const response = await next()
  // response.headers.set('Content-Security-Policy', contentSecurityPolicy)

  response.headers.set('Cross-Origin-Window-Policy', 'deny')
  response.headers.set('Referrer-Policy', 'no-referrer-when-downgrade')
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubdomains;',
  )
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Download-Options', 'noopen')
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  response.headers.set('X-Xss-Protection', '1; mode=block')

  if (response.headers.has('Cache-Control')) {
    const cacheControl = response.headers.get('Cache-Control')
    if (!cacheControl?.includes('Set-Cookie')) {
      response.headers.set(
        'Cache-Control',
        `${cacheControl}, no-cache="Set-Cookie"`,
      )
    }
  }

  return response
})

export const trending = defineMiddleware(async (context, next) => {
  if (
    context.url.pathname.startsWith('/_image') ||
    context.url.pathname === '/auth/session'
  ) {
    return next()
  }

  const league = context.params.league
    ? context.params.league
    : /^\/money\/?/.test(context.url.pathname)
    ? 'money'
    : undefined

  const trendingData = await getTrendingData(league ? { league } : undefined)
  context.locals.trendingData = trendingData
  return next()
})

export const onRequest = sequence(logging, platform, session, trending, headers)
