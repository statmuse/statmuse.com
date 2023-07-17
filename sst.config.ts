import { SSTConfig } from "sst"
import { API } from "./stacks/api-stack"
import { Web } from "./stacks/web-stack"

export default {
  config(_input) {
    return {
      name: "statmuse",
      region: "us-east-1",
      profile: "statmuse",
    }
  },
  stacks(app) {
    app.stack(API).stack(Web)
  },
} satisfies SSTConfig
