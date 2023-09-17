import type { APIRoute } from 'astro'

export const GET: APIRoute = async (ctx) => {
  console.log(ctx.locals.visitor)
  console.log(ctx.locals.user)
  return new Response(JSON.stringify(ctx.locals.session))
}
