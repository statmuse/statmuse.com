import { EventBus, use } from 'sst/constructs'
import type { StackContext } from 'sst/constructs'
import * as eventbus from 'aws-cdk-lib/aws-events'
import { API } from './api'
import { Secrets } from './secrets'

export function GameEventBus({ stack }: StackContext) {
  const api = use(API)
  const secrets = use(Secrets)

  const bus = new EventBus(stack, 'game-bus', {
    defaults: {
      function: {
        bind: [secrets.GAMERA_API_KEY],
        permissions: ['iot'],
        environment: {
          GAMERA_API_URL: api.environment.GAMERA_API_URL,
        },
      },
    },
    cdk: {
      eventBus: eventbus.EventBus.fromEventBusName(
        stack,
        'imported-game-bus',
        'nlp-gamera',
      ),
    },
  })

  bus.addRules(stack, {
    gameUpdate: {
      pattern: {
        detailType: ['mlb.game', 'mlb.gamePlayByPlay'],
        detail: {
          oldGameData: { gameStatus: ['scheduled', 'inProgress'] },
          newGameData: { gameStatus: ['inProgress', 'completed'] },
        },
      },
      targets: {
        mlb: 'packages/functions/src/game-event/mlb.handler',
      },
    },
  })

  return {
    bus,
  }
}
