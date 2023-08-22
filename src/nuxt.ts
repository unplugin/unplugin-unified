import { addVitePlugin, addWebpackPlugin, defineNuxtModule } from '@nuxt/kit'
import '@nuxt/schema'
import type { UnpluginUnifiedOptions } from './types'
import vite from './vite'
import webpack from './webpack'

export default defineNuxtModule<UnpluginUnifiedOptions>({
  meta: {
    name: 'unplugin-unified',
    configKey: 'unified',
  },
  async setup(options) {
    addVitePlugin(() => vite(options))
    addWebpackPlugin(() => webpack(options))
  },
})
