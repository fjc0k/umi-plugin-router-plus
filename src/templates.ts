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
        .map(route => `'${route.names.page}'`)
        .join(' | ')
    }


    // ==== 页面查询 ====
    ${syntheticRoutes.filter(route => !!route.component).map(route => dedent`
      // @ts-ignore
      import { Query as ${route.names.QueryTypes} } from ${JSON.stringify(route.component)}
    `).join('\n')}


    // ==== 页面名称 -> 页面查询 ====
    interface IPageNameToQueryTypes {
      ${syntheticRoutes.map(route => dedent`
        ${route.names.page}: ${route.names.QueryTypes},
      `).join('\n')}
    }


    // ==== 页面名称 -> 页面路径 ====
    const pageNameToPath = {
      ${syntheticRoutes.map(route => dedent`
        ${route.names.page}: ${JSON.stringify(route.path)},
      `).join('\n')}
    }


    // ==== 路由辅助函数 ====
    export function navigateTo<TPageName extends IPageName>(
      pageName: TPageName,
      ...query: IfAny<
        IPageNameToQueryTypes[TPageName],
        [],
        IfNever<
          RequiredKeys<IPageNameToQueryTypes[TPageName]>,
          [IPageNameToQueryTypes[TPageName]?],
          [IPageNameToQueryTypes[TPageName]]
        >
      >
    ) {
      // @ts-ignore
      history.push({
        pathname: pageNameToPath[pageName],
        query: {
          __query__: JSON.stringify(query[0]),
        },
      })
    }

    export function redirectTo<TPageName extends IPageName>(
      pageName: TPageName,
      ...query: IfAny<
        IPageNameToQueryTypes[TPageName],
        [],
        IfNever<
          RequiredKeys<IPageNameToQueryTypes[TPageName]>,
          [IPageNameToQueryTypes[TPageName]?],
          [IPageNameToQueryTypes[TPageName]]
        >
      >
    ) {
      // @ts-ignore
      history.replace({
        pathname: pageNameToPath[pageName],
        query: {
          __query__: JSON.stringify(query[0]),
        },
      })
    }

    export function navigateBack(delta: number = 1) {
      history.go(-delta)
    }

    export function navigateForward(delta: number = 1) {
      history.go(delta)
    }

    export function useQuery<TPageName extends IPageName>(pageName: TPageName): IPageNameToQueryTypes[TPageName] {
      // @ts-ignore
      const { query } = useLocation()
      const parsedQuery = useMemo(
        () => {
          try {
            return query.__query__
              ? JSON.parse(query.__query__)
              : {}
          } catch (err) {
            return {}
          }
        },
        [query.__query__],
      )
      return parsedQuery
    }
  `
}
