import type { APIContext } from 'astro'
import { Auth } from 'sst/node/future/auth'
import * as Session from '@lib/session'
import * as User from '@statmuse/core/user'
import {
  createBillingSession,
  createCheckoutSession,
} from '@statmuse/core/stripe'

export async function GET(ctx: APIContext) {
  const code = ctx.url.searchParams.get('code')
  if (!code) throw new Error('Code missing')

  const response = await fetch(Auth.auth.url + '/token', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: 'web',
      code,
      redirect_uri: `${ctx.url.origin}${ctx.url.pathname}`,
    }),
  }).then((r) => r.json() as unknown as { access_token: string })

  Session.set(ctx, response.access_token)

  const session = Session.verify(response.access_token)
  if (session.type !== 'user') {
    return ctx.redirect('/', 302)
  }

  const user = await User.get(session.properties.id)

  if (
    session.properties.upgrade &&
    (user?.stripe_subscription_status === 'canceled' ||
      !user?.stripe_subscription_status)
  ) {
    const { url } = await createCheckoutSession({
      email: session.properties.email,
      userId: session.properties.id,
      successUrl: ctx.url.origin,
      cancelUrl: ctx.url.origin + '/auth/signup',
      customerId: user?.stripe_customer_id ?? undefined,
      // referral: '',
    })

    if (url) return ctx.redirect(url)
  }

  if (
    session.properties.upgrade &&
    user?.stripe_subscription_status !== 'active'
  ) {
    const { url } = await createBillingSession({
      customerId: user?.stripe_customer_id as string,
      returnUrl: ctx.url.origin,
    })

    if (url) return ctx.redirect(url)
  }

  const url = session.properties.updated ? '/account/settings' : '/'
  return ctx.redirect(url, 302)
}
