export const NOT_FOUND_404 = new Response(null, {
  status: 404,
  statusText: 'Not found',
  headers: { 'Content-Type': 'text/html' },
})
