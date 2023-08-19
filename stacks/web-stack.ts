import { StackContext, AstroSite, use } from 'sst/constructs'
import { SubnetType } from 'aws-cdk-lib/aws-ec2'
import { API } from './api-stack'
import { DNS } from './dns-stack'
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { Imports } from './imports-stack'
import {
  AllowedMethods,
  CachePolicy,
  CachedMethods,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'

export function Web({ stack }: StackContext) {
  const dns = use(DNS)
  const api = use(API)
  const imports = use(Imports)

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

  const astroSite = new AstroSite(stack, 'astro-site', {
    path: 'packages/web',
    bind: [
      api.api,
      api.secrets.STRIPE_SECRET,
      api.secrets.STRIPE_WEBHOOK_SECRET,
      api.secrets.STRIPE_PRICE_ID,
    ],
    environment: api.environment,
    nodejs: { install: ['pg'] },
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

  stack.addOutputs({ CdnUrl: astroSite.url, Url: astroSite.customDomainUrl })

  return { astroSite }
}
