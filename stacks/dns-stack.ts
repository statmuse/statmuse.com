import { StackContext } from "sst/constructs"

export function DNS({ stack }: StackContext) {
  const zone = "statmuse.com"
  const subdomain = `v2.${zone}`
  const domain =
    stack.stage === "production" ? subdomain : `${stack.stage}.${subdomain}`
  return { zone, domain }
}
