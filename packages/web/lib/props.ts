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
  audioUrl?: string
  shareUrl?: string
  hasSupplement?: boolean
}
