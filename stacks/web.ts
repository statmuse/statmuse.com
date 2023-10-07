import { StackContext, AstroSite, use, KinesisStream } from 'sst/constructs'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'
import { API } from './api'
import { DNS } from './dns'
import { Imports } from './imports'
import { AnalyticsProxy } from './analytics-proxy'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import {
  AllowedMethods,
  CachePolicy,
  CachedMethods,
  Endpoint,
  RealtimeLogConfig,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { Auth } from './auth'
import { Secrets } from './secrets'
import {
  Architecture,
  Code,
  LayerVersion,
  Runtime,
  StartingPosition,
} from 'aws-cdk-lib/aws-lambda'
import { StreamMode } from 'aws-cdk-lib/aws-kinesis'

export function Web({ stack }: StackContext) {
  const dns = use(DNS)
  const api = use(API)
  const auth = use(Auth)
  const imports = use(Imports)
  const secrets = use(Secrets)
  const analytics = use(AnalyticsProxy)

  const isProd = stack.stage === 'production'

  const sitemapHeaders = new ResponseHeadersPolicy(stack, 'sitemap-headers', {
    customHeadersBehavior: {
      customHeaders: [
        {
          header: 'Cache-Control',
          value: 'public, max-age=0, must-revalidate',
          override: false,
        },
      ],
    },
  })

  const sitemapProps = {
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
    cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
    cachePolicy: CachePolicy.CACHING_OPTIMIZED,
    responseHeadersPolicy: sitemapHeaders,
    compress: true,
  }

  const layer = new LayerVersion(stack, 'sharp-layer', {
    code: Code.fromAsset('layers/sharp'),
    compatibleRuntimes: [Runtime.NODEJS_18_X],
    compatibleArchitectures: [Architecture.ARM_64],
  })

  const cfLogStream = new KinesisStream(stack, 'cf-realtime-logs-stream', {
    consumers: {
      consumer: {
        function: {
          handler: 'packages/functions/src/analytics/track.handler',
          timeout: '15 minutes',
          bind: [secrets.SEGMENT_WRITE_KEY],
        },
        cdk: {
          eventSource: {
            reportBatchItemFailures: true,
            bisectBatchOnError: true,
            startingPosition: StartingPosition.TRIM_HORIZON,
            parallelizationFactor: 10,
          },
        },
      },
    },
    cdk: { stream: { streamMode: StreamMode.ON_DEMAND } },
  })

  const realtimeLogConfig = new RealtimeLogConfig(stack, 'cf-realtime-logs', {
    endPoints: [Endpoint.fromKinesisStream(cfLogStream.cdk.stream)],
    fields: [
      'timestamp',
      'c-ip',
      'time-to-first-byte',
      'sc-status',
      'cs-method',
      'cs-uri-stem',
      'x-edge-location',
      'time-taken',
      'cs-user-agent',
      'cs-referer',
      'cs-cookie',
      'x-edge-result-type',
      'sc-content-type',
      'c-country',
      'cs-headers',
      'asn',
    ],
    samplingRate: 100,
  })

  const astroSite = new AstroSite(stack, 'astro-site', {
    path: 'packages/web',
    bind: [
      auth,
      auth.privateKey,
      api.api,
      secrets.STRIPE_SECRET,
      secrets.STRIPE_WEBHOOK_SECRET,
      secrets.STRIPE_PRICE_ID,
      secrets.SENDGRID_API_KEY,
      secrets.SEGMENT_WRITE_KEY,
    ],
    environment: {
      ...api.environment,
      PUBLIC_AUTH_URL: auth.url,
      PUBLIC_API_URL: api.api.customDomainUrl ?? api.api.url,
      PUBLIC_ANALYTICS_CDN_PROXY_URL: analytics.cdnUrl,
      PUBLIC_ANALYTICS_API_PROXY_URL: analytics.apiUrl,
      AUTH_ID: auth.id,
    },
    nodejs: { install: ['pg'], esbuild: { external: ['pg-native', 'sharp'] } },
    cdk: {
      server: {
        vpc: api.vpc,
        vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        securityGroups: [api.lambdaSecurityGroup],
      },
      distribution: {
        defaultBehavior: { realtimeLogConfig },
        webAclId: isProd
          ? 'arn:aws:wafv2:us-east-1:723112830140:global/webacl/CreatedByCloudFront-114df543-b96b-4233-a149-7b90a83c0911/c2c78158-2ed2-4bb1-8633-6f27a616fca1'
          : undefined,
        additionalBehaviors: {
          'sitemap.xml': {
            origin: new S3Origin(imports.statmuseProdBucket, {
              originPath: '/sitemaps',
            }),
            ...sitemapProps,
          },
          'sitemaps/*': {
            origin: new S3Origin(imports.statmuseProdBucket),
            ...sitemapProps,
          },
        },
      },
    },
    permissions: [[api.rdsCredentialsSecret, 'grantRead']],
    customDomain: {
      hostedZone: dns.zone,
      domainName: isProd ? 'www.statmuse.com' : dns.domain,
    },
  })

  stack.addOutputs({ CdnUrl: astroSite.url, Url: astroSite.customDomainUrl })

  return { astroSite }
}
