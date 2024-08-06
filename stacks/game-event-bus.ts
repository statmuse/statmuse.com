import { EventBus } from 'sst/constructs'
import type { StackContext } from 'sst/constructs'
import * as eventbus from 'aws-cdk-lib/aws-events'

export function GameEventBus({ stack }: StackContext) {
  const bus = new EventBus(stack, 'game-bus', {
    rules: {
      gameUpdate: {
        pattern: {
          detailType: ['mlb.game', 'mlb.gamePlayByPlay'],
        },
        targets: {
          mlb: 'packages/functions/src/game-event.handler',
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

  return {
    bus,
  }
}
