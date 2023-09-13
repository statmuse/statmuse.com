import { StackContext, Api, Function, use } from 'sst/constructs'
import { Port, SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import { Imports } from './imports-stack'
import { Secrets } from './secrets-stack'

export function API({ stack }: StackContext) {
  const { secrets } = use(Secrets)

  const { vpc, rdsCredentialsSecret, rdsProxySecurityGroup } = use(Imports)

  const isStaging = stack.stage === 'staging'
  const isProd = stack.stage === 'production'
  const isDev = !isStaging && !isProd

  const lambdaSecurityGroup = new SecurityGroup(stack, 'lambda-sg', { vpc })

  rdsProxySecurityGroup.addIngressRule(
    lambdaSecurityGroup,
    Port.tcp(5432),
    'allow lambda connection to rds proxy'
  )

  const environment: Record<string, string> = {
    POSTGRES_SECRET_ARN: rdsCredentialsSecret.secretArn,
    POSTGRES_HOST: isProd
      ? 'mothra-prod.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com'
      : 'mothra-staging.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com',
    GAMERA_API_URL: isProd
      ? 'http://gamera.statmuse.com/'
      : 'http://gamera.staging.statmuse.com/',
    KANEDAMA_API_URL: isProd
      ? 'http://kanedama.statmuse.com/'
      : 'http://kanedama.staging.statmuse.com/',
    SHORT_LINK_URL: isProd ? 'https://statm.us/' : 'https://stage.statm.us/',
  }

  if (isDev) {
    environment['POSTGRES_HOST'] = 'localhost'
    environment['POSTGRES_PORT'] = '5432'
    environment['POSTGRES_DATABASE'] = 'mothra_dev'
    environment['POSTGRES_USER'] = 'postgres'
    environment['POSTGRES_PASSWORD'] = 'postgres'
  }

  const api = new Api(stack, 'api', {
    routes: {
      'POST /analytics/track': {
        function: 'packages/functions/src/analytics/track.handler',
      },
      'POST /checkout': {
        authorizer: 'simple',
        function: 'packages/functions/src/stripe/checkout.handler',
      },
      'GET /search/suggest': {
        function: 'packages/functions/src/search/autosuggest.handler',
      },
      'GET /money/search/suggest': {
        function: 'packages/functions/src/search/autosuggest.moneyHandler',
      },
      'POST /stripe/manage': {
        authorizer: 'simple',
        function: 'packages/functions/src/stripe/manage.handler',
      },
      'POST /user/delete': {
        authorizer: 'simple',
        function: 'packages/functions/src/user/delete.handler',
      },
      'POST /stripe/webhooks': 'packages/functions/src/stripe/webhooks.handler',
    },
    defaults: {
      function: {
        bind: [
          secrets.ELASTICSEARCH_CREDENTIALS,
          secrets.SEGMENT_WRITE_KEY,
          secrets.STRIPE_SECRET,
          secrets.STRIPE_WEBHOOK_SECRET,
          secrets.STRIPE_PRICE_ID,
        ],
        vpc,
        vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        securityGroups: [lambdaSecurityGroup],
        environment,
        nodejs: { install: ['pg'] },
      },
    },
    authorizers: {
      simple: {
        type: 'lambda',
        function: new Function(stack, 'simple-authorizer', {
          handler: 'packages/functions/src/authorizer.handler',
          bind: [secrets.API_KEY],
        }),
        resultsCacheTtl: '1 minute',
        responseTypes: ['simple'],
      },
    },
  })

  rdsCredentialsSecret.grantRead(api.getFunction('POST /checkout')!)
  rdsCredentialsSecret.grantRead(api.getFunction('POST /stripe/manage')!)
  rdsCredentialsSecret.grantRead(api.getFunction('POST /stripe/webhooks')!)
  rdsCredentialsSecret.grantRead(api.getFunction('POST /user/delete')!)

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
