import { StackContext, AstroSite, use } from "sst/constructs"
import { SubnetType } from "aws-cdk-lib/aws-ec2"
import { API } from "./api-stack"
import { DNS } from "./dns-stack"

export function Web({ stack }: StackContext) {
  const dns = use(DNS)
  const api = use(API)

  const astroSite = new AstroSite(stack, "astro-site", {
    path: "packages/web",
    bind: [
      api.secrets.STRIPE_SECRET,
      api.secrets.STRIPE_WEBHOOK_SECRET,
      api.secrets.STRIPE_PRICE_ID,
    ],
    environment: api.environment,
    nodejs: { install: ["pg"] },
    cdk: {
      server: {
        vpc: api.vpc,
        vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        securityGroups: [api.lambdaSecurityGroup],
      },
    },
    permissions: [[api.rdsCredentialsSecret, "grantRead"]],
    customDomain: {
      hostedZone: dns.zone,
      domainName: dns.domain,
    },
  })

  stack.addOutputs({ CdnUrl: astroSite.url, Url: astroSite.customDomainUrl })

  return { astroSite }
}
