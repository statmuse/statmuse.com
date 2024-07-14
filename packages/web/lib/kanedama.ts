import {
  type KanedamaResponse,
  tokensToHtml,
  type Timeframe,
  type AssetBySymbolResponse,
  type AssetProfile,
} from '@statmuse/core/kanedama'
import type { HeroProps } from './props'
import {
  Frequency,
  type FrequencyKey,
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
import { getGameraHeaders } from '@lib/gamera'
import type { Context } from './session'
import { clarify } from '@lib/bedrock'
import { createAskPath } from '@statmuse/core/path'
import { translate, translateObject } from '@lib/translate'

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
  color?: string
}
export type NumericFormatter = (value: unknown) => string

export type RenderTarget = {
  formatYAxisValue: (formatString: string, value: unknown) => string
  getYAxisValue: (price: Price) => number
  seriesNameSuffix: 'Price' | 'Market Cap'
  showSeriesInLegend: boolean
  supportsCandlestick: boolean
}

export async function request<T>(
  context: Context,
  path: string,
  params?: Record<string, string | number> | URLSearchParams,
): Promise<T | undefined> {
  const requestUrl = `${kanedamaApiUrl}${path}?${new URLSearchParams(
    params as Record<string, string>,
  ).toString()}`

  try {
    const response = await fetch(requestUrl, {
      headers: getGameraHeaders(context),
    })
    return response.json() as Promise<T>
  } catch (error) {
    console.error(error)
    return undefined
  }
}

type AskResponse = { response?: KanedamaResponse } | { redirect: string }

export async function ask(
  options: {
    query: string
    conversationToken?: string
    corrected?: boolean
  },
  context: Context,
): Promise<AskResponse> {
  const query = options.query

  const params: Record<string, string> = {
    input: query,
  }

  if (options.conversationToken) {
    params['conversationToken'] = options.conversationToken
  }

  let response = await request<KanedamaResponse>(context, 'answer', params)

  if (
    !options.corrected && // Don't correct if it's already been corrected
    response?.type === 'error' &&
    response?.nlg?.text?.answer[0].text === "I didn't understand your question."
  ) {
    try {
      const correction = await clarify(query)
      console.log('correction', correction)

      // if (correction.domain === 'unknown') return { response }
      // if (correction.domain !== 'money') {
      //   const url = createAskPath(correction)
      //   return { redirect: url }
      // }

      // if (correction.lang !== 'en') {
      //   const englishQuery = await translate({
      //     text: query,
      //     from: correction.lang,
      //     to: 'en',
      //   })
      //
      //   if (!englishQuery.text) return { response }
      //
      //   const englishResponse = await ask(
      //     {
      //       query: englishQuery.text,
      //       corrected: true,
      //     },
      //     context,
      //   )
      //   if ('redirect' in englishResponse) return englishResponse
      //
      //   let kanedamaResponse = englishResponse.response
      //   if (!kanedamaResponse) return { response }
      //
      //   kanedamaResponse = await translateObject(
      //     kanedamaResponse,
      //     'en',
      //     correction.lang,
      //     [
      //       'visual.summaryTokens.*.text',
      //       'nlg.text.answer.*.text',
      //       'visual.additionalQuestions.*.text',
      //     ],
      //   )
      //   return { response: kanedamaResponse }
      // }

      return ask(
        {
          ...options,
          query: correction.query,
          corrected: true,
        },
        context,
      )
    } catch (error) {
      console.error('Error using Bedrock to cleanup input', error)
      return { response }
    }
  }

  return { response }
}

export async function lookup(symbol: string, context: Context) {
  const requestUrl = `${kanedamaApiUrl}asset/symbol/${symbol}`

  try {
    const response = await fetch(requestUrl, {
      headers: getGameraHeaders(context),
    })
    return response.json() as Promise<AssetBySymbolResponse>
  } catch (error) {
    console.error(error)
  }
}

export async function getAssetProfile(symbol: string, context: Context) {
  const lookupResponse = await lookup(symbol, context)
  if (!lookupResponse) return undefined

  const assetId = lookupResponse.assetId
  const requestUrl = `${kanedamaApiUrl}asset/${assetId}`

  try {
    const response = await fetch(requestUrl, {
      headers: getGameraHeaders(context),
    })
    const data = await response.json()
    if (data.error) {
      return undefined
    }
    return data as AssetProfile
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
  context: Context
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
  const headers = getGameraHeaders(options.context)

  try {
    const responses = await Promise.all([
      fetch(requestUrl, { headers }),
      fetch(`${kanedamaApiUrl}asset/${options.baseAssetId}`, { headers }),
    ])
    const json = (await Promise.all(responses.map((r) => r.json()))) as [
      AssetPriceData,
      AssetProfile,
    ]
    const [priceData, asset] = json
    return {
      ...priceData,
      color: asset.images[0]?.colors[0]?.background || '#000',
    }
  } catch (error) {
    console.error(error)
  }
}

export const getFrequencyKey = (
  frequencyName: string | undefined,
  startTimestamp: string,
  endTimestamp: string,
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
        obj,
      )
    }, {}),
    filter((x) => x.length === assets.length),
    map((x) => ({
      closePercentChange: meanBy('closePercentChange', x),
      timeframe: x[0].timeframe,
    })),
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
      assets,
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
      x.timeframe.timestamp ?? x.timeframe.endTimestamp!,
    ),
  },
})

export function getHeroProps(props: {
  imageAlt: string
  response?: KanedamaResponse
}): HeroProps | undefined {
  const answer = props.response
  if (!answer) throw new Error('Must provide either data')

  if (
    answer.type === 'nlgPromptForMoreInfoVisualChoicesOptional' ||
    answer.type === 'error'
  )
    return undefined

  const content = tokensToHtml(answer.nlg.text.answer)
  const imageUrl = answer.visual.summary.subject?.imageUrl
  const imageAlt = props.imageAlt

  return {
    content,
    imageUrl,
    imageAlt,
    markdown: false,
    html: true,
  }
}
