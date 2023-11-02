import type { SSTConfig } from 'sst'
import { API } from './stacks/api'
import { Web } from './stacks/web'
import { DNS } from './stacks/dns'
import { Imports } from './stacks/imports'
import { Secrets } from './stacks/secrets'
import { Auth } from './stacks/auth'
import { AnalyticsProxy } from './stacks/analytics-proxy'

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
    })

    app
      .stack(Imports)
      .stack(Secrets)
      .stack(DNS)
      .stack(API)
      .stack(Auth)
      .stack(AnalyticsProxy)
      .stack(Web)
  },
} satisfies SSTConfig
