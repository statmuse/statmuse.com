// @ts-ignore
export async function onRequest(context, next) {
  console.log(new Map(context.request.headers))
  const response = await next()
  return response
}
