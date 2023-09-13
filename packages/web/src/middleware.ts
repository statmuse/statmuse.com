// @ts-ignore
export async function onRequest(context, next) {
  console.log(JSON.stringify(context, undefined, 2))
  return next()
}
