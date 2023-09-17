import type { APIContext } from 'astro'
import { Auth } from 'sst/node/future/auth'
import * as Session from '@lib/session'
import { createCheckoutSession } from '@statmuse/core/stripe'

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
  if (
    session?.type === 'user' &&
    session.properties.upgrade &&
    session.properties.stripe_subscription_status !== 'active'
  ) {
    const user = session.properties
    const { url } = await createCheckoutSession({
      email: user.email,
      userId: user.id,
      successUrl: ctx.url.origin,
      cancelUrl: ctx.url.origin,
      customerId: user.stripe_customer_id ?? undefined,
      // referral: '',
    })
    if (url) return ctx.redirect(url)
  }

  return ctx.redirect('/', 302)
}
