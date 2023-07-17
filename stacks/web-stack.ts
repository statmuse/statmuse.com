import { SubnetType } from "aws-cdk-lib/aws-ec2"
import { StackContext, AstroSite, use } from "sst/constructs"
import { API } from "./api-stack"

export function Web({ stack }: StackContext) {
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
  })

  return { astroSite }
}
