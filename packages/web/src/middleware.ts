// @ts-ignore
export async function onRequest(context, next) {
  console.log(JSON.stringify(context.request.headers, undefined, 2))
  const response = await next()
  return response
}
