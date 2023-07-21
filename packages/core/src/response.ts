import { GameraResponse } from "./gamera"
import { KanedamaResponse } from "./kanedama"

export type Response = { source: "gamera" | "kanedama" } & (
  | ({
      source: "gamera"
    } & GameraResponse)
  | ({
      source: "kanedama"
    } & KanedamaResponse)
)
