import { ApiHandler, useQueryParam } from "sst/node/api"
import { autosuggest } from "@statmuse/core/elastic"

export const handler = ApiHandler(async (_evt) => {
  const query = useQueryParam("query") as string
  const league = useQueryParam("league")

  console.log(league)

  const suggestions = await autosuggest(query, league)

  return {
    statusCode: 200,
    body: JSON.stringify({
      suggestions,
      timestamp: new Date().toISOString(),
    }),
  }
})
