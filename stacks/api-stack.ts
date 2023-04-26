import { StackContext, Api, Config, Function } from "sst/constructs"
import { Port, SecurityGroup, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2"
import { Secret } from "aws-cdk-lib/aws-secretsmanager"

export function API({ stack }: StackContext) {
  const vpc = Vpc.fromLookup(stack, "vpc", {
    isDefault: true,
  })

  const secrets = Config.Secret.create(
    stack,
    "STRIPE_SECRET",
    "STRIPE_WEBHOOK_SECRET",
    "STRIPE_PRICE_ID",
    "API_KEY"
  )

  const isDev = stack.stage === "adam"
  const isProd = stack.stage === "production"

  const rdsCredentialsSecret = Secret.fromSecretNameV2(
    stack,
    "rds-credentials-secret",
    isProd ? "mothra-prod-db-astro" : "mothra-stage-db-astro"
  )

  const rdsProxySecurityGroup = SecurityGroup.fromSecurityGroupId(
    stack,
    "rds-proxy-sg",
    isProd ? "sg-0de7a55637720b011" : "sg-071ce3a4bc11c29b1"
  )
  const lambdaSecurityGroup = new SecurityGroup(stack, "lambda-sg", { vpc })

  rdsProxySecurityGroup.addIngressRule(
    lambdaSecurityGroup,
    Port.tcp(5432),
    "allow lambda connection to rds proxy"
  )

  const environment: Record<string, string> = {
    POSTGRES_SECRET_ARN: rdsCredentialsSecret.secretArn,
    POSTGRES_HOST: isProd
      ? "mothra-prod.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com"
      : "mothra-staging.proxy-czmqfqtpf0dx.us-east-1.rds.amazonaws.com",
  }

  if (isDev) {
    environment["POSTGRES_HOST"] = "localhost"
    environment["POSTGRES_PORT"] = "5432"
    environment["POSTGRES_DATABASE"] = "mothra_dev"
    environment["POSTGRES_USER"] = "postgres"
    environment["POSTGRES_PASSWORD"] = "postgres"
  }

  const api = new Api(stack, "api", {
    routes: {
      "POST /checkout": {
        authorizer: "simple",
        function: "packages/functions/src/stripe/checkout.handler",
      },
      "POST /stripe/manage": {
        authorizer: "simple",
        function: "packages/functions/src/stripe/manage.handler",
      },
      "POST /user/delete": {
        authorizer: "simple",
        function: "packages/functions/src/user/delete.handler",
      },
      "POST /stripe/webhooks": "packages/functions/src/stripe/webhooks.handler",
    },
    defaults: {
      function: {
        bind: [
          secrets.STRIPE_SECRET,
          secrets.STRIPE_WEBHOOK_SECRET,
          secrets.STRIPE_PRICE_ID,
        ],
        vpc,
        vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
        securityGroups: [lambdaSecurityGroup],
        environment,
        nodejs: { install: ["pg"] },
      },
    },
    authorizers: {
      simple: {
        type: "lambda",
        function: new Function(stack, "simple-authorizer", {
          handler: "packages/functions/src/authorizer.handler",
          bind: [secrets.API_KEY],
        }),
        resultsCacheTtl: "1 minute",
        responseTypes: ["simple"],
      },
    },
  })

  rdsCredentialsSecret.grantRead(api.getFunction("POST /checkout")!)
  rdsCredentialsSecret.grantRead(api.getFunction("POST /stripe/manage")!)
  rdsCredentialsSecret.grantRead(api.getFunction("POST /stripe/webhooks")!)
  rdsCredentialsSecret.grantRead(api.getFunction("POST /user/delete")!)

  stack.addOutputs({ ApiEndpoint: api.url })
}
