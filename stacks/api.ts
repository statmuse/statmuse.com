import { type StackContext, Api, use } from 'sst/constructs'
import { Port, SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import { Imports } from './imports'
import { Secrets } from './secrets'
import { DNS } from './dns'

export function API({ stack }: StackContext) {
  const secrets = use(Secrets)
  const dns = use(DNS)
  const { vpc, rdsCredentialsSecret, rdsProxySecurityGroup } = use(Imports)

  const isStaging = stack.stage.startsWith('staging')
  const isProd = stack.stage === 'production'
  const isDev = !isStaging && !isProd

  const lambdaSecurityGroup = new SecurityGroup(stack, 'lambda-sg', { vpc })

  rdsProxySecurityGroup.addIngressRule(
    lambdaSecurityGroup,
    Port.tcp(5432),
    'allow lambda connection to rds proxy',
  )

  const GAMERA_API_URL = isProd
    ? 'https://gamera-prod.public.statmuse.com/'
    : 'http://gamera-staging-epl.ecs.statmuse.com/'

  const environment: Record<string, string> = {
    POSTGRES_SECRET_ARN: rdsCredentialsSecret.secretArn,
    POSTGRES_HOST: isProd
      ? 'mothra-prod.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com'
      : 'mothra-staging.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com',
    GAMERA_API_URL,
    KANEDAMA_API_URL: isProd
      ? 'http://kanedama.statmuse.com/'
      : 'http://kanedama.staging.statmuse.com/',
    SHORT_LINK_URL: isProd ? 'https://statm.us/' : 'https://stage.statm.us/',
  }

  if (isDev) {
    // environment['POSTGRES_HOST'] = 'localhost'
    environment['POSTGRES_PORT'] = '5432'
    environment['POSTGRES_DATABASE'] = 'mothra_dev'
    environment['POSTGRES_USER'] = 'postgres'
    environment['POSTGRES_PASSWORD'] = 'postgres'
  }

  const api = new Api(stack, 'api', {
    routes: {
      'GET /search/suggest': {
        function: {
          handler: 'packages/functions/src/search/sports-suggest.handler',
          retryAttempts: 0,
        },
      },
      'GET /money/search/suggest': {
        function: {
          handler: 'packages/functions/src/search/money-suggest.handler',
          retryAttempts: 0,
        },
      },
      'POST /stripe/webhooks': {
        function: {
          handler: 'packages/functions/src/stripe/webhooks.handler',
          timeout: '5 seconds',
        },
      },
    },
    defaults: {
      function: {
        bind: [
          secrets.ELASTICSEARCH_CREDENTIALS,
          secrets.STRIPE_SECRET,
          secrets.STRIPE_WEBHOOK_SECRET,
          secrets.STRIPE_PRICE_ID,
          secrets.SENDGRID_API_KEY,
          secrets.GAMERA_API_KEY,
        ],
        prefetchSecrets: true,
        vpc,
        vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        securityGroups: [lambdaSecurityGroup],
        environment,
        nodejs: { install: ['pg'], esbuild: { external: ['pg-native'] } },
      },
    },
    customDomain: {
      domainName: 'api.' + dns.domain,
      hostedZone: dns.hostedZone.zoneName,
    },
  })

  rdsCredentialsSecret.grantRead(api.getFunction('GET /search/suggest')!)
  rdsCredentialsSecret.grantRead(api.getFunction('GET /money/search/suggest')!)
  rdsCredentialsSecret.grantRead(api.getFunction('POST /stripe/webhooks')!)

  stack.addOutputs({ ApiEndpoint: api.url })

  return {
    api,
    secrets,
    vpc,
    environment,
    lambdaSecurityGroup,
    rdsCredentialsSecret,
  }
}
