import type { APIContext } from 'astro'
import * as Session from '@lib/session'
import { Auth } from 'sst/node/future/auth'

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
  return ctx.redirect('/', 302)
}
