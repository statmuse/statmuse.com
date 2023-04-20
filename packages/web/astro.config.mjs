import { defineConfig } from 'astro/config'
import solid from '@astrojs/solid-js'
import tailwind from '@astrojs/tailwind'
import aws from 'astro-sst/lambda'
import image from '@astrojs/image'

// https://astro.build/config
export default defineConfig({
  integrations: [
    solid(),
    tailwind({ config: { applyBaseStyles: false } }),
    image({ serviceEntryPoint: '@astrojs/image/sharp' }),
  ],
  output: 'server',
  adapter: aws(),
})
