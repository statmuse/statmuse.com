import { StackContext, use } from 'sst/constructs'
import { Auth as SSTAuth } from 'sst/constructs/future'
import { DNS } from './dns'
import { Secrets } from './secrets'
import { Imports } from './imports'

export function Auth({ stack, app }: StackContext) {
  const dns = use(DNS)
  const secrets = use(Secrets)
  const { rdsCredentialsSecret } = use(Imports)

  const isProd = stack.stage === 'production'

  const auth = new SSTAuth(stack, 'auth', {
    authenticator: {
      handler: 'packages/functions/src/auth.handler',
      environment: {
        AUTH_FRONTEND_URL:
          app.mode === 'dev'
            ? 'http://localhost:3000'
            : 'https://' + dns.domain,
        EMAIL_DOMAIN: dns.domain,
        POSTGRES_SECRET_ARN: rdsCredentialsSecret.secretArn,
        POSTGRES_HOST: isProd
          ? 'mothra-prod.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com'
          : 'mothra-staging.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com',
      },
      bind: [
        secrets.STRIPE_SECRET,
        secrets.STRIPE_WEBHOOK_SECRET,
        secrets.STRIPE_PRICE_ID,
        secrets.SENDGRID_API_KEY,
      ],
      permissions: ['ses', 'secretsmanager'],
    },
    customDomain: {
      domainName: 'auth.' + dns.domain,
      hostedZone: dns.hostedZone.zoneName,
    },
  })

  stack.addOutputs({ AuthEndpoint: auth.url })

  return auth
}
