import sharp from "sharp"
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { Readable } from "stream"
import { Config } from "sst/node/config"
import { Bucket } from "sst/node/bucket"
import { streamifyResponse, ResponseStream } from "lambda-stream"
import { promisify } from "util"
import { pipeline as _pipeline } from "stream"
import { APIGatewayProxyEventV2 } from "aws-lambda"
const pipeline = promisify(_pipeline)

const s3 = new S3Client({
  region: process.env.AWS_REGION,
})

const _handler = async (
  event: APIGatewayProxyEventV2,
  responseStream: ResponseStream
) => {
  // First validate if the request is coming from CloudFront
  if (
    !event.headers["x-origin-secret-header"] ||
    !(event.headers["x-origin-secret-header"] === Config.SECRET_KEY)
  )
    return sendError("Request unauthorized", event)

  // Validate if this is a GET request
  if (
    !event.requestContext ||
    !event.requestContext.http ||
    !(event.requestContext.http.method === "GET")
  )
    return sendError("Only GET method is supported", event)

  // An example of expected path is /images/rio/1.jpeg/format=auto,width=100 or /images/rio/1.jpeg/original where /images/rio/1.jpeg is the path of the original image
  const imagePathArray = event.requestContext.http.path.split("/")
  // get the requested image operations
  const operationsPrefix = imagePathArray.pop() as string
  // get the original image path images/rio/1.jpg
  imagePathArray.shift()
  const originalImagePath = imagePathArray.join("/")

  // timing variable
  let timingLog = "perf "
  let startTime = performance.now()

  // Downloading original image
  let originalImage
  let contentType
  try {
    originalImage = await s3.send(
      new GetObjectCommand({
        Bucket: Config.ORIGINAL_BUCKET_NAME,
        Key: originalImagePath,
      })
    )
    contentType = originalImage.ContentType as string
  } catch (error) {
    return sendError("error downloading original image", error)
  }

  let transformedImage = sharp({ failOn: "none" })
  let stream: Readable | Buffer = originalImage.Body as Readable
  stream.pipe(transformedImage)

  // Get image orientation to rotate if needed
  const metadata = await transformedImage.metadata()

  //  execute the requested operations
  const operationsJSON: Record<string, string> = {}
  const operationsArray = operationsPrefix.split(",")
  operationsArray.forEach((operation) => {
    const operationKV = operation.split("=")
    operationsJSON[operationKV[0]] = operationKV[1]
  })

  timingLog = timingLog + (performance.now() - startTime) + " "
  startTime = performance.now()
  try {
    // check if resizing is requested
    const resizingOptions: sharp.ResizeOptions = {}
    const width = parseInt(operationsJSON["width"] ?? "0")
    const height = parseInt(operationsJSON["height"] ?? "0")
    const originalWidth = metadata.width ?? Number.MAX_VALUE
    const originalHeight = metadata.height ?? Number.MAX_VALUE

    // don't upscale
    if (width && width < originalWidth) resizingOptions.width = width
    if (height && height < originalHeight) resizingOptions.height = height

    if (resizingOptions)
      transformedImage = transformedImage.resize(resizingOptions)

    // check if rotation is needed
    if (metadata.orientation) transformedImage = transformedImage.rotate()

    // check if formatting is requested
    const format = operationsJSON["format"] as
      | keyof sharp.FormatEnum
      | undefined

    if (format) {
      let isLossy = false
      switch (operationsJSON["format"]) {
        case "jpeg":
          contentType = "image/jpeg"
          isLossy = true
          break
        case "svg":
          contentType = "image/svg+xml"
          break
        case "gif":
          contentType = "image/gif"
          break
        case "webp":
          contentType = "image/webp"
          isLossy = true
          break
        case "png":
          contentType = "image/png"
          break
        case "avif":
          contentType = "image/avif"
          isLossy = true
          break
        default:
          contentType = "image/jpeg"
          isLossy = true
      }

      const quality = operationsJSON["quality"]
      if (quality && isLossy) {
        transformedImage = transformedImage.toFormat(format, {
          quality: parseInt(quality),
        })
      } else {
        transformedImage = transformedImage.toFormat(format)
      }
    }

    stream = Readable.from(transformedImage)
  } catch (error) {
    return sendError("error transforming image", error)
  }

  timingLog = timingLog + (performance.now() - startTime) + " "
  startTime = performance.now()

  const cacheControl = "public, max-age=31536000, immutable"

  // upload transformed image back to S3 if required in the architecture
  try {
    await s3.send(
      new PutObjectCommand({
        Body: stream,
        Bucket: Bucket["transformed-image-bucket"].bucketName,
        Key: originalImagePath + "/" + operationsPrefix,
        ContentType: contentType,
        CacheControl: cacheControl,
      })
    )
  } catch (error) {
    sendError("Could not upload transformed image to S3", error)
  }

  timingLog = timingLog + (performance.now() - startTime) + " "
  console.log(timingLog)

  responseStream.setContentType(contentType)

  // stream transformed image
  await pipeline(stream, responseStream)
}

export const handler = streamifyResponse(_handler)

function sendError(message: string, error: unknown) {
  console.log("APPLICATION ERROR", message)
  console.log(error)
  throw error
}
