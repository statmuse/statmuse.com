import type { AstroGlobal } from 'astro'
import type { AstroComponentFactory } from 'astro/runtime/server/index.js'
export * as Caching from './caching'

type Astro = Readonly<
  AstroGlobal<
    Record<string, any>,
    AstroComponentFactory,
    Record<string, string | undefined>
  >
>

const DEFAULT_MAX_AGE = 60
const DEFAULT_REVALIDATE_PERIOD = 86400

export const swr = (
  astro: Astro,
  options?: { maxage?: number; revalidate?: number },
) => {
  astro.response.headers.set(
    'Cache-Control',
    `public, no-cache="Set-Cookie", s-maxage=${
      options?.maxage ?? DEFAULT_MAX_AGE
    }, stale-while-revalidate=${
      options?.revalidate ?? DEFAULT_REVALIDATE_PERIOD
    }, stale-if-error=${options?.revalidate ?? DEFAULT_REVALIDATE_PERIOD}`,
  )
}

export const none = (astro: Astro) => {
  astro.response.headers.set('Cache-Control', 'no-cache, no-store')
}
