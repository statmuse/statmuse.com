import { Config } from 'sst/node/config'

interface IotAuthorizerEvent {
  connectionMetadata: {
    id: string
  }
  signatureVerified: boolean
  protocols: string[]
  protocolData: {
    tls: {
      serverName: string
    }
    mqtt: {
      username: string
      password: string
      clientId: string
    }
    http: {
      headers: Record<string, string>
      queryString: string
    }
  }
}

interface IotAuthorizerResponse {}

export async function handler(
  event: IotAuthorizerEvent,
): Promise<IotAuthorizerResponse> {
  // const tokens = Buffer.from(event.protocolData.mqtt.password, 'base64')

  // do something with the tokens

  const policy = {
    isAuthenticated: true, //A Boolean that determines whether client can connect.
    principalId: Date.now().toString(), //A string that identifies the connection in logs.
    disconnectAfterInSeconds: 86400,
    refreshAfterInSeconds: 300,
    policyDocuments: [
      {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'iot:Connect',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
      {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'iot:Receive',
            Effect: 'Allow',
            Resource: `arn:aws:iot:us-east-1:${process.env.ACCOUNT}:topic/${Config.APP}/${Config.STAGE}/mlb/game/*`,
          },
          {
            Action: 'iot:Subscribe',
            Effect: 'Allow',
            Resource: `arn:aws:iot:us-east-1:${process.env.ACCOUNT}:topicfilter/${Config.APP}/${Config.STAGE}/mlb/game/*`,
          },
        ],
      },
    ],
  }

  return policy
}
