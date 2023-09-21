import { SSTConfig } from 'sst'
import { API } from './stacks/api'
import { Web } from './stacks/web'
import { DNS } from './stacks/dns'
import { ImageOptimization } from './stacks/img'
import { Imports } from './stacks/imports'
import { Secrets } from './stacks/secrets'
import { Auth } from './stacks/auth'

export default {
  config(_input) {
    return {
      name: 'statmuse',
      region: 'us-east-1',
      profile: 'statmuse',
    }
  },
  stacks(app) {
    app
      .stack(Imports)
      .stack(Secrets)
      .stack(DNS)
      .stack(API)
      .stack(Auth)
      .stack(Web)
      .stack(ImageOptimization)
  },
} satisfies SSTConfig
