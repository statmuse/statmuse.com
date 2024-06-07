import { createSigner, createVerifier } from 'fast-jwt'
import { Config } from 'sst/node/config'

const sign = createSigner({ key: Config.JWT_SECRET })
const verify = createVerifier({ key: Config.JWT_SECRET })

export const createSessionBuilder = <
  SessionTypes extends Record<string, any> = {},
>() => {
  return {
    create<
      T extends (
        | {
            [type in keyof SessionTypes]: {
              type: type
              properties: SessionTypes[type]
            }
          }[keyof SessionTypes]
        | {
            type: 'public'
            properties: {}
          }
      )['type'],
    >(type: T, properties: SessionTypes[T]): string {
      return sign({ type, properties })
    },
    verify(token: string):
      | {
          [type in keyof SessionTypes]: {
            type: type
            properties: SessionTypes[type]
          }
        }[keyof SessionTypes]
      | {
          type: 'public'
          properties: {}
        } {
      try {
        return verify(token)
      } catch (_e) {
        return {
          type: 'public',
          properties: {},
        }
      }
    },
  }
}

const legacyPublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4c4MZK8e6Ug0C11Q0Pe7
8+aMoQRq7stxpMRt75oTazcuhfbSaZKYWMnYZQ0ZzNYsX/gsHOqcmQlzb0jV6D6r
vTsA+thE2jkH4XvVS8lQ0SuaMU4i6HCjfKqRBLDuptjQW1gvF1tN1uR3JMspu6+W
n5/lsahdXxLbEk1ydwDv9I3rCFJ9HOt616C7e1QpHkpHLZ6Ow+H12hUv4Hr3EvAG
97FqsU04/G+M1dUE1sRqleBZNViOZyv7R1TKPqCHkHBNrA9nDxEktPVqygYhwEPq
DNp+MNLvRdMZLnTBUGyjgzJ+pVXWak0xHzL8aenoEfvxCIxFvykW8lgLIKsBSl5H
7wIDAQAB
-----END PUBLIC KEY-----`

const verifyLegacy = createVerifier({
  key: legacyPublicKey,
  algorithms: ['RS512'],
})

export const verifyLegacySession = (token: string) => verifyLegacy(token)
