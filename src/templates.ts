import {dedent, isArray} from 'vtils'
import {INormalizedRoute} from './types'

export function makeExports(normalizedRoutes: INormalizedRoute[]): string {
  return dedent`
    import { useMemo } from 'react'
    import { history, useParams } from 'umi'
    import { compile, PathFunction } from 'path-to-regexp'
    import { INormalizedParam } from './types'

    ${normalizedRoutes.map(route => dedent`
      export interface ${route.paramsTypeName} {
        ${route.params.map(param => dedent`
          ${JSON.stringify(param.name)}${param.optional || param.asterisk ? '?' : ''}: ${param.tsType}
        `).join('\n')}
      }
    `).join('\n\n')}

    export type IPageName = ${normalizedRoutes.map(route => `'${route.name}'`).join(' | ')}

    export interface IPageParams {
      ${normalizedRoutes.map(route => dedent`
        ${route.name}: ${route.paramsTypeName}
      `).join('\n')}
    }

    const toPath: Record<IPageName, PathFunction> = {
      ${normalizedRoutes.map(route => dedent`
        ${route.name}: compile(${JSON.stringify(route.path)}),
      `).join('\n')}
    }

    const originalParamsInfo: {
      [TPageName in IPageName]: Record<
        keyof IPageParams[TPageName],
        Pick<INormalizedParam, 'originalName'>
      >
    } = {
      ${normalizedRoutes.map(route => dedent`
        ${route.name}: {
          ${route.params.map(param => dedent`
            ${JSON.stringify(param.name)}: {
              originalName: ${JSON.stringify(param.originalName)},
            },
          `).join('\n')}
        },
      `).join('\n')}
    }

    const normalizedParamsInfo: {
      [TPageName in IPageName]: Record<
        string,
        Pick<INormalizedParam, 'name' | 'jsType'>
      >
    } = {
      ${normalizedRoutes.map(route => dedent`
        ${route.name}: {
          ${route.params.map(param => dedent`
            ${JSON.stringify(param.originalName)}: {
              name: ${JSON.stringify(param.name)},
              jsType: ${isArray(param.jsType) ? `[${param.jsType[0].name}]` : param.jsType.name},
            },
          `).join('\n')}
        },
      `).join('\n')}
    }

    function toOriginalParams<TPageName extends IPageName>(name: TPageName, params?: IPageParams[TPageName]): Record<any, any> {
      if (!params) return {}
      const originalParams: Record<any, any> = {}
      for (const key of Object.keys(params)) {
        const originalParamInfo = (originalParamsInfo as any)[name][key]
        if (originalParamInfo?.originalName) {
          originalParams[originalParamInfo.originalName] = (params as any)[key] == null ? undefined : String((params as any)[key])
        }
      }
      return originalParams
    }

    function toNormalizedParams<TPageName extends IPageName>(name: TPageName, params?: Record<any, any>): IPageParams[TPageName] {
      if (!params) return {} as any
      const normalizedParams: IPageParams[TPageName] = {} as any
      for (const key of Object.keys(params)) {
        const normalizedParamInfo = normalizedParamsInfo[name][key]
        if (normalizedParamInfo?.name) {
          (normalizedParams as any)[normalizedParamInfo.name] = (
            normalizedParamInfo.jsType === Boolean
              ? params[key] === 'true'
              : normalizedParamInfo.jsType === Number
                ? (Array.isArray(params[key]) ? params[key].map(Number) : Number(params[key]))
                : params[key]
          )
        }
      }
      return normalizedParams
    }

    export function navigateTo<TPageName extends IPageName>(name: TPageName, params?: IPageParams[TPageName]) {
      history.push(toPath[name](toOriginalParams(name, params)))
    }

    export function redirectTo<TPageName extends IPageName>(name: TPageName, params?: IPageParams[TPageName]) {
      history.replace(toPath[name](toOriginalParams(name, params)))
    }

    export function navigateBack(delta: number = 1) {
      history.go(-delta)
    }

    export function navigateForward(delta: number = 1) {
      history.go(delta)
    }

    export function usePageParams<TPageName extends IPageName>(name: TPageName): IPageParams[TPageName] {
      const params = useParams()
      const normalizedParams = useMemo(
        () => toNormalizedParams(name, params),
        [name, params],
      )
      return normalizedParams
    }
  `
}
