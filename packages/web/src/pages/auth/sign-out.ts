import type { APIContext } from 'astro'
import * as Session from '@lib/session'

export async function GET(ctx: APIContext) {
  await Session.clear(ctx)
  return ctx.redirect('/', 302)
}
