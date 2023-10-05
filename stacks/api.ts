import { StackContext, Api, Function, use } from 'sst/constructs'
import { Port, SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2'
import { AlbArnTarget } from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets'
import { Imports } from './imports'
import { Secrets } from './secrets'
import { DNS } from './dns'
import {
  AuthorizationType,
  ConnectionType,
  EndpointType,
  Integration,
  IntegrationType,
  PassthroughBehavior,
  RestApi,
  VpcLink,
} from 'aws-cdk-lib/aws-apigateway'
import { Duration } from 'aws-cdk-lib/core'
import { NetworkLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2'

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

  const nlb = new NetworkLoadBalancer(stack, 'gamera-proxy-nlb', { vpc })

  const gameraApiAlbArn = isProd
    ? 'arn:aws:elasticloadbalancing:us-east-1:723112830140:loadbalancer/app/gamera-staging/7a5fdcd55dd05878'
    : 'arn:aws:elasticloadbalancing:us-east-1:723112830140:loadbalancer/app/gamera-prod/69000dfcb10c6a79'

  const listener = nlb.addListener('gamera-proxy-nlb-listener', { port: 80 })
  const group = listener.addTargets('gamera-proxy-nlb-listener-target', {
    port: 80,
    targets: [new AlbArnTarget(gameraApiAlbArn, 80)],
  })
  group.node.addDependency(vpc.internetConnectivityEstablished)

  const vpcLink = new VpcLink(stack, 'gamera-proxy-vpc-link', {
    targets: [nlb],
  })

  const defaultIntegration = new Integration({
    type: IntegrationType.HTTP_PROXY,
    integrationHttpMethod: 'GET',
    uri: `http://${nlb.loadBalancerDnsName}/{proxy}`,
    options: {
      connectionType: ConnectionType.VPC_LINK,
      vpcLink,
      passthroughBehavior: PassthroughBehavior.WHEN_NO_MATCH,
      requestParameters: {
        'integration.request.path.proxy': 'method.request.path.proxy',
      },
      cacheKeyParameters: [
        'method.request.path.proxy',
        'method.request.querystring.input',
      ],
    },
  })

  const gameraProxyApi = new RestApi(stack, 'gamera-proxy', {
    restApiName: `${stack.stage}-gamera-proxy`,
    endpointConfiguration: { types: [EndpointType.REGIONAL] },
    deployOptions: {
      cachingEnabled: true,
      cacheClusterEnabled: true,
      // 0.5 | 1.6 | 6.1 | 13.5 | 28.4 | 58.2 | 118 | 237
      cacheClusterSize: isProd ? '58.2' : '6.1',
      cacheTtl: Duration.minutes(5),
    },
  })

  const gameraProxyResource = gameraProxyApi.root.addProxy({
    defaultIntegration,
    defaultMethodOptions: {
      requestParameters: {
        'method.request.path.proxy': true,
        'method.request.querystring.input': false,
      },
      authorizationType:
        isProd || isStaging ? AuthorizationType.IAM : AuthorizationType.NONE,
    },
  })

  const environment: Record<string, string> = {
    POSTGRES_SECRET_ARN: rdsCredentialsSecret.secretArn,
    POSTGRES_HOST: isProd
      ? 'mothra-prod.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com'
      : 'mothra-staging.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com',
    GAMERA_API_URL: gameraProxyApi.url,
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
    gameraProxyApi,
    gameraProxyResource,
  }
}
