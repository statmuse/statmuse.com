import tailwind from '@astrojs/tailwind'
import aws from 'astro-sst/lambda'
import { defineConfig, sharpImageService } from 'astro/config'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ config: { applyBaseStyles: false } })],
  output: 'server',
  adapter: aws(),
  experimental: { assets: true },
  // image: { service: sharpImageService() },
  redirects: {
    '/company': '/company/about',
    '/company/products': '/company/about',
    '/company/shoutouts': '/company/about',
    '/company/twitter-love': '/company/about',
    '/getting-started/data-coverage': '/product/data',
    '/getting-started/glossary': '/product/data',
    '/getting-started/personalities': '/product/examples',
    '/getting-started/voices': '/product/examples',
    '/product/data-coverage': '/product/data',
    '/product/glossary': '/product/data',
    '/product/personalities': '/product/examples',
    '/product/voices': '/product/examples',
    '/statlove': '/company/about',
  },
  vite: {
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
    },
    build: {
      rollupOptions: {
        plugins: [rollupNodePolyFill()],
      },
    },
    resolve: {
      alias: {
        './runtimeConfig': './runtimeConfig.browser',
      },
    },
  },
})
