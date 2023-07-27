import tailwind from '@astrojs/tailwind'
import aws from 'astro-sst/lambda'
import { defineConfig } from 'astro/config'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind({ config: { applyBaseStyles: false } })],
  output: 'server',
  adapter: aws(),
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  experimental: { assets: true, viewTransitions: true },
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
