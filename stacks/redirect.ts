import { type StackContext, use } from 'sst/constructs'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as cert from 'aws-cdk-lib/aws-certificatemanager'
import * as cdk from 'aws-cdk-lib/core'
import * as s3 from 'aws-cdk-lib/aws-s3'
import { ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53'
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets'
import { DNS } from './dns'

export function RedirectMoney({ stack }: StackContext) {
  const { hostedZone, domain } = use(DNS)

  if (stack.stage === 'staging' || stack.stage === 'production') {
    // Define the Lambda@Edge function for redirection
    const redirectFunction = new lambda.Function(
      stack,
      'money-redirect-function',
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: 'index.handler',
        code: lambda.Code.fromInline(`
      'use strict';
      exports.handler = (event, context, callback) => {
        const response = {
          status: '302',
          statusDescription: 'Found',
          headers: {
            location: [{
              key: 'Location',
              value: 'https://www.statmuse.com/money',
            }],
          },
        };
        callback(null, response);
      };
      `),
      },
    )

    const cfDomain =
      stack.stage === 'production' ? 'money.statmuse.com' : `money.${domain}`

    const cfCert = new cert.Certificate(stack, 'money-cf-cert', {
      domainName: cfDomain,
      validation: cert.CertificateValidation.fromDns(hostedZone),
    })

    const emptyBucket = new s3.Bucket(stack, 'money-redirect-bucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    })

    // Associate the Lambda function with CloudFront distribution
    const distribution = new cloudfront.Distribution(
      stack,
      'money-distribution',
      {
        defaultBehavior: {
          origin: new origins.S3Origin(emptyBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          edgeLambdas: [
            {
              functionVersion: redirectFunction.currentVersion,
              eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
            },
          ],
        },
        domainNames: [cfDomain],
        certificate: cfCert,
      },
    )

    const aRecord = new ARecord(stack, 'money-redirect-arecord', {
      zone: hostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      recordName: cfDomain,
    })
  }
}
