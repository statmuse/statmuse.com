import * as Session from '@lib/session'
import { defineMiddleware, sequence } from 'astro:middleware'
import * as User from '@statmuse/core/user'
import * as Visitor from '@statmuse/core/visitor'
import { contentSecurityPolicy } from './csp'
import { getTrendingData } from '@lib/trending'

export const logging = defineMiddleware(async (context, next) => {
  const req = context.request
  console.log(`${req.method} ${context.url.pathname}${context.url.search}`)
  return next()
})

export const session = defineMiddleware(async (context, next) => {
  if (context.url.pathname.startsWith('/_image')) {
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

  const setCookie = (key: string, value: string) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const local = context.url.hostname === 'localhost'
    context.cookies.set(key, decodeURIComponent(value), {
      path: '/',
      domain: local ? undefined : 'statmuse.com',
      expires: tomorrow,
      maxAge: 31536000,
    })
  }

  const uid = context.cookies.get('ajs_user_id')
  if (uid) {
    // giving it more chances to make it into the
    // cloudfront realtime logs lol
    setCookie('_ajs_user_id', uid.value)
    setCookie('__ajs_user_id', uid.value)
    setCookie('___ajs_user_id', uid.value)
  }

  const vid = context.cookies.get('ajs_anonymous_id')
  if (vid) {
    setCookie('_ajs_anonymous_id', vid.value)
    setCookie('__ajs_anonymous_id', vid.value)
    setCookie('___ajs_anonymous_id', vid.value)
  }

  locals.subscribed = locals.user?.stripe_subscription_status === 'active'
  return next()
})

export const cleanup = defineMiddleware(async (context, next) => {
  const remove = [
    'statmuse', // old mothra session
    'statmuse_csrf_token',
    'statmuse_tz',
    'cookie_status',
    'amplitude_idundefinedstatmuse.com',
    '_tracking_consent',
    'initialTrafficSource',
    '_shopify_y',
    '_y',
    '_fbp',
    '_ttp',
    '_tt_enable_cookie',
    '_shopify_m',
  ]

  for (const cookie of remove) {
    if (context.cookies.has(cookie)) {
      context.cookies.delete(cookie, { path: '/' })
    }
  }

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
  const league = context.params.league
  const trendingData = await getTrendingData(league ? { league } : undefined)
  context.locals.trendingData = trendingData
  return next()
})

export const onRequest = sequence(logging, session, trending, cleanup, headers)
