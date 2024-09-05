/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_API_URL: string
  readonly GAMERA_API_URL: string
  readonly GAMERA_API_KEY: string
  readonly KANEDAMA_API_URL: string
  readonly PUBLIC_SHORT_LINK_URL: string
  readonly PUBLIC_AUTH_URL: string
  readonly PUBLIC_ANALYTICS_API_PROXY_URL: string
  readonly PUBLIC_ANALYTICS_CDN_PROXY_URL: string
  readonly PUBLIC_STAGE: string
  readonly ANSWER_CARDS_ENABLED: string
  readonly PUBLIC_IOT_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare namespace App {
  interface Locals {
    session: import('@lib/session').Session
    visitor: import('@statmuse/core/visitor').Visitor
    user?: import('@statmuse/core/user').User
    subscribed: boolean
    platform: 'web' | 'native'
    colorScheme?: 'light' | 'dark'
    nativeView?: 'home' | 'scores' | 'search' | 'trending' | 'more'
    deviceId?: string
    trendingData?: import('./types').TrendingItem
  }
}
