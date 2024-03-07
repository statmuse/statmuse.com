import { type StackContext, use } from 'sst/constructs'
import { Auth as SSTAuth } from 'sst/constructs/future'
import { DNS } from './dns'
import { Secrets } from './secrets'
import { Imports } from './imports'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'
import { API } from './api'

export function Auth({ stack, app }: StackContext) {
  const dns = use(DNS)
  const secrets = use(Secrets)
  const { vpc } = use(Imports)
  const { lambdaSecurityGroup } = use(API)
  const { rdsCredentialsSecret } = use(Imports)

  const isProd = stack.stage === 'production'

  const auth = new SSTAuth(stack, 'auth', {
    authenticator: {
      handler: 'packages/functions/src/auth.handler',
      environment: {
        AUTH_FRONTEND_URL:
          app.mode === 'dev'
            ? 'http://localhost:3000'
            : isProd
            ? 'https://www.statmuse.com'
            : 'https://' + dns.domain,
        POSTGRES_SECRET_ARN: rdsCredentialsSecret.secretArn,
        POSTGRES_HOST: isProd
          ? 'mothra-prod.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com'
          : 'mothra-staging.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com',
      },
      bind: [
        secrets.BOTPOISON_SECRET_KEY,
        secrets.STRIPE_SECRET,
        secrets.STRIPE_WEBHOOK_SECRET,
        secrets.STRIPE_PRICE_ID,
        secrets.SENDGRID_API_KEY,
        secrets.SENDGRID_TRANSACTIONAL_API_KEY,
      ],
      permissions: ['ses', 'secretsmanager'],
      nodejs: { install: ['pg'], esbuild: { external: ['pg-native'] } },
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      securityGroups: [lambdaSecurityGroup],
      prefetchSecrets: true,
    },
    customDomain: {
      domainName: isProd ? 'auth.statmuse.com' : 'auth.' + dns.domain,
      hostedZone: dns.hostedZone.zoneName,
    },
  })

  stack.addOutputs({ AuthEndpoint: auth.url })

  return auth
}
