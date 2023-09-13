// @ts-ignore
export async function onRequest(context, next) {
  console.log(JSON.stringify(context.cookies, undefined, 2))
  console.log(JSON.stringify(context.request, undefined, 2))
  return next()
}
