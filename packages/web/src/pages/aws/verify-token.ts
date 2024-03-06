import type { APIRoute } from 'astro'

export const GET: APIRoute = async (ctx) => {
  return new Response(JSON.stringify({ result: 'success' }))
}
