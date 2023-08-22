import type { FilterPattern } from '@rollup/pluginutils'
import type { SourceMap } from 'rollup'
import type { Processor } from 'unified'

export type Awaitable<T> = T | Promise<T>

export interface UnpluginUnifiedOptions {
  rules: UnpluginUnifiedRule[]
}

export interface UnpluginUnifiedRule {
  /**
   * Include filter, accepts glob patterns or RegExp
   * When a function is provided, the `exclude` option will be ignored
   */
  include: FilterPattern | ((id: string) => boolean)
  /**
   * Exclude filter, accepts glob patterns or RegExp
   * Only works when `include` is not a function
   */
  exclude?: FilterPattern
  /**
   * Enforce the rule to be applied the in the build pipeline
   *
   * @see https://github.com/unjs/unplugin#hooks
   */
  enforce?: 'pre' | 'post' | undefined
  /**
   * Setup the unified processor
   */
  setup(unified: Processor): Awaitable<Processor<any, any, any, any, any>>
  /**
   * Additional string transforms
   */
  transform?: {
    /**
     * Preprocess the raw code before unified process
     */
    pre?: (code: string, id: string) => Awaitable<string | void>
    /**
     * Postprocess the unified result.
     * If a sourcemap is returned, the function is responsible for merging it with the unified result.
     */
    post?: (code: string, id: string, map?: SourceMap) => Awaitable<string | void | { code: string; map?: SourceMap | null }>
  }
}

export interface ResolvedUnpluginUnifiedRule extends UnpluginUnifiedRule {
  filter: (id: string) => boolean
  processor: Promise<Processor>
}
