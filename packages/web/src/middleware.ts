// @ts-ignore
export async function onRequest(context, next) {
  context.locals.foo = 'bar'
  console.log(new Map(context.request.headers))
  console.log(new Map(context.locals))
  const response = await next()
  return response
}
