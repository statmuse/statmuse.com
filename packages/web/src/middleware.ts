// @ts-ignore
export async function onRequest(context, next) {
  console.log(new Map(context.request.headers))
  console.log(new Map(context.cookies))
  console.log(new Map(context.locals))
  const response = await next()
  return response
}
