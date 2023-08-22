import { HostedZone } from 'aws-cdk-lib/aws-route53'
import { StackContext } from 'sst/constructs'

export function DNS({ stack }: StackContext) {
  const zone = 'statmuse.com'
  const hostedZone = HostedZone.fromLookup(stack, 'zone', {
    domainName: zone,
  })

  const subdomain = `v2.${zone}`
  const domain =
    stack.stage === 'production' ? subdomain : `${stack.stage}.${subdomain}`
  return { zone, domain, hostedZone }
}
