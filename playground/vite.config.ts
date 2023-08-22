import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeStringify from 'rehype-stringify'
import rehypeShikiji from 'rehype-shikiji'
import type { Element, Root } from 'hast'
import Unified from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    Unified({
      rules: [
        {
          include: /\.md$/,
          setup: unified => unified
            .use(remarkParse)
            .use(remarkGfm)
            .use(remarkRehype, { allowDangerousHtml: true })
            .use(() => (tree: Root) => {
              const wrapper: Element = {
                type: 'element',
                tagName: 'div',
                properties: { className: ['markdown-body'] },
                children: tree.children as Element[],
              }
              tree.children = [wrapper]
              return tree
            })
            .use(rehypeRaw)
            .use(rehypeShikiji, { themes: { dark: 'vitesse-dark', light: 'vitesse-light' } })
            .use(rehypeStringify),
          transform: {
            post(code) {
              return `export default (${JSON.stringify(code)})`
            },
          },
        },
      ],
    }),
  ],
})
