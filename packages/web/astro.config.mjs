import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import svelte, { vitePreprocess } from '@astrojs/svelte'
import { preprocessMeltUI } from '@melt-ui/pp'
import aws from 'astro-sst'
import { defineConfig } from 'astro/config'
import robotsTxt from 'astro-robots-txt'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.statmuse.com',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    svelte({
      preprocess: [vitePreprocess(), preprocessMeltUI()],
    }),
    robotsTxt(
      process.env.SST_STAGE === 'production'
        ? {
            sitemap: 'https://www.statmuse.com/sitemap.xml',
            policy: [
              {
                userAgent: '*',
                disallow: [
                  '/auth/*',
                  '/alexa',
                  '/slack-success',
                  '/metal/*',
                  '/decks/*',
                  '/contests',
                ],
              },
            ],
          }
        : {
            policy: [
              {
                userAgent: '*',
                disallow: '/',
              },
            ],
          },
    ),
  ],
  output: 'server',
  server: {
    port: 3000,
  },
  devToolbar: {
    enabled: false,
  },
  adapter: aws({
    responseMode: 'buffer',
    serverRoutes: ['ask', 'money/ask', 'auth/*', 'account/*'],
  }),
  vite: {
    optimizeDeps: ['sst'],
    build: {
      sourcemap: process.env.NODE_ENV === 'production',
    },
  },
  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.statmuse.com',
      },
    ],
  },
  redirects: {
    '/company': '/company/about',
    '/company/products': '/company/about',
    '/company/shoutouts': '/company/about',
    '/company/twitter-love': '/company/about',
    '/product/data': '/product/data/nba',
    '/product/examples': '/product/examples/nba',
    '/getting-started/data-coverage': '/product/data',
    '/getting-started/glossary': '/product/data',
    '/getting-started/personalities': '/product/examples',
    '/getting-started/voices': '/product/examples',
    '/product/data-coverage': '/product/data',
    '/product/glossary': '/product/data',
    '/product/personalities': '/product/examples',
    '/product/voices': '/product/examples',
    '/statlove': '/company/about',
    '/account': '/account/history',
    '/signin': '/auth/signin',
    '/signup': '/auth/signup',
    '/fantasy': '/nfl',
    '/fantasy/ask': '/nfl/ask',
    '/fantasy/ask/[question]': '/nfl/ask/[question]',
    '/fantasy/questions': '/nfl/questions',
    '/ask/fantasy/[question]': '/nfl/ask/[question]',
  },
})
