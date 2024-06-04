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
