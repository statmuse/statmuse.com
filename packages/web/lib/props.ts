export type HeroProps = {
  content: string
  url?: { href: string; title?: string }
  imageUrl?: string
  imageAlt?: string
  affiliation?: string
  affiliationUrl?: string
  answered?: string
  markdown?: boolean
  html?: boolean
  hasSupplement?: boolean
  share?: {
    type?: 'ask' | 'musing' | 'profile'
    shortCode?: string
    url?: string
    query?: string
    domain?: string
  }
}
