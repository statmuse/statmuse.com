export const categories = [
  'searches',
  'players',
  'teams',
  'player',
  'team',
  'money',
] as const

export type Category = (typeof categories)[number]

export type TrendingItem = {
  datasets: [
    {
      name: string
      key: string
      prominent?: boolean
      items: TrendingListItem[]
    },
  ]
  updated: string
}

export interface TrendingListItem {
  title: string
  html?: string
  uri: string
  images: string[]
  background: string
  foreground: string
  count: number
}
