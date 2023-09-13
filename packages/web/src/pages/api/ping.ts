import type { APIRoute } from 'astro'

export const GET: APIRoute = (context) => {
  const keys = Object.keys(context).filter((k) => k !== 'clientAddress')
  for (const key of keys) {
    // @ts-ignore
    console.log(key, JSON.stringify(context[key], undefined, 2))
  }

  return new Response(
    JSON.stringify({
      message: 'This was a GET!',
    })
  )
}
