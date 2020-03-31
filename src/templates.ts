import { dedent } from 'vtils'
import { ISyntheticRoute } from './types'

export function makeExports(syntheticRoutes: ISyntheticRoute[]): string {
  return dedent`
    import { useMemo } from 'react'
    import { history, useLocation } from 'umi'

    // ==== 辅助类型 ====
    type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N
    type IfNever<T, Y, N> = [T] extends [never] ? Y : N
    type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T]


    // ==== 页面名称 ====
    type IPageName = ${
      syntheticRoutes
        .map(route => `'${route.pageName}'`)
        .join(' | ')
    }


    // ==== 页面参数 ====
    ${syntheticRoutes.filter(route => !!route.component).map(route => dedent`
      // @ts-ignore
      import { Params as ${route.pageParamsTypesName} } from ${JSON.stringify(route.component)}
    `).join('\n')}


    // ==== 页面名称 -> 页面参数 ====
    interface IPageNameToPageParams {
      ${syntheticRoutes.map(route => dedent`
        ${route.pageName}: ${route.pageParamsTypesName},
      `).join('\n')}
    }


    // ==== 页面名称 -> 页面路径 ====
    const pageNameToPagePath = {
      ${syntheticRoutes.map(route => dedent`
        ${route.pageName}: ${JSON.stringify(route.path)},
      `).join('\n')}
    }


    // ==== 路由辅助函数 ====
    export function navigateTo<TPageName extends IPageName>(
      pageName: TPageName,
      ...params: IfAny<
        IPageNameToPageParams[TPageName],
        [],
        IfNever<
          RequiredKeys<IPageNameToPageParams[TPageName]>,
          [IPageNameToPageParams[TPageName]?],
          [IPageNameToPageParams[TPageName]]
        >
      >
    ) {
      // @ts-ignore
      history.push({
        pathname: pageNameToPagePath[pageName],
        query: {
          __params__: JSON.stringify(params[0]),
        },
      })
    }

    export function redirectTo<TPageName extends IPageName>(
      pageName: TPageName,
      ...params: IfAny<
        IPageNameToPageParams[TPageName],
        [],
        IfNever<
          RequiredKeys<IPageNameToPageParams[TPageName]>,
          [IPageNameToPageParams[TPageName]?],
          [IPageNameToPageParams[TPageName]]
        >
      >
    ) {
      // @ts-ignore
      history.replace({
        pathname: pageNameToPagePath[pageName],
        query: {
          __params__: JSON.stringify(params[0]),
        },
      })
    }

    export function navigateBack(delta: number = 1) {
      history.go(-delta)
    }

    export function navigateForward(delta: number = 1) {
      history.go(delta)
    }

    export function usePageParams<TPageName extends IPageName>(pageName: TPageName): IPageNameToPageParams[TPageName] {
      // @ts-ignore
      const { query } = useLocation()
      const params = useMemo(
        () => {
          try {
            return query.__params__
              ? JSON.parse(query.__params__)
              : {}
          } catch (err) {
            return {}
          }
        },
        [query.__params__],
      )
      return params
    }
  `
}
