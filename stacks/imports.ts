import type { StackContext } from 'sst/constructs'
import { Bucket as CdkBucket } from 'aws-cdk-lib/aws-s3'
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'

export function Imports({ stack }: StackContext) {
  // const isStaging = stack.stage === 'staging'
  const isProd = stack.stage === 'production'
  // const isDev = !isStaging && !isProd

  const statmuseProdBucket = CdkBucket.fromBucketAttributes(
    stack,
    'original-bucket',
    {
      bucketArn: 'arn:aws:s3:::statmuse-prod',
      bucketName: 'statmuse-prod',
    },
  )

  const vpc = Vpc.fromLookup(stack, 'vpc', {
    isDefault: true,
  })

  const rdsCredentialsSecret = Secret.fromSecretNameV2(
    stack,
    'rds-credentials-secret',
    isProd ? 'mothra-prod-db-astro' : 'mothra-stage-db-astro',
  )

  const rdsProxySecurityGroup = SecurityGroup.fromSecurityGroupId(
    stack,
    'rds-proxy-sg',
    isProd ? 'sg-0de7a55637720b011' : 'sg-071ce3a4bc11c29b1',
  )

  return {
    statmuseProdBucket,
    vpc,
    rdsCredentialsSecret,
    rdsProxySecurityGroup,
  }
}
