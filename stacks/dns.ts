import { HostedZone } from 'aws-cdk-lib/aws-route53'
import type { StackContext } from 'sst/constructs'

export function DNS({ stack }: StackContext) {
  const zone = 'statmuse.com'
  const hostedZone = HostedZone.fromLookup(stack, 'zone', {
    domainName: zone,
  })
  const privateZone = HostedZone.fromLookup(stack, 'zone', {
    domainName: zone,
    privateZone: true,
  })

  const subdomain = `v2.${zone}`
  const domain =
    stack.stage === 'production' ? subdomain : `${stack.stage}.${subdomain}`
  return { zone, domain, hostedZone, privateZone }
}
