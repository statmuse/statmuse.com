import { StackContext, use } from 'sst/constructs'
import {
  Distribution,
  OriginProtocolPolicy,
  ViewerProtocolPolicy,
  AllowedMethods,
} from 'aws-cdk-lib/aws-cloudfront'
import { HttpOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53'
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets'
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager'
import { DNS } from './dns'

export function AnalyticsProxy({ stack }: StackContext) {
  const { hostedZone, domain } = use(DNS)

  if (stack.stage === 'staging' || stack.stage === 'production') {
    const cdnDomain = `analytics.cdn.${domain}`

    const cdnCert = new Certificate(stack, 'analytics-cdn-proxy-cert', {
      domainName: cdnDomain,
      validation: CertificateValidation.fromDns(hostedZone),
    })

    const cdnDistribution = new Distribution(stack, 'analytics-cdn-proxy', {
      defaultBehavior: {
        origin: new HttpOrigin('cdn.segment.com', {
          protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
        }),
        allowedMethods: AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [cdnDomain],
      certificate: cdnCert,
    })

    const cdnARecord = new ARecord(stack, 'analytics-cdn-proxy-arecord', {
      zone: hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(cdnDistribution)),
      recordName: cdnDomain,
    })

    const apiDomain = `analytics.api.${domain}`

    const apiCert = new Certificate(stack, 'analytics-api-proxy-cert', {
      domainName: apiDomain,
      validation: CertificateValidation.fromDns(hostedZone),
    })

    const apiDistribution = new Distribution(stack, 'analytics-api-proxy', {
      defaultBehavior: {
        origin: new HttpOrigin('api.segment.io', {
          protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
        }),
        allowedMethods: AllowedMethods.ALLOW_ALL,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [apiDomain],
      certificate: apiCert,
    })

    const apiARecord = new ARecord(stack, 'analytics-api-proxy-arecord', {
      zone: hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(apiDistribution)),
      recordName: apiDomain,
    })

    stack.addOutputs({
      cdnUrl: 'https://' + cdnARecord.domainName,
      apiUrl: 'https://' + apiARecord.domainName,
    })

    return {
      cdnUrl: 'https://' + cdnARecord.domainName,
      apiUrl: 'https://' + apiARecord.domainName,
    }
  }

  return {
    cdnUrl: 'https://cdn.segment.com',
    apiUrl: 'https://api.segment.io',
  }
}
