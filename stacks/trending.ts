import { SubnetType } from 'aws-cdk-lib/aws-ec2'
import { Job, use, type StackContext, Cron, Table } from 'sst/constructs'
import { Imports } from './imports'
import { API } from './api'
import { Secrets } from './secrets'

export function Trending({ stack }: StackContext) {
  const isProd = stack.stage === 'production'
  const { vpc, rdsCredentialsSecret } = use(Imports)
  const { lambdaSecurityGroup, environment } = use(API)
  const secrets = use(Secrets)

  const table = new Table(stack, 'trending-table', {
    primaryIndex: { partitionKey: 'pk', sortKey: 'sk' },
    fields: {
      pk: 'string',
      sk: 'string',
    },
  })

  if (isProd || stack.stage === 'adam') {
    const job = new Job(stack, 'trending', {
      architecture: 'arm_64',
      runtime: 'nodejs18.x',
      handler: 'packages/functions/src/trending/index.handler',
      memorySize: '15 GB',
      bind: [secrets.GAMERA_API_KEY, table],
      cdk: {
        vpc,
        vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        securityGroups: [lambdaSecurityGroup],
      },
      environment,
      nodejs: { install: ['pg'], esbuild: { external: ['pg-native'] } },
      permissions: ['athena', 's3', 'glue', 'secretsmanager'],
    })

    const hourly = new Cron(stack, 'hourly', {
      schedule: 'rate(1 hour)',
      job: 'packages/functions/src/trending/trigger.hourly',
    })
    const daily = new Cron(stack, 'daily', {
      schedule: 'rate(1 day)',
      job: 'packages/functions/src/trending/trigger.daily',
    })

    hourly.bind([job])
    daily.bind([job])

    rdsCredentialsSecret.grantRead(job.cdk.codeBuildProject)
  }

  return { table }
}
