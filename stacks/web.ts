import {
  type StackContext,
  AstroSite,
  use,
  KinesisStream,
  Table,
} from 'sst/constructs'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'
import { API } from './api'
import { DNS } from './dns'
import { Imports } from './imports'
import { AnalyticsProxy } from './analytics-proxy'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import {
  AllowedMethods,
  CacheCookieBehavior,
  CacheHeaderBehavior,
  CacheQueryStringBehavior,
  CachePolicy,
  CachedMethods,
  Endpoint,
  RealtimeLogConfig,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { Secrets } from './secrets'
import {
  Architecture,
  Code,
  LayerVersion,
  Runtime,
  StartingPosition,
} from 'aws-cdk-lib/aws-lambda'
import { StreamMode } from 'aws-cdk-lib/aws-kinesis'
import { Trending } from './trending'
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53'
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets'
import { Duration } from 'aws-cdk-lib/core'
import { Realtime } from './realtime'

export function Web({ stack }: StackContext) {
  const dns = use(DNS)
  const api = use(API)
  const imports = use(Imports)
  const secrets = use(Secrets)
  const analytics = use(AnalyticsProxy)
  const trending = use(Trending)
  const realtime = use(Realtime)

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
          timeout: '1 minute',
          memorySize: '256 MB',
          bind: [secrets.SEGMENT_WRITE_KEY],
          prefetchSecrets: true,
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

  const domainName = isProd ? 'www.statmuse.com' : dns.domain

  const bedrockCache = new Table(stack, 'bedrock-cache', {
    fields: { query: 'string' },
    primaryIndex: { partitionKey: 'query' },
  })

  const astroSite = new AstroSite(stack, 'astro-site', {
    path: 'packages/web',
    timeout: '12 seconds',
    memorySize: '1024 MB',
    bind: [
      api.api,
      secrets.BOTPOISON,
      secrets.JWT_SECRET,
      secrets.STRIPE_SECRET,
      secrets.STRIPE_WEBHOOK_SECRET,
      secrets.STRIPE_PRICE_ID,
      secrets.SENDGRID_API_KEY,
      secrets.SENDGRID_TRANSACTIONAL_API_KEY,
      secrets.SEGMENT_WRITE_KEY,
      secrets.GAMERA_API_KEY,
      trending.table,
      bedrockCache,
    ],
    environment: {
      ...api.environment,
      PUBLIC_API_URL: api.api.customDomainUrl ?? api.api.url,
      PUBLIC_ANALYTICS_CDN_PROXY_URL: analytics.cdnUrl,
      PUBLIC_ANALYTICS_API_PROXY_URL: analytics.apiUrl,
      PUBLIC_STAGE: stack.stage,
      PUBLIC_IOT_HOST: realtime.endpointAddress,
      ASTRO_KEY: 'HtR3JQfF+0GoE9d38agf9Cz02zclLodbGTUUV+yMweQ=',
    },
    regional: { prefetchSecrets: true },
    nodejs: { install: ['pg'], esbuild: { external: ['pg-native', 'sharp'] } },
    cdk: {
      server: {
        vpc: api.vpc,
        vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        securityGroups: [api.lambdaSecurityGroup],
        layers: [layer],
      },
      serverCachePolicy: new CachePolicy(stack, 'DistributionCachePolicy', {
        queryStringBehavior: CacheQueryStringBehavior.all(),
        headerBehavior: CacheHeaderBehavior.allowList(
          'x-statmuse-platform',
          'x-statmuse-native-view',
          'CloudFront-Viewer-Country',
        ),
        cookieBehavior: CacheCookieBehavior.allowList('statmuse-platform'),
        defaultTtl: Duration.days(0),
        enableAcceptEncodingGzip: true,
        enableAcceptEncodingBrotli: true,
      }),
      distribution: {
        defaultBehavior: { realtimeLogConfig },
        webAclId: isProd
          ? 'arn:aws:wafv2:us-east-1:723112830140:global/webacl/statmuse-com-acl/e2ab5696-ad18-4946-a192-f534187ce9b5'
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
    permissions: [
      [api.rdsCredentialsSecret, 'grantRead'],
      'bedrock',
      'translate',
      'comprehend',
      'ses',
    ],
    customDomain: {
      hostedZone: dns.zone,
      domainName,
    },
  })

  if (astroSite.cdk) {
    new ARecord(stack, 'private-a-record', {
      zone: dns.privateZone,
      recordName: domainName,
      target: RecordTarget.fromAlias(
        new CloudFrontTarget(astroSite.cdk.distribution),
      ),
    })
  }

  stack.addOutputs({ CdnUrl: astroSite.url, Url: astroSite.customDomainUrl })

  return { astroSite }
}
