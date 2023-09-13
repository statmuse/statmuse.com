// @ts-ignore
export async function onRequest(context, next) {
  const keys = Object.keys(context)
  console.log(JSON.stringify(keys))
  console.log(JSON.stringify(context.cookies, undefined, 2))
  console.log(JSON.stringify(context.request, undefined, 2))
  return next()
}
