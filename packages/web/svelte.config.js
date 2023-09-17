import { preprocessMeltUI } from '@melt-ui/pp'
import { vitePreprocess } from '@astrojs/svelte'
import sequence from 'svelte-sequential-preprocessor'

export default {
  preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
}
