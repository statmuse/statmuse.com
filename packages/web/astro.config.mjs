import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import svelte from '@astrojs/svelte'
import aws from 'astro-sst/lambda'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    svelte(),
  ],
  output: 'server',
  server: { port: 3000 },
  adapter: aws(),
  vite: {
    optimizeDeps: ['sst'],
    build: { sourcemap: process.env.NODE_ENV === 'production' },
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
