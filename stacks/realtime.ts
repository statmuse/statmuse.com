import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam'
import { CfnAuthorizer } from 'aws-cdk-lib/aws-iot'
import { Function } from 'sst/constructs'
import type { StackContext } from 'sst/constructs'
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  type AwsSdkCall,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources'

export function Realtime(ctx: StackContext) {
  const authorizerFn = new Function(ctx.stack, 'authorizer-fn', {
    handler: 'packages/functions/src/auth-iot.handler',
    permissions: ['iot'],
    environment: {
      ACCOUNT: ctx.app.account,
    },
  })

  const authorizer = new CfnAuthorizer(ctx.stack, 'authorizer', {
    status: 'ACTIVE',
    authorizerName: ctx.app.logicalPrefixedName('authorizer'),
    authorizerFunctionArn: authorizerFn.functionArn,
    signingDisabled: true,
  })

  authorizerFn.addPermission('IOTPermission', {
    principal: new ServicePrincipal('iot.amazonaws.com'),
    sourceArn: authorizer.attrArn,
    action: 'lambda:InvokeFunction',
  })

  const describeEndpointRole = new Role(ctx.stack, 'LambdaRole', {
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
  })

  describeEndpointRole.addManagedPolicy(
    ManagedPolicy.fromAwsManagedPolicyName(
      'service-role/AWSLambdaBasicExecutionRole',
    ),
  )

  describeEndpointRole.addToPolicy(
    new PolicyStatement({
      resources: ['*'],
      actions: ['iot:DescribeEndpoint'],
    }),
  )

  const describeEndpointSdkCall: AwsSdkCall = {
    service: 'Iot',
    action: 'describeEndpoint',
    parameters: {
      endpointType: 'iot:Data-ATS',
    },
    region: ctx.stack.region,
    physicalResourceId: PhysicalResourceId.of('IoTEndpointDescription'),
  }

  const describeEndpointResource = new AwsCustomResource(
    ctx.stack,
    'Resource',
    {
      onCreate: describeEndpointSdkCall,
      onUpdate: describeEndpointSdkCall,
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
      role: describeEndpointRole,
    },
  )

  return {
    endpointAddress:
      describeEndpointResource.getResponseField('endpointAddress'),
  }
}
