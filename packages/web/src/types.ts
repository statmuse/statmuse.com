export const categories = [
  'searches',
  'players',
  'teams',
  'player',
  'team',
] as const

export const moneyCategories = [
  'searches',
  'assets',
  'asset',
  'stocks',
  'etfs',
  'indices',
  'currencies',
  'nyse',
  'nasdaq',
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

export interface NavLink {
  text: string
  param: string
  href?: string
}
