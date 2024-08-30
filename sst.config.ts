import type { SSTConfig } from 'sst'
import { API } from './stacks/api'
import { Web } from './stacks/web'
import { DNS } from './stacks/dns'
import { Imports } from './stacks/imports'
import { Secrets } from './stacks/secrets'
import { AnalyticsProxy } from './stacks/analytics-proxy'
import { RedirectMoney } from './stacks/redirect'
import { Trending } from './stacks/trending'
import { GameEventBus } from './stacks/game-event-bus'
import { Realtime } from './stacks/realtime'

export default {
  config(_input) {
    return {
      name: 'statmuse',
      region: 'us-east-1',
      profile: 'statmuse',
    }
  },
  stacks(app) {
    app.setDefaultFunctionProps({
      runtime: 'nodejs18.x',
      architecture: 'arm_64',
      tracing: 'disabled',
      insightsVersion: undefined,
      memorySize: '128 MB',
      timeout: '3 seconds',
      prefetchSecrets: true,
    })

    app
      .stack(Imports)
      .stack(Secrets)
      .stack(DNS)
      .stack(API)
      .stack(AnalyticsProxy)
      .stack(RedirectMoney)
      .stack(Trending)
      .stack(Realtime)
      .stack(Web)
      .stack(GameEventBus)
  },
} satisfies SSTConfig
