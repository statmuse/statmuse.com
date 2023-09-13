// @ts-ignore
export async function onRequest(context, next) {
  const response = await next()
  const keys = Object.keys(context).filter((k) => k !== 'clientAddress')
  for (const key of keys) {
    console.log(key, JSON.stringify(context[key], undefined, 2))
  }
  return response
}
