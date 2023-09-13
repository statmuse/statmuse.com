import type { APIRoute } from 'astro'

export const GET: APIRoute = (context) => {
  console.log(JSON.stringify(context.locals, undefined, 2))
  console.log(context.locals.foo)

  return new Response(
    JSON.stringify({
      message: 'This was a GET!',
    })
  )
}
