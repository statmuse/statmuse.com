import { cdnBaseUrl } from './gamera'

export const clean = (x: string) =>
  x
    .toLowerCase()
    // remove duplicate whitespace
    .replace(/\s+/g, ' ')
    // convert single and double curly quotes to respective straight quotes
    .replaceAll('‘', "'")
    .replaceAll('’', "'")
    .replaceAll('“', '"')
    .replaceAll('”', '"')
    // remove trailing ?
    .replace(/\?+$/, '')
    .trim()

const contains = (s: string, chars: string[]) => {
  let res = false
  for (const i in chars) {
    res = res || s.includes(chars[i])
    if (res) return res
  }
  return res
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#encoding_for_rfc3986
const encodeRFC3986URIComponent = (str: string) => {
  return (
    encodeURIComponent(str)
      .replace(
        /[!'()*]/g,
        (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
      )
      // application/x-www-form-urlencoded
      .replaceAll('%20', '+')
  )
}

const hasSymbols = (s: string) =>
  contains(encodeRFC3986URIComponent(clean(s)), ['%', '-'])

export const createSlug = (s: string) =>
  clean(s).replaceAll(' ', '-').replace(/-+$/, '')

export const createAskPath = ({
  domain,
  query,
}: {
  domain: string
  query: string
}) => {
  if (hasSymbols(query)) {
    return `/${
      domain === 'epl' ? 'fc' : domain
    }/ask?q=${encodeRFC3986URIComponent(clean(query))}`
  }
  return `/${domain === 'epl' ? 'fc' : domain}/ask/${createSlug(query)}`
}

export const imageForgeUrl = ({
  bgColor = 'FFFFFF',
  type,
  url,
}: {
  bgColor?: string
  type: 'facebook' | 'twitter'
  url: string
}) => {
  const bg =
    bgColor[0] === '#' ? bgColor.slice(1).toUpperCase() : bgColor.toUpperCase()
  return `${cdnBaseUrl}/forge-v2/${btoa(
    `${url}?${new URLSearchParams({
      bg,
      t: type,
    }).toString()}`,
  ).replaceAll('/', '_')}.png`
}
