# unplugin-unified

[![NPM version](https://img.shields.io/npm/v/unplugin-unified?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-unified)

[unified](https://github.com/unifiedjs/unified) pipeline integration with [unplugin](https://github.com/unjs/unplugin), for Vite, Rollup, Webpack, Nuxt, esbuild, and more.

## Install

```bash
npm i unplugin-unified
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Unified from 'unplugin-unified/vite'

export default defineConfig({
  plugins: [
    Unified({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Unified from 'unplugin-unified/rollup'

export default {
  plugins: [
    Unified({ /* options */ }),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-unified/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default {
  buildModules: [
    ['unplugin-unified/nuxt', { /* options */ }],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-unified/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import Unified from 'unplugin-unified/esbuild'

build({
  plugins: [
    Unified({ /* options */ })
  ],
})
```

<br></details>

## Configurations

This plugin allows you to configure multiple `unified` processors based on the file id. You can pass an array of rules to the plugin with different configurations.

```ts
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import rehypeShikiji from 'rehype-shikiji'

// configure the plugin
Unified({
  rules: [
    {
      // match for `*.md` files
      include: /\.md$/,
      // setup the unified processor
      setup: unified => unified
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeShikiji, { themes: { dark: 'vitesse-dark', light: 'vitesse-light' } })
        .use(rehypeStringify),
      // custom transformers
      transform: {
        post(html) {
          // wrap the generated HTML with `export default`
          return `export default (${JSON.stringify(html)})`
        },
      },
    },
    {
      include: /\.vue$/,
      exclude: /node_modules/,
      enforce: 'pre', // run before vue plugins
      // ...
    },
    // ... more rules
  ],
})
```
