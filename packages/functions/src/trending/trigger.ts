import { ApiHandler } from 'sst/node/api'
import { Job } from 'sst/node/job'

export const hourly = ApiHandler(async () => {
  await Job.trending.run({ payload: { interval: 'hourly' } })
})

export const daily = ApiHandler(async () => {
  await Job.trending.run({ payload: { interval: 'daily' } })
})
