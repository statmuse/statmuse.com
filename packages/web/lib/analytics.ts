import { AnalyticsBrowser } from '@segment/analytics-next'
import type {
  ContentReference as GameraContentReference,
  Disposition,
  Subject as GameraSubject,
  TokenizationScore,
} from '@statmuse/core/gamera'
import type {
  ContentReference as KanedamaContentReference,
  Subject as KanedamaSubject,
} from '@statmuse/core/kanedama'
import { isBotTest } from '@lib/useragent'

export type AnalyticsPageviewProperties = {
  is_error?: boolean
  is_search?: boolean
  method?: 'GET' | 'POST'
  origin?: 'web'
  origin_scope?: 'browser'
  page_domain?:
    | 'nba'
    | 'nfl'
    | 'nhl'
    | 'mlb'
    | 'pga'
    | 'finance'
    | 'epl'
    | 'sports'
    | 'unknown'
  page_type?:
    | 'ask'
    | 'asset'
    | 'error'
    | 'game'
    | 'home'
    | 'musing'
    | 'player'
    | 'prompt'
    | 'question'
    | 'schedule'
    | 'standings'
    | 'trending'
    | 'team'
    | 'mobile'
    | 'unknown'
  query?: string
  disposition?: Disposition
  tokenizationScore?: TokenizationScore
  contentReference?: GameraContentReference | KanedamaContentReference
  subject?: GameraSubject | KanedamaSubject
}

declare global {
  interface Window {
    segment: AnalyticsBrowser
    freestar: {
      queue: any[]
      config: {
        enabled_slots: any[]
      }
      initCallback: () => void
      newAdSlots: (x: any) => void
      deleteAdSlots: (x: string) => void
      newStickyFooter: (x?: string) => void
      deleteStickyFooter: (x?: string) => void
    }
  }
}

const writeKey = document.querySelector<HTMLMetaElement>(
  'meta[name="analytics"]',
)?.content

export const segment = (window.segment =
  import.meta.env.PROD && writeKey
    ? AnalyticsBrowser.load(
        {
          writeKey,
          cdnURL: import.meta.env.PUBLIC_ANALYTICS_CDN_PROXY_URL,
        },
        {
          integrations: {
            'Segment.io': {
              apiHost:
                new URL(import.meta.env.PUBLIC_ANALYTICS_API_PROXY_URL).host +
                '/v1',
            },
          },
        },
      )
    : (['identify', 'page', 'track'].reduce(
        (stub, key) => ({
          ...stub,
          [key]: (...args: [string]) =>
            console.debug(`analytics.${key}`, ...args),
        }),
        {},
      ) as AnalyticsBrowser))

const getOrigin = (userAgent: string) => {
  const isBot = isBotTest(userAgent)
  if (isBot && userAgent.includes('Google')) return 'web.googlebot'
  if (isBot) return 'web.bot'
  return 'web'
}

const flattenObj = (key: string, obj?: object) => {
  return !obj
    ? {}
    : Object.entries(obj).reduce((x, [k, v]) => {
        return {
          ...x,
          [`${key}.${k}`]: v,
        }
      }, {})
}

const getReferenceIds = (
  contentReference?: GameraContentReference | KanedamaContentReference,
) => {
  if (!contentReference) return {}
  const { questionTags, answerTags } = contentReference

  if (
    questionTags?.playerIds ||
    questionTags?.teamIds ||
    answerTags?.playerIds ||
    answerTags?.teamIds
  ) {
    return {
      players: JSON.stringify(
        Array.from(
          new Set([
            ...(questionTags?.playerIds ? questionTags.playerIds : []),
            ...(answerTags?.playerIds ? answerTags.playerIds : []),
          ]),
        ),
      ),
      teams: JSON.stringify(
        Array.from(
          new Set([
            ...(questionTags?.teamIds ? questionTags.teamIds : []),
            ...(answerTags?.teamIds ? answerTags.teamIds : []),
          ]),
        ),
      ),
    }
  }

  if (questionTags?.assetIds || answerTags?.assetIds) {
    return {
      assets: JSON.stringify(
        Array.from(
          new Set([
            ...(questionTags?.assetIds ? questionTags.assetIds : []),
            ...(answerTags?.assetIds ? answerTags.assetIds : []),
          ]),
        ),
      ),
    }
  }
}

const getSubjectItems = (subject?: GameraSubject | KanedamaSubject) => {
  if (!subject) return {}
  return {
    subject_image: subject.imageUrl,
    subject_background_color: subject.colors?.background,
    subject_foreground_color: subject.colors?.foreground,
  }
}

export const getPageviewProps = (document: Document) => {
  const eventProps = document.querySelector<HTMLMetaElement>(
    'meta[name="analytics:event:properties"]',
  )?.content

  if (eventProps) {
    try {
      const {
        disposition,
        tokenizationScore,
        contentReference,
        subject,
        ...props
      } = JSON.parse(eventProps) as AnalyticsPageviewProperties
      return {
        ...props,
        ...flattenObj('disposition', disposition),
        ...flattenObj('tokenizationScore', tokenizationScore),
        ...getReferenceIds(contentReference),
        ...getSubjectItems(subject),
        origin: getOrigin(navigator.userAgent),
      }
    } catch (_e) {
      return undefined
    }
  }
}
