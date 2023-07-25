export const cdnBaseUrl = ""

export function handleResponse(response: KanedamaResponse) {
  const subject = response.visual.summary.subject
  const conversationToken = response.conversation.token

  if (response.type === "nlgPromptForMoreInfoVisualChoicesOptional") {
    return { subject, conversationToken }
  }
  const entity = response.visual.summary.answer.find((t) => t.type === "entity")

  let redirectUrl = ""
  const assetEntityData = response.visual.detail?.find(
    (d) => d.type === "assetEntityData"
  ) as AssetEntityData | undefined
  if (assetEntityData && entity?.type === "entity") {
    const symbol = entity.entity.id.toLowerCase()
    redirectUrl = `/money/symbol/${symbol}`
  }

  return {
    subject,
    redirectUrl,
    conversationToken,
  }
}

export type KanedamaToken = {
  text: string
  omitLeadingSpace: boolean
} & (
  | {
      type: "general"
    }
  | {
      type: "entity"
      entity: KanedamaEntity
    }
)

export type KanedamaEntity = {
  display: string
  type: "assetProfile"
  id: string
}

export interface KanedamaGrid {
  name: string
  columns: [
    {
      rowItemKey: string
      title: string
      type: string
    }
  ]
  rows: Record<
    string,
    {
      display: string
      value: unknown
      imageUrl?: string
      entity?: KanedamaEntity
    }
  >[]
  aggregations: Record<
    string,
    {
      display: string
      value: unknown
      imageUrl?: string
      entity?: KanedamaEntity
    }
  >[]
}

export interface KanedamaChart {
  name: string
  series: [
    {
      name: string
      data: [
        {
          nameLines: [string]
          y: number
          label: string
          color: string
          series?: string
          float?: boolean
        }
      ]
      color: string
    }
  ]
  categories: [
    {
      nameLines: [string]
    }
  ]
}

export interface Nlg {
  text: Text
  ssml?: {
    answer: string
    promptConversational: string
    repromptConversational: string
  }
}

export interface Text {
  answer: KanedamaToken[]
  promptConversational: string
}

export interface Subject {
  actor: Actor
  imageUrl: string
  colors: Colors
  entities: KanedamaEntity[]
}

export interface Colors {
  foreground: string
  background: string
}

export interface Actor {
  year?: number
  ids: {
    id: string
    type: string
  }[]
}

export interface Narrator {
  introAudioUrl: string
  answerWithIntroAudioUrl: string
  answerAudioUrl: string
  imageUrl: string
  actorId: string
}

export interface Summary {
  answer: KanedamaToken[]
  subject: Subject
  narrator: Narrator
  text: Text[]
}

export interface AdditionalQuestion {
  domain: string
  text: string
}

export interface DetailBase {
  type: "genericGrids" | "charts" | "assetPriceData" | "assetEntityData"
}

export interface AssetPriceDataDetail extends DetailBase {
  type: "assetPriceData"
  assetPriceData: {
    assetPairs: [
      {
        baseAssetId: string
        quoteAssetId: string
      }
    ]
  }
}

export interface AssetEntityData extends DetailBase {
  type: "assetEntityData"
  assetEntity: {
    ids: {
      id: string
      type: string
    }[]
  }
}

export interface KanedamaGenericGridsDetail extends DetailBase {
  type: "genericGrids"
  grids: KanedamaGrid[]
}

export interface Visual {
  summary: Summary
  summaryTokens: KanedamaToken[]
  isSuperlative: boolean
  additionalQuestions?: AdditionalQuestion[]
  detail?: Detail[]
  disclaimers?: [string]
}

export type Detail =
  | AssetEntityData
  | AssetPriceDataDetail
  | KanedamaGenericGridsDetail

export interface Conversation {
  token: string
  complete: boolean
}

export interface Disposition {
  responseType: string
  resultsType: string
  intent: string
}

export interface TokenizationScore {
  max: number
  median: number
  average: number
}

export interface KanedamaResponseBase {
  conversation: Conversation
  disposition: Disposition
  tokenizationScore: TokenizationScore
}

export interface KanedamaDefaultResponse extends KanedamaResponseBase {
  type:
    | "fullNlgAnswerVisualsOptional"
    | "nlgAnswerNotPossibleVisualsRequired"
    | "error"
  visual: Visual
  nlg: Nlg
}

export interface KanedamaChoicesResponse extends KanedamaResponseBase {
  type: "nlgPromptForMoreInfoVisualChoicesOptional"
  visual: ChoicesVisual
  nlg: ChoicesNlg
}

export interface ChoicesVisual
  extends Omit<
    Visual,
    | "domain"
    | "detail"
    | "disclaimers"
    | "additionalQuestions"
    | "isSuperlative"
  > {
  choices: [
    {
      display: string
      assetId: string
      input: string
    }
  ]
}

export interface ChoicesNlg {
  text: {
    promptForMoreInfo: string
  }
  ssml: {
    promptForMoreInfo: string
    repromptForMoreInfo: string
  }
}

export type KanedamaResponse = KanedamaDefaultResponse | KanedamaChoicesResponse
