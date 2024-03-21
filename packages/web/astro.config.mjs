import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import svelte, { vitePreprocess } from '@astrojs/svelte'
import { preprocessMeltUI } from '@melt-ui/pp'
import aws from 'astro-sst'
import { defineConfig } from 'astro/config'
import partytown from '@astrojs/partytown'

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    react(),
    svelte({ preprocess: [vitePreprocess(), preprocessMeltUI()] }),
    partytown({
      config: {
        forward: [
          'dataLayer.push',
          'analytics.track',
          'analytics.identify',
          'analytics.page',
          'analytics.group',
          'analytics.reset',
          'analytics.user',
          'analytics.alias',
          'tude.cmd.push',
          'tude.destroyAds',
          'tude.refreshAdsViaDivMappings',
          'tude.setPageTargeting',
        ],
      },
    }),
  ],
  output: 'server',
  server: { port: 3000 },
  // devToolbar: { enabled: false },
  adapter: aws({
    responseMode: 'buffer',
    serverRoutes: ['ask', 'money/ask', 'fantasy/ask', 'auth/*', 'account/*'],
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
  },
})
