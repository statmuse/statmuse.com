import { type StackContext, Api, Function, use } from 'sst/constructs'
import {
  Peer,
  Port,
  SecurityGroup,
  Subnet,
  SubnetType,
} from 'aws-cdk-lib/aws-ec2'
import { HttpApi, VpcLink } from '@aws-cdk/aws-apigatewayv2-alpha'
import { HttpAlbIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha'
import { Imports } from './imports'
import { Secrets } from './secrets'
import { DNS } from './dns'
import { ApplicationListener } from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import {
  AllowedMethods,
  CachePolicy,
  CacheQueryStringBehavior,
  Distribution,
  OriginRequestPolicy,
  PriceClass,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Duration } from 'aws-cdk-lib/core'
import { LambdaInsightsVersion } from 'aws-cdk-lib/aws-lambda'

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

  let GAMERA_API_URL = isProd
    ? 'http://gamera.statmuse.com/'
    : 'http://gamera.staging.statmuse.com/'

  if (isProd || isStaging) {
    const albListener = ApplicationListener.fromLookup(
      stack,
      'gamera-prod-alb-listener',
      {
        loadBalancerArn:
          'arn:aws:elasticloadbalancing:us-east-1:723112830140:loadbalancer/app/gamera-prod/69000dfcb10c6a79',
        listenerArn:
          'arn:aws:elasticloadbalancing:us-east-1:723112830140:listener/app/gamera-prod/69000dfcb10c6a79/66bcc3bb81da491a',
      },
    )

    const vpcLinkSg = new SecurityGroup(stack, 'gamera-proxy-vpc-link-sg', {
      vpc,
      allowAllOutbound: true,
    })
    vpcLinkSg.addIngressRule(Peer.anyIpv4(), Port.tcp(80))
    vpcLinkSg.addIngressRule(Peer.anyIpv4(), Port.tcp(443))

    const subnets = [
      Subnet.fromSubnetId(stack, 'gamera-proxy-vpc-link-1a', 'subnet-db00adad'),
      Subnet.fromSubnetId(stack, 'gamera-proxy-vpc-link-1b', 'subnet-e718dfbf'),
      Subnet.fromSubnetId(stack, 'gamera-proxy-vpc-link-1d', 'subnet-81e211ab'),
      Subnet.fromSubnetId(
        stack,
        'gamera-proxy-vpc-link-1f',
        'subnet-0a08534ad323b86d7',
      ),
    ]

    const vpcLink = new VpcLink(stack, 'gamera-proxy-vpc-link', {
      vpc,
      subnets: { subnets },
      securityGroups: [vpcLinkSg],
    })

    const gameraProxy = new HttpApi(stack, 'gamera-proxy-api', {
      apiName: `${stack.stage}-gamera-proxy-api`,
      defaultIntegration: new HttpAlbIntegration(
        'gamera-proxy-api-integration',
        albListener,
        { vpcLink },
      ),
    })

    const gameraCfDistro = new Distribution(stack, 'gamera-proxy-cf', {
      priceClass: PriceClass.PRICE_CLASS_100,
      defaultBehavior: {
        origin: new HttpOrigin(
          `${gameraProxy.httpApiId}.execute-api.${stack.region}.amazonaws.com`,
          { originShieldRegion: stack.region },
        ),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: AllowedMethods.ALLOW_ALL,
        cachePolicy: new CachePolicy(stack, 'gamera-proxy-cf-cache-policy', {
          queryStringBehavior: CacheQueryStringBehavior.all(),
          enableAcceptEncodingGzip: true,
          enableAcceptEncodingBrotli: true,
          // minTtl: Duration.seconds(0),
          defaultTtl: Duration.minutes(5),
        }),
        originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      },
    })

    GAMERA_API_URL = `https://${gameraCfDistro.distributionDomainName}/`
  }

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
    environment['POSTGRES_HOST'] = 'localhost'
    environment['POSTGRES_PORT'] = '5432'
    environment['POSTGRES_DATABASE'] = 'mothra_dev'
    environment['POSTGRES_USER'] = 'postgres'
    environment['POSTGRES_PASSWORD'] = 'postgres'
  }

  const api = new Api(stack, 'api', {
    routes: {
      // TODO: should be able to remove these next three as they
      // were only used by mothra, I think
      'POST /checkout': {
        authorizer: 'simple',
        function: 'packages/functions/src/stripe/checkout.handler',
      },
      'POST /user/delete': {
        authorizer: 'simple',
        function: 'packages/functions/src/user/delete.handler',
      },
      'POST /stripe/manage': {
        authorizer: 'simple',
        function: 'packages/functions/src/stripe/manage.handler',
      },
      'GET /search/suggest': {
        function: {
          handler: 'packages/functions/src/search/sports-suggest.handler',
          timeout: '3 seconds',
          memorySize: '128 MB',
          retryAttempts: 0,
        },
      },
      'GET /money/search/suggest': {
        function: {
          handler: 'packages/functions/src/search/money-suggest.handler',
          timeout: '3 seconds',
          memorySize: '128 MB',
          retryAttempts: 0,
        },
      },
      'POST /stripe/webhooks': {
        function: {
          handler: 'packages/functions/src/stripe/webhooks.handler',
          timeout: '5 seconds',
          memorySize: '128 MB',
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
        ],
        vpc,
        vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        securityGroups: [lambdaSecurityGroup],
        environment,
        nodejs: { install: ['pg'], esbuild: { external: ['pg-native'] } },
        runtime: 'nodejs18.x',
        architecture: 'arm_64',
        tracing: 'disabled',
        insightsVersion: LambdaInsightsVersion.VERSION_1_0_229_0,
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
