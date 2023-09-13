// @ts-ignore
export async function onRequest(context, next) {
  context.locals.foo = 'bar'
  console.log(new Map(context.request.headers))
  console.log(JSON.stringify(context.locals, undefined, 2))
  const response = await next()
  return response
}
