import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  type InvokeModelCommandInput,
} from '@aws-sdk/client-bedrock-runtime'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'
import type { GameraDomain } from '@statmuse/core/gamera'
import { Table } from 'sst/node/table'

const client = new BedrockRuntimeClient({
  region: 'us-east-1',
})

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}), {
  marshallOptions: { removeUndefinedValues: true },
})

export type Clarification = {
  query: string
  domain: GameraDomain | 'money' | 'unknown'
  lang: string
  dir: 'ltr' | 'rtl'
}

export async function clarify(query: string) {
  console.log('clarify', query)

  const cached = await db.send(
    new GetCommand({
      TableName: Table['bedrock-cache'].tableName,
      Key: { query },
    }),
  )

  if (cached.Item) {
    console.log('cached', cached)

    await db.send(
      new UpdateCommand({
        TableName: Table['bedrock-cache'].tableName,
        Key: { query },
        UpdateExpression: 'SET #updated = :updated ADD #count :one',
        ExpressionAttributeNames: { '#updated': 'updated', '#count': 'count' },
        ExpressionAttributeValues: {
          ':updated': new Date().toISOString(),
          ':one': 1,
        },
      }),
    )

    return {
      ...cached.Item,
      query: cached.Item.corrected,
    } as Clarification
  }

  const content = `
StatMuse is a website that answers sports and finance questions.
We (StatMuse) received the following search and were unable to understand it.
Search: ${query}

First, correct any typos or grammar mistakes. It's important that you don't try to add clarification or modify the search in substanative ways. You should only correct typos and grammar.
Next, determine which of the following classifications apply: NFL, NBA, MLB, NHL, PGA, Premier League (EPL), or Finance (Money).
Finally, return a JSON response with the corrected query (all lowercase), classification ("domain"), the language used as an ISO 639-1 two-digit language code, and a "dir" key that specifies "ltr" or "rtl" depending on the language direction in the following format:
{ "query": "corrected query", "domain": "corrected classification", "lang": "detected language code", "dir": "detected language direction" }

It is critical that your response always contains only the formatted json specified above.

Note: "domain" should be one of "nfl", "nba", "mlb", "nhl", "pga", "epl", "money", or "unknown" if you're unable to understand the search.`.trim()

  const input: InvokeModelCommandInput = {
    body: JSON.stringify({
      max_tokens: 1024,
      // system: 'Today is January 1, 2024. Only respond in Haiku',
      messages: [{ role: 'user', content }],
      anthropic_version: 'bedrock-2023-05-31',
    }),
    contentType: 'application/json',
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0', // 'anthropic.claude-3-sonnet-20240229-v1:0',
  }

  const command = new InvokeModelCommand(input)
  const raw = await client.send(command)
  const completions = JSON.parse(Buffer.from(raw.body).toString()) as {
    id: string
    type: string
    role: string
    content: [{ type: string; text: string }]
    model: string
    stop_reason: string
    stop_sequence: string | null
    usage: { input_tokens: number; output_tokens: number }
  }
  const correction = JSON.parse(completions.content[0].text) as Clarification

  await db.send(
    new PutCommand({
      TableName: Table['bedrock-cache'].tableName,
      Item: {
        ...correction,
        query,
        corrected: correction.query,
        created: new Date().toISOString(),
        count: 1,
      },
    }),
  )

  return correction
}
