import type { GameraDomain } from '@statmuse/core/gamera'

export interface Metadata {
  title?: string
  description?: string
  keywords?: string
  canonical?: {
    url: string
    rewrite?: boolean
  }
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

export const clean = (url: string) => {
  const cleaned = url
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replaceAll('‘', "'")
    .replaceAll('’', "'")
    .replaceAll('“', '"')
    .replaceAll('”', '"')
    .trim()
    .replace(/\?$/, '')

  return handlePlusSigns(cleaned)
}

const handlePlusSigns = (text: string) => {
  let words = text.split('+')

  words = words.reduce((accum: string[], word: string) => {
    // space as next word when previous word was already a plus
    // just ignore this extra space
    if (word === '' && accum[0] === '+') {
      return ['+'].concat(accum)
    }

    // space as next word means there were two + in a row
    // treat that as an intentional + sign
    else if (word === '') {
      return ['+', accum[0]].concat(accum.slice(1))
    }

    // typical case, prepend word
    else {
      return [word].concat(accum)
    }
  }, [])

  // legit plus signs were probably intended to touch word, e.g. 10+ rpg
  return words.reverse().join(' ').replace(/ \+/g, '+')
}
