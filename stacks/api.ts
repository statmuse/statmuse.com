import { StackContext, Api, Function, use } from 'sst/constructs'
import {
  InterfaceVpcEndpoint,
  Port,
  SecurityGroup,
  SubnetType,
} from 'aws-cdk-lib/aws-ec2'
import { Imports } from './imports'
import { Secrets } from './secrets'
import { DNS } from './dns'
import {
  EndpointType,
  HttpIntegration,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway'
import {
  AnyPrincipal,
  Effect,
  PolicyDocument,
  PolicyStatement,
} from 'aws-cdk-lib/aws-iam'
import { Duration } from 'aws-cdk-lib/core'

export function API({ stack }: StackContext) {
  const secrets = use(Secrets)
  const dns = use(DNS)
  const { vpc, rdsCredentialsSecret, rdsProxySecurityGroup } = use(Imports)

  const isStaging = stack.stage === 'staging'
  const isProd = stack.stage === 'production'
  const isDev = !isStaging && !isProd

  const lambdaSecurityGroup = new SecurityGroup(stack, 'lambda-sg', { vpc })

  rdsProxySecurityGroup.addIngressRule(
    lambdaSecurityGroup,
    Port.tcp(5432),
    'allow lambda connection to rds proxy',
  )

  const sg = new SecurityGroup(stack, 'vpc-endpoint-sg', {
    vpc,
    allowAllOutbound: true,
  })
  sg.addIngressRule(lambdaSecurityGroup, Port.tcp(443))

  const vpcEndpoint = new InterfaceVpcEndpoint(stack, 'vpc-endpoint', {
    vpc,
    service: { name: 'com.amazonaws.us-east-1.execute-api', port: 443 },
    subnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
    // privateDnsEnabled: true,
    securityGroups: [sg],
  })

  const gameraApiUrl = isProd
    ? 'http://gamera.statmuse.com/'
    : 'http://gamera.staging.statmuse.com/'

  const defaultIntegration = new HttpIntegration(gameraApiUrl, {
    // options: { passthroughBehavior: PassthroughBehavior.WHEN_NO_MATCH },
  })

  const gameraProxyApi = new RestApi(stack, 'gamera-proxy', {
    defaultIntegration,
    endpointConfiguration: {
      types: [EndpointType.PRIVATE],
      vpcEndpoints: [vpcEndpoint],
    },
    deployOptions: {
      cachingEnabled: true,
      cacheClusterEnabled: true,
      // 0.5 | 1.6 | 6.1 | 13.5 | 28.4 | 58.2 | 118 | 237
      cacheClusterSize: '58.2',
      cacheTtl: Duration.minutes(60),
      metricsEnabled: true,
    },
    policy: new PolicyDocument({
      statements: [
        new PolicyStatement({
          principals: [new AnyPrincipal()],
          actions: ['execute-api:Invoke'],
          resources: ['execute-api:/*'],
          effect: Effect.DENY,
          conditions: {
            StringNotEquals: {
              'aws:SourceVpce': vpcEndpoint.vpcEndpointId,
            },
          },
        }),
        new PolicyStatement({
          principals: [new AnyPrincipal()],
          actions: ['execute-api:Invoke'],
          resources: ['execute-api:/*'],
          effect: Effect.ALLOW,
        }),
      ],
    }),
  })

  gameraProxyApi.root.addMethod('GET', defaultIntegration)

  const environment: Record<string, string> = {
    POSTGRES_SECRET_ARN: rdsCredentialsSecret.secretArn,
    POSTGRES_HOST: isProd
      ? 'mothra-prod.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com'
      : 'mothra-staging.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com',
    GAMERA_API_URL: `${gameraProxyApi.restApiId}.execute-api.${stack.region}.amazonaws.com`,
    VPC_ENDPOINT_URL: `https://${vpcEndpoint.vpcEndpointId}.execute-api.${stack.region}.vpce.amazonaws.com/prod/`,
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
      'POST /checkout': {
        authorizer: 'simple',
        function: 'packages/functions/src/stripe/checkout.handler',
      },
      'GET /search/suggest': {
        function: 'packages/functions/src/search/sports-suggest.handler',
      },
      'GET /money/search/suggest': {
        function: 'packages/functions/src/search/money-suggest.handler',
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
          secrets.STRIPE_SECRET,
          secrets.STRIPE_WEBHOOK_SECRET,
          secrets.STRIPE_PRICE_ID,
          secrets.SENDGRID_API_KEY,
        ],
        vpc,
        vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        securityGroups: [lambdaSecurityGroup],
        environment,
        nodejs: { install: ['pg'], esbuild: { external: ['pg-native'] } },
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
    customDomain: {
      domainName: 'api.' + dns.domain,
      hostedZone: dns.hostedZone.zoneName,
    },
  })

  rdsCredentialsSecret.grantRead(api.getFunction('GET /search/suggest')!)
  rdsCredentialsSecret.grantRead(api.getFunction('GET /money/search/suggest')!)
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
