import {
  type KanedamaResponse,
  tokensToHtml,
  Timeframe,
  AssetBySymbolResponse,
  AssetProfile,
} from '@statmuse/core/kanedama'
import type { HeroProps } from './props'
import {
  Frequency,
  FrequencyKey,
  frequencyMap,
  getFrequencyForTimeframe,
} from '@statmuse/core/frequency'
import all from 'lodash/fp/all'
import filter from 'lodash/fp/filter'
import flatMap from 'lodash/fp/flatMap'
import get from 'lodash/fp/get'
import head from 'lodash/fp/head'
import map from 'lodash/fp/map'
import meanBy from 'lodash/fp/meanBy'
import pipe from 'lodash/fp/pipe'
import reduce from 'lodash/fp/reduce'
import update from 'lodash/fp/update'
import type { SeriesOptionsType, SeriesTooltipOptionsObject } from 'highcharts'

export const kanedamaApiUrl = import.meta.env.KANEDAMA_API_URL

export type ChartType =
  | 'line'
  | 'volume'
  | 'candle'
  | 'candlestick'
  | 'column'
  | 'flags'
export type Series = Omit<SeriesOptionsType, 'type'> & {
  type: ChartType
  color?: string
  data: Asset[]
  dataGrouping: { enabled: boolean }
  dataLabels: { enabled: boolean }
  marker: { enabled: boolean }
  tooltip?: SeriesTooltipOptionsObject
}
export type AssetPair = {
  isDefaultQuoteAsset: boolean
  baseAsset: { symbol: string; name?: string }
  quoteAsset: { symbol: string; name?: string }
}
export type AssetPriceData = {
  assetPair: AssetPair
  prices: Price[]
  redacted: boolean
}
export type Price = {
  open: number
  close: number
  high: number
  low: number
  volume: number
  closePercentChange: number
  unitsOutstanding?: number
  timeframe: Timeframe
}
export type Asset = {
  x?: number
  y?: number
  type?: ChartType
  series?: Series
  open?: number
  high?: number
  low?: number
  close?: number
  unitsOutstanding?: number
  xTooltipDisplay?: string

  assetPair?: AssetPair
  prices?: Price[]
  redacted?: boolean
}
export type NumericFormatter = (value: unknown) => string

export type RenderTarget = {
  formatYAxisValue: (formatString: string, value: unknown) => string
  getYAxisValue: (price: Price) => number
  seriesNameSuffix: 'Price' | 'Market Cap'
  showSeriesInLegend: boolean
  supportsCandlestick: boolean
}

export async function ask(options: {
  query: string
  conversationToken?: string
}) {
  const query = options.query

  const params: Record<string, string> = {
    input: query,
  }

  if (options.conversationToken) {
    params['conversationToken'] = options.conversationToken
  }

  const requestUrl = `${kanedamaApiUrl}answer?${new URLSearchParams(
    params
  ).toString()}`

  console.log(requestUrl)

  try {
    const response = await fetch(requestUrl)
    return response.json() as Promise<KanedamaResponse>
  } catch (error) {
    console.error(error)
  }
}

export async function lookup(symbol: string) {
  const requestUrl = `${kanedamaApiUrl}asset/symbol/${symbol}`

  try {
    const response = await fetch(requestUrl)
    return response.json() as Promise<AssetBySymbolResponse>
  } catch (error) {
    console.error(error)
  }
}

export async function getAssetProfile(symbol: string) {
  const lookupResponse = await lookup(symbol)
  if (!lookupResponse) return undefined

  const assetId = lookupResponse.assetId
  const requestUrl = `${kanedamaApiUrl}asset/${assetId}`

  try {
    const response = await fetch(requestUrl)
    return response.json() as Promise<AssetProfile>
  } catch (error) {
    console.error(error)
  }
}

