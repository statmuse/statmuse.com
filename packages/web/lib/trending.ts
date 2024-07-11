import { Table } from 'sst/node/table'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { QueryCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import type { TrendingItem } from 'src/types'

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
})

// console.log('dynamo table name: ', Table['imported-table'].tableName)

export const getTrendingData = async (props?: {
  league?: string
  timeframe?: string
  country?: string
}) => {
  const league = props?.league ?? 'ALL'
  const timeframe = props?.timeframe
  const country = props?.country

  const pk = `${league.toUpperCase()}#${timeframe ?? 'LAST_24_HOURS'}#${
    country ?? 'GLOBAL'
  }`

  const data = await db.send(
    new QueryCommand({
      TableName: Table['imported-table'].tableName,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: { ':pk': pk },
      ScanIndexForward: false,
      Limit: 1,
    }),
  )

  const items = data.Items as TrendingItem[] | undefined
  const [item] = items ?? []
  return item
}
