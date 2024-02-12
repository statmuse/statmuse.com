import type { GameraGrid } from './gamera'

export const cdnBaseUrl = 'https://cdn.statmuse.com'
export type KanedamaGrid = GameraGrid

export type KanedamaChartBase = {
  name: string
  type: 'categoricalColumn' | 'timeSeriesLine'
}

export type KanedamaCategoricalColumnChart = KanedamaChartBase & {
  type: 'categoricalColumn'
  series: [
    {
      name: string
      data: {
        y: number
        label: string
        nameLines: string[]
        color: string
      }[]
    },
  ]
  categories: {
    nameLines: string[]
  }[]
}

export type KanedamaTimeSeriesLineChart = KanedamaChartBase & {
  type: 'timeSeriesLine'
  series: [
    {
      name: string
      data: {
        timestamp: string
        y: number
        label: string
      }[]
    },
  ]
}

export type KanedamaChart =
  | KanedamaCategoricalColumnChart
  | KanedamaTimeSeriesLineChart

export function handleResponse(response: KanedamaResponse) {
  const subject = response.visual.summary.subject
  const conversationToken = response.conversation.token

  if (response.type === 'nlgPromptForMoreInfoVisualChoicesOptional') {
    return { subject, conversationToken }
  }
  const entity = response.visual.summary.answer.find((t) => t.type === 'entity')

  let redirectUrl = ''
  const assetEntityData = response.visual.detail?.find(
    (d) => d.type === 'assetEntityData',
  ) as AssetEntityData | undefined
  if (assetEntityData && entity?.type === 'entity') {
    const symbol = entity.entity.id.toLowerCase()
    redirectUrl = `/money/symbol/${symbol}`
  }

  return {
    subject,
    redirectUrl,
    conversationToken,
  }
}

export function handleAskResponse(response: KanedamaResponse) {
  const query = tokensToText(
    response.visual.summaryTokens.filter((t) => t.type !== 'inferred'),
  ).toLowerCase()

  if (response.type === 'nlgPromptForMoreInfoVisualChoicesOptional') {
    return { query }
  }
  const entity = response.visual.summary.answer.find((t) => t.type === 'entity')
  const assetEntityData = response.visual.detail?.find(
    (d) => d.type === 'assetEntityData',
  ) as AssetEntityData | undefined

  if (assetEntityData && entity?.type === 'entity') {
    return {
      query,
      type: assetEntityData.type,
      symbol: entity.entity.id.toLowerCase(),
    }
  }

  return {
    query,
  }
}

export const tokensToHtml = (tokens: KanedamaToken[]) => {
  return tokens.map(formatToken).join('').trim()
}

export const tokensToText = (tokens: KanedamaToken[]) => {
  return tokens.map(formatTokenTextOnly).join('').trim()
}

export const getUrlForEntity = (entity: KanedamaEntity) => {
  const { type, id } = entity
  let url = ''

  switch (type) {
    case 'assetProfile':
      const symbol = id.toLowerCase()
      url = `/money/symbol/${symbol}`
      break
    case 'btcBlock':
      break
    default:
      throw new Error('Unknown entity type: ' + type)
  }

  return url
}

const formatToken = (token: KanedamaToken) => {
  let text = token.text
  if (token.type === 'entity') {
    const url = getUrlForEntity(token.entity)
    if (url) {
      text =
        text === token.entity?.display
          ? `<a href="${url}">${text}</a>`
          : `<a href="${url}" title="${token.entity.display}">${text}</a>`
    }
  }

  // if (token.type === 'inferred') {
  //   text = `<span class="visual-inferred-token">${text}</span>`
  // }

  return token.omitLeadingSpace ? text : ' ' + text
}

const formatTokenTextOnly = (token: KanedamaToken) => {
  const text = token.text
  return token.omitLeadingSpace ? text : ' ' + text
}

export type KanedamaToken = {
  text: string
  omitLeadingSpace: boolean
} & (
  | {
      type: 'general'
    }
  | {
      type: 'inferred'
    }
  | {
      type: 'entity'
      entity: KanedamaEntity
    }
)

