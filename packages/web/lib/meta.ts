import type { GameraDomain } from '@statmuse/core/gamera'

export interface Metadata {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  facebook?: {
    title?: string
    description?: string
    imageUrl?: string
  }
  twitter?: {
    title?: string
    description?: string
    imageUrl?: string
  }
}

export const getLeagueKeywords = (league: GameraDomain) => {
  switch (league) {
    case 'NBA':
      return 'NBA basketball'
    case 'NFL':
      return 'NFL football'
    case 'NHL':
      return 'NHL hockey'
    case 'MLB':
      return 'MLB baseball'
    case 'PGA':
      return 'PGA golf'
    default:
      return ''
  }
}
