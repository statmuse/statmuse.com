import { StackContext, Config, Function, Bucket, use } from "sst/constructs"
import {
  CachePolicy,
  CacheQueryStringBehavior,
  FunctionCode,
  FunctionEventType,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront"
import { Bucket as CdkBucket } from "aws-cdk-lib/aws-s3"
import { Web } from "./web-stack"
import { CustomResource, Duration, RemovalPolicy } from "aws-cdk-lib/core"
import {
  HttpOrigin,
  OriginGroup,
  S3Origin,
} from "aws-cdk-lib/aws-cloudfront-origins"
import { Function as CfFunction } from "aws-cdk-lib/aws-cloudfront"
import { createHash } from "crypto"

// Region to Origin Shield mapping based on latency. to be updated when new Regional Edge Caches are added to CloudFront.
const ORIGIN_SHIELD_MAPPING = new Map([
  ["af-south-1", "eu-west-2"],
  ["ap-east-1", "ap-northeast-2"],
  ["ap-northeast-1", "ap-northeast-1"],
  ["ap-northeast-2", "ap-northeast-2"],
  ["ap-northeast-3", "ap-northeast-1"],
  ["ap-south-1", "ap-south-1"],
  ["ap-southeast-1", "ap-southeast-1"],
  ["ap-southeast-2", "ap-southeast-2"],
  ["ca-central-1", "us-east-1"],
  ["eu-central-1", "eu-central-1"],
  ["eu-north-1", "eu-central-1"],
  ["eu-south-1", "eu-central-1"],
  ["eu-west-1", "eu-west-1"],
  ["eu-west-2", "eu-west-2"],
  ["eu-west-3", "eu-west-2"],
  ["me-south-1", "ap-south-1"],
  ["sa-east-1", "sa-east-1"],
  ["us-east-1", "us-east-1"],
  ["us-east-2", "us-east-2"],
  ["us-west-1", "us-west-1"],
  ["us-west-2", "us-west-2"],
])

const CLOUDFRONT_ORIGIN_SHIELD_REGION = ORIGIN_SHIELD_MAPPING.get(
  process.env.AWS_REGION || process.env.CDK_DEFAULT_REGION || "us-east-1"
)

export function ImageOptimization({ stack }: StackContext) {
  const { astroSite } = use(Web)

  const SECRET_KEY = new Config.Parameter(stack, "SECRET_KEY", {
    value: createHash("md5").update(stack.node.addr).digest("hex"),
  })

  const originalImageBucket = CdkBucket.fromBucketAttributes(
    stack,
    "original-bucket",
    {
      bucketArn: "arn:aws:s3:::statmuse-prod",
      bucketName: "statmuse-prod",
    }
  )

  const ORIGINAL_BUCKET_NAME = new Config.Parameter(
    stack,
    "ORIGINAL_BUCKET_NAME",
    { value: originalImageBucket.bucketName }
  )

  const transformedImageBucket = new Bucket(stack, "transformed-image-bucket", {
    cdk: {
      bucket: {
        removalPolicy: RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        lifecycleRules: [{ expiration: Duration.days(90) }],
      },
    },
  })

  const imageProcessingFunction = new Function(stack, "image-processing", {
    handler: "packages/functions/src/image/processing.handler",
    runtime: "nodejs18.x",
    timeout: "60 seconds",
    memorySize: 1500,
    logRetention: "one_day",
    bind: [transformedImageBucket, ORIGINAL_BUCKET_NAME, SECRET_KEY],
    permissions: [[originalImageBucket, "grantRead"], transformedImageBucket],
    layers: [
      new LayerVersion(stack, "sharp-layer", {
        code: Code.fromAsset("layers/sharp"),
      }),
    ],
    nodejs: { esbuild: { external: ["sharp"] } },
  })

  const { url } = imageProcessingFunction.addFunctionUrl({
    authType: FunctionUrlAuthType.NONE,
    cors: {
      // allowCredentials: cors.allowCredentials,
      allowedHeaders: ["*"],
      allowedMethods: [HttpMethod.ALL],
      allowedOrigins: ["*"],
      // exposedHeaders: cors.exposeHeaders,
      // maxAge: cors.maxAge && toCdkDuration(cors.maxAge),
    },
    invokeMode: InvokeMode.RESPONSE_STREAM,
  })

  const imageProcessingHelper = new LambdaFunctionUrlHelper(
    stack,
    "image-processing-url",
    { Url: url }
  )

  const imageOrigin = new OriginGroup({
    primaryOrigin: new S3Origin(transformedImageBucket.cdk.bucket, {
      originShieldRegion: CLOUDFRONT_ORIGIN_SHIELD_REGION,
    }),
    fallbackOrigin: new HttpOrigin(imageProcessingHelper.hostname, {
      originShieldRegion: CLOUDFRONT_ORIGIN_SHIELD_REGION,
      customHeaders: { "x-origin-secret-header": SECRET_KEY.value },
    }),
    fallbackStatusCodes: [403],
  })

  const urlRewriteFunction = new CfFunction(stack, "url-rewrite-function", {
    code: FunctionCode.fromFile({
      filePath: "packages/functions/src/image/viewer-request.js",
    }),
    functionName: `urlRewriteFunction${stack.node.addr}`,
  })

  const cachePolicy = new CachePolicy(
    stack,
    `ImageCachePolicy${stack.node.addr}`,
    {
      defaultTtl: Duration.hours(24),
      maxTtl: Duration.days(365),
      minTtl: Duration.seconds(0),
      queryStringBehavior: CacheQueryStringBehavior.all(),
    }
  )

  const responseHeadersPolicy = new ResponseHeadersPolicy(
    stack,
    `ResponseHeadersPolicy${stack.node.addr}`,
    {
      corsBehavior: {
        accessControlAllowCredentials: false,
        accessControlAllowHeaders: ["*"],
        accessControlAllowMethods: ["GET"],
        accessControlAllowOrigins: ["*"],
        accessControlMaxAge: Duration.seconds(600),
        originOverride: false,
      },
      // recognizing image requests that were processed by this solution
      customHeadersBehavior: {
        customHeaders: [
          {
            header: "x-aws-image-optimization",
            value: "v1.0",
            override: true,
          },
          { header: "vary", value: "accept", override: true },
          {
            header: "Cache-Control",
            value: "public, max-age=31536000, immutable",
            override: true,
          },
        ],
      },
    }
  )

  const params = {
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    cachePolicy,
    functionAssociations: [
      {
        eventType: FunctionEventType.VIEWER_REQUEST,
        function: urlRewriteFunction,
      },
    ],
    responseHeadersPolicy,
  }

  astroSite.cdk?.distribution.addBehavior("img/*", imageOrigin, params)
  astroSite.cdk?.distribution.addBehavior(
    "app/media/*.jpg",
    imageOrigin,
    params
  )
  astroSite.cdk?.distribution.addBehavior(
    "app/media/*.jpeg",
    imageOrigin,
    params
  )
  astroSite.cdk?.distribution.addBehavior(
    "app/media/*.png",
    imageOrigin,
    params
  )
  astroSite.cdk?.distribution.addBehavior(
    "finance/asset_img/*",
    imageOrigin,
    params
  )

  return {}
}

import { Construct } from "constructs"
import {
  Code,
  FunctionUrlAuthType,
  HttpMethod,
  InvokeMode,
  LayerVersion,
  Runtime,
  SingletonFunction,
} from "aws-cdk-lib/aws-lambda"
import { RetentionDays } from "aws-cdk-lib/aws-logs"
import { Provider } from "aws-cdk-lib/custom-resources"

const customResourceHandler = `
import urllib.parse

def on_event(event, context):
  print(event)
  request_type = event['RequestType']
  if request_type == 'Create': return on_create(event)
  if request_type == 'Update': return on_update(event)
  if request_type == 'Delete': return on_delete(event)
  raise Exception("Invalid request type: %s" % request_type)

def on_create(event):
  props = event["ResourceProperties"]
  print("create new resource with props %s" % props)

  url = event['ResourceProperties']['Url']
  parsed_url = urllib.parse.urlparse(url)
  attributes = {
      'HostName': parsed_url.netloc
  }
  return { 'Data': attributes }

def on_update(event):
  physical_id = event["PhysicalResourceId"]
  props = event["ResourceProperties"]
  print("update resource %s with props %s" % (physical_id, props))
  # ...

  return { 'PhysicalResourceId': physical_id }

def on_delete(event):
  physical_id = event["PhysicalResourceId"]
  print("delete resource %s" % physical_id)
  # ...

  return { 'PhysicalResourceId': physical_id }

def is_complete(event, context):
  physical_id = event["PhysicalResourceId"]
  request_type = event["RequestType"]

  # check if resource is stable based on request_type
  # is_ready = ...

  return { 'IsComplete': True }
`

export class LambdaFunctionUrlHelper extends Construct {
  public readonly hostname: string

  constructor(scope: Construct, id: string, props: { Url: string }) {
    super(scope, id)

    const onEvent = new SingletonFunction(this, "Singleton", {
      uuid: "f7d4f730-4ee1-11e8-9c2d-fa7ae01bbebc",
      code: Code.fromInline(customResourceHandler),
      handler: "index.on_event",
      timeout: Duration.seconds(300),
      runtime: Runtime.PYTHON_3_9,
      logRetention: RetentionDays.ONE_DAY,
    })

    const myProvider = new Provider(
      this,
      "lambda-function-url-helper-provider",
      {
        onEventHandler: onEvent,
        logRetention: RetentionDays.ONE_DAY,
      }
    )

    const resource = new CustomResource(this, "lambda-function-url-helper", {
      serviceToken: myProvider.serviceToken,
      properties: props,
    })

    this.hostname = resource.getAtt("HostName").toString()
  }
}
