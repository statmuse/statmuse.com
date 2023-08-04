import { SSTConfig } from 'sst'
import { API } from './stacks/api-stack'
import { Web } from './stacks/web-stack'
import { DNS } from './stacks/dns-stack'
import { ImageOptimization } from './stacks/img-stack'
import { Imports } from './stacks/imports-stack'

export default {
  config(_input) {
    return {
      name: 'statmuse',
      region: 'us-east-1',
      profile: 'statmuse',
    }
  },
  stacks(app) {
    app.stack(Imports).stack(DNS).stack(API).stack(Web).stack(ImageOptimization)
  },
} satisfies SSTConfig
