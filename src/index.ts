import type { UnpluginFactory, UnpluginOptions } from 'unplugin'
import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import { unified } from 'unified'
import type { ResolvedUnpluginUnifiedRule, UnpluginUnifiedOptions } from './types'

export const unpluginFactory: UnpluginFactory<UnpluginUnifiedOptions> = (options) => {
  const resolved = (options?.rules || []).map((rule): ResolvedUnpluginUnifiedRule => {
    const filter = typeof rule.include === 'function'
      ? rule.include
      : createFilter(rule.include, rule.exclude)
    const processor = Promise.resolve(rule.setup(unified()))
    return {
      ...rule,
      filter,
      processor,
    }
  })

  const pre: ResolvedUnpluginUnifiedRule[] = []
  const post: ResolvedUnpluginUnifiedRule[] = []
  const normal: ResolvedUnpluginUnifiedRule[] = []

  for (const rule of resolved) {
    if (rule.enforce === 'pre')
      pre.push(rule)
    else if (rule.enforce === 'post')
      post.push(rule)
    else
      normal.push(rule)
  }

  return [pre, normal, post].map((rules, idx): UnpluginOptions | undefined => {
    const enforce = (['pre', undefined, 'post'] as const)[idx]
    if (rules.length === 0)
      return undefined

    return {
      name: `unplugin-unified${enforce ? `:${enforce}` : ''}`,
      enforce,
      transformInclude(id) {
        return rules.some(r => r.filter(id))
      },
      async transform(code, id) {
        const rule = rules.find(r => r.filter(id))
        if (!rule)
          return

        code = (await rule.transform?.pre?.(code, id) || code)

        const processor = await rule.processor
        const result = await processor.process(code)

        let resultCode = result.toString()
        let resultMap = result.map

        if (rule.transform?.post) {
          const postResult = await rule.transform.post(resultCode, id, resultMap as any) || resultCode
          if (typeof postResult === 'string') {
            resultCode = postResult
          }
          else {
            resultCode = postResult.code
            resultMap = postResult.map as any
          }
        }

        return {
          code: resultCode,
          map: resultMap,
        }
      },
    }
  }).filter(Boolean) as UnpluginOptions[]
}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin
