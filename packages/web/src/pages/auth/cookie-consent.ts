import type { APIContext } from 'astro'
import * as Session from '@lib/session'
import * as Visitor from '@statmuse/core/visitor'
import type { Visitor as VisitorT } from '@statmuse/core/visitor/visitor.sql'

export async function POST(ctx: APIContext) {
  const body = (await ctx.request.json()) as {
    cookie_status: VisitorT['cookie_status']
  }

  if (!body.cookie_status) {
    return new Response(JSON.stringify({ status: 'Unprocessable entity' }), {
      status: 422,
    })
  }

  const visitorId = ctx.locals.visitor.id
  const visitor = await Visitor.update(visitorId, {
    cookie_status: body.cookie_status,
  })

  if (!visitor) {
    return new Response(JSON.stringify({ status: 'Not Found' }), {
      status: 404,
    })
  }

  Session.update(ctx, {
    cookieStatus: body.cookie_status,
  })

  return new Response(JSON.stringify({ status: 'OK' }))
}
