import type { APIRoute } from 'astro'

export const GET: APIRoute = (context) => {
  console.log(JSON.stringify(context, undefined, 2))

  return new Response(
    JSON.stringify({
      message: 'This was a GET!',
    })
  )
}