export type KanedamaEntity = {
  display: string
  type: 'assetProfile' | 'btcBlock'
  id: string
}

export interface AssetBySymbolResponse {
  assetId: string
}

export interface AssetProfile {
  asset: {
    assetId: string
    officialName: string
    canonicalName: string
    symbol: string
    exchange: string
    class: string
    type: string
    shouldSyncPrice: boolean
    isActive: boolean
    dataCoverage: {
      minDailyTimestamp: number
      maxDailyTimestamp: number
      minIntradayTimestamp: number
      maxIntradayTimestamp: number
    }
  }
  aliases: { aliasName: string }[]
  stockProfile: {
    overview: {
      stats: KanedamaGrid
      financials: KanedamaGrid
    }
    stats: {
      priceHistory: KanedamaGrid
      shareStats: KanedamaGrid
      shortStats: KanedamaGrid
      valuation: KanedamaGrid
    }
    financials: {
      quarterlyFinancials: KanedamaGrid
      annualFinancials: KanedamaGrid
      earningsCalls: KanedamaGrid
    }
    profile: {
      profile: KanedamaGrid
    }
  }
  images: {
    imageId: string
    imageUrl: string
    colors: {
      colorId: string
      background: string
      foreground: string
    }[]
  }[]
  news: {
    timestamp: string
    title: string
    content: string
    link: string
    relatedAssets: {
      assetId: string
      name: string
      symbol: string
      type: string
    }[]
  }[]
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
  subject?: Subject
  narrator?: Narrator
  text: Text[]
}

export interface AdditionalQuestion {
  domain: string
  text: string
}

export interface DetailBase {
  type: 'genericGrids' | 'charts' | 'assetPriceData' | 'assetEntityData'
}

export type Timeframe = {
  label?: string
  display?: string
  description?: string
  xTooltipDisplay?: string
  timestamp?: string
  endTimestamp?: string
}

export interface AssetPriceDataDetail extends DetailBase {
  type: 'assetPriceData'
  assetPriceData: {
    assetPairs: {
      baseAssetId: string
      quoteAssetId: string
    }[]
    frequency?:
      | 'hour'
      | 'day'
      | 'week'
      | 'month'
      | 'quarter'
      | 'year'
      | 'decade'
    startTimestamp: string
    endTimestamp: string
    renderTarget: string
    notableTimestamps: Timeframe[]
  }
}

export interface AssetEntityData extends DetailBase {
  type: 'assetEntityData'
  assetEntity: {
    ids: {
      id: string
      type: string
    }[]
  }
}

export interface KanedamaGenericGridsDetail extends DetailBase {
  type: 'genericGrids'
  grids: KanedamaGrid[]
}

export interface KanedamaChartsDetail extends DetailBase {
  type: 'charts'
  charts: KanedamaChart[]
}

export interface ContentReference {
  domainTags?: {
    domain: string
  }
  questionTags?: {
    assetIds: string[]
  }
  answerTags?: {
    assetIds: string[]
  }
}

export interface Visual {
  summary: Summary
  summaryTokens: KanedamaToken[]
  isSuperlative: boolean
  additionalQuestions?: AdditionalQuestion[]
  contentReference?: ContentReference
  detail?: Detail[]
  disclaimers?: [string]
}

export type Detail =
  | AssetEntityData
  | AssetPriceDataDetail
  | KanedamaGenericGridsDetail
  | KanedamaChartsDetail

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
    | 'fullNlgAnswerVisualsOptional'
    | 'nlgAnswerNotPossibleVisualsRequired'
    | 'error'
  visual: Visual
  nlg: Nlg
}

export interface KanedamaChoicesResponse extends KanedamaResponseBase {
  type: 'nlgPromptForMoreInfoVisualChoicesOptional'
  visual: ChoicesVisual
  nlg: ChoicesNlg
}

export interface ChoicesVisual
  extends Omit<
    Visual,
    | 'domain'
    | 'detail'
    | 'disclaimers'
    | 'additionalQuestions'
    | 'isSuperlative'
  > {
  choices: [
    {
      display: string
      assetId: string
      input: string
    },
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
