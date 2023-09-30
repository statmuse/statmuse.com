import { StackContext, AstroSite, use } from 'sst/constructs'
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
  FunctionCode,
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
} from 'aws-cdk-lib/aws-lambda'
import { Function as CfFunction } from 'aws-cdk-lib/aws-cloudfront'

export function Web({ stack }: StackContext) {
  const dns = use(DNS)
  const api = use(API)
  const auth = use(Auth)
  const imports = use(Imports)
  const secrets = use(Secrets)
  const analytics = use(AnalyticsProxy)

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
      domainName: dns.domain,
    },
  })

  const cfFunction = new CfFunction(stack, 'redirect-function', {
    code: FunctionCode.fromInline(`
       function handler(event) {
          var request = event.request;
          var headers = request.headers;
          var host = request.headers.host.value;
          var australia = 'AU'
        
          if (headers['cloudfront-viewer-country']) {
              var countryCode = headers['cloudfront-viewer-country'].value;
              if (countryCode === country) {
                  var response = {
                      statusCode: 302,
                      statusDescription: 'Found',
                      headers:
                          { "location": { "value": "alpha." + request.uri } }
                      }

                  return response;
              }
          }
          return request;
      }
    `),
  })

  stack.addOutputs({ CdnUrl: astroSite.url, Url: astroSite.customDomainUrl })

  return { astroSite }
}