export async function getAssetPriceData(options: {
  baseAssetId: string
  quoteAssetId?: string
  frequency?: FrequencyKey
  startTimestamp?: string
  endTimestamp?: string
  limit?: number
}) {
  const params: Record<string, string> = {
    limit: options.limit ? options.limit.toString() : '1000',
  }
  if (options.quoteAssetId) params.quoteAssetId = options.quoteAssetId
  if (options.frequency) params.frequency = options.frequency
  if (options.startTimestamp) params.startTimestamp = options.startTimestamp
  if (options.endTimestamp) params.endTimestamp = options.endTimestamp

  const requestUrl = `${kanedamaApiUrl}asset/${
    options.baseAssetId
  }/price?${new URLSearchParams(params).toString()}`
  console.log(requestUrl)

  try {
    const response = await fetch(requestUrl)
    return response.json() as Promise<AssetPriceData>
  } catch (error) {
    console.error(error)
  }
}

export const getFrequencyKey = (
  frequencyName: string | undefined,
  startTimestamp: string,
  endTimestamp: string
) => {
  // For backwards compatibility, allow server to introduce new frequencies
  // which aren't yet supported in the client. Fallback to time-based frequency
  // logic when the named frequency does not exist.
  if (frequencyName) {
    const targetKey = frequencyName.toLowerCase()

    for (const currentKey in frequencyMap) {
      if (currentKey === targetKey) {
        return currentKey
      }
    }
  }

  return getFrequencyForTimeframe(startTimestamp, endTimestamp)
}

export const calculateAvgReturns = (assets: Asset[]) =>
  pipe(
    flatMap('prices'),
    reduce<Price, Record<string, Price[]>>((obj, price) => {
      return update(
        price.timeframe.timestamp ?? price.timeframe.endTimestamp!,
        (n) => (n ? [...n, price] : [price]),
        obj
      )
    }, {}),
    filter((x) => x.length === assets.length),
    map((x) => ({
      closePercentChange: meanBy('closePercentChange', x),
      timeframe: x[0].timeframe,
    }))
  )(assets)

export const createCompositeIndex = (assets: Asset[]) => ({
  assetPair: {
    baseAsset: {
      assetId: 'composite-index',
      name: 'Composite Index',
      symbol: 'AVG',
    },
    isDefaultQuoteAsset: true,
    quoteAsset: get('0.assetPair.quoteAsset', assets),
  },
  color: '#39cccc',
  prices: calculateAvgReturns(assets),
})

export const maybeIncludeComposite = (assets: Asset[]) => {
  if (
    assets.length > 1 &&
    all(
      {
        assetPair: { isDefaultQuoteAsset: true, quoteAsset: { symbol: 'USD' } },
      },
      assets
    )
  ) {
    const compositeIndex = createCompositeIndex(assets)
    return compositeIndex.prices.length ? [...assets, compositeIndex] : assets
  }
  return assets
}

export const getInitialClose = pipe(head, get('close'))

export const calculatePercentChange = (initialClose: number) => (x: Price) =>
  100 + ((x.close - initialClose) / initialClose) * 100

export const addClosePercentChange = (initialClose: number) => (x: Price) => ({
  ...x,
  closePercentChange: calculatePercentChange(initialClose)(x),
})

export const addTimeframeDisplay = (frequency: Frequency) => (x: Price) => ({
  ...x,
  timeframe: {
    ...x.timeframe,
    display: frequency.getDateDisplay(
      x.timeframe.timestamp ?? x.timeframe.endTimestamp!
    ),
  },
})

export function getHeroProps(props: {
  imageAlt: string
  response?: KanedamaResponse
}): HeroProps | undefined {
  const answer = props.response
  if (!answer) throw new Error('Must provide either data')

  if (answer.type === 'nlgPromptForMoreInfoVisualChoicesOptional')
    return undefined

  const content = tokensToHtml(answer.nlg.text.answer)
  const imageUrl = answer.visual.summary.subject?.imageUrl
  const imageAlt = props.imageAlt

  return {
    content,
    imageUrl,
    imageAlt,
  }
}
