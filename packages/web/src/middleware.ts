import * as Session from '@lib/session'
import { defineMiddleware } from 'astro:middleware'
import * as User from '@statmuse/core/user'
import * as Visitor from '@statmuse/core/visitor'

export const onRequest = defineMiddleware(async (context, next) => {
  const req = context.request
  console.log(`${req.method} ${context.url.pathname}${context.url.search}`)
  console.log(new Map(req.headers))

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

  locals.subscribed = locals.user?.stripe_subscription_status === 'active'

  const response = await next()
  response.headers.set(
    'Content-Security-Policy',
    "default-src *; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.statmuse.com https://cdn.statmuse.com https://api.statmuse.com https://*.33across.com https://*.adsafeprotected.com https://*.amazon-adsystem.com https://*.aniview.com https://*.casalemedia.com https://*.cloudflare.com https://*.doubleverify.com https://*.doubleclick.net https://*.extremereach.io https://*.fastclick.net https://*.indexww.com https://*.moatads.com https://*.ntv.io https://*.postrelease.com https://*.resonate.com https://*.sendtonews.com https://*.springserve.com https://*.yimg.com https://adservice.google.com https://apis.google.com app.sgwidget.com https://cdn.amplitude.com https://cdn.ampproject.org https://cdn.jsdelivr.net https://cdn.jwplayer.com https://cdn.segment.com https://cdn.syndication.twimg.com https://connect.facebook.net https://iframe.fresh8.co https://imasdk.googleapis.com https://pagead2.googlesyndication.com https://partner.googleadservices.com https://platform.twitter.com https://resources.usersnap.com https://s.tradingview.com https://s0.2mdn.net https://s3.tradingview.com https://securepubads.g.doubleclick.net https://ssl.p.jwpcdn.com https://tpc.googlesyndication.com https://widget.usersnap.com https://www.google-analytics.com https://www.googletagmanager.com https://www.googletagservices.com https://www.gstatic.com https://r.wdfl.co; style-src 'self' 'unsafe-inline' https://cdn.statmuse.com https://*.cloudflare.com https://cdn.jsdelivr.net https://fonts.googleapis.com https://maxcdn.bootstrapcdn.com https://p.typekit.net https://platform.twitter.com https://themes.googleusercontent.com https://ton.twimg.com https://use.typekit.net; connect-src 'self' https://*.statmuse.com https://*.3lift.com https://*.adnxs.com https://*.adsafeprotected.com https://*.adsrvr.org https://*.amazon-adsystem.com https://*.bidswitch.net https://*.casalemedia.com https://*.cloudfront.net https://*.doubleclick.net https://*.doubleverify.com https://*.flashtalking.com https://*.fwmrm.net https://*.googlesyndication.com https://*.innovid.com https://*.jwplayer.com https://*.jwpsrv.com https://*.kargo.com https://*.media.net https://*.pubmatic.com https://*.reson8.com https://*.rkdms.com https://*.rlcdn.com https://*.rubiconproject.com https://*.sendtonews.com https://*.springserve.com https://*.stnvideo.com https://*.technoratimedia.com https://*.undertone.com https://*.unrulymedia.com https://*.yahoo.com https://api.statmuse.com api.amplitude.com https://api.getrewardful.com https://api.honeybadger.io https://api.segment.io https://app.sgwidget.com https://cdn.segment.com https://csi.gstatic.com https://entitlements.jwplayer.com https://pagead2.googlesyndication.com https://secure.gravatar.com https://securepubads.g.doubleclick.net https://stats.g.doubleclick.net https://videos-fms.jwpsrv.com https://widget.usersnap.com https://www.facebook.com https://www.google-analytics.com wss://www.statmuse.com; font-src 'self' chrome-extension: data: https://cdn.statmuse.com https://fonts.gstatic.com https://maxcdn.bootstrapcdn.com https://use.typekit.net; img-src * data:; media-src * blob:; worker-src blob:;",
  )

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

  return response
})
