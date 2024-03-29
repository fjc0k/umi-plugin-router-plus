import { dedent, TreeData } from 'vtils'
import { flattenRoutes } from './utils'
import { ISyntheticRoute } from './types'

export function makeExports(syntheticRoutes: ISyntheticRoute[]): string {
  const flatSyntheticRoutes = flattenRoutes(syntheticRoutes).filter(
    route => !!route.component,
  )
  const pageNamesTree = new TreeData(syntheticRoutes, {
    childrenPropName: 'routes',
  }).pickNodeProps(['pageName', 'routes'])
  const pageNameToChildrenPageNames = flatSyntheticRoutes.reduce<
    Record<string, string[]>
  >((res, item) => {
    const childrenPageNames: string[] = []
    let pageNameDepth = -1
    pageNamesTree.traverseDFS(_ => {
      if (_.node.pageName === item.pageName) {
        pageNameDepth = _.depth
      } else if (pageNameDepth !== -1) {
        if (_.depth <= pageNameDepth) {
          _.exit()
        } else {
          childrenPageNames.push(_.node.pageName)
        }
      }
    })
    res[item.pageName] = childrenPageNames
    return res
  }, {})
  return dedent`
    /* eslint-disable */
    // @ts-nocheck

    import { useMemo } from 'react'
    import { history, useLocation } from 'umi'


    // =============== 辅助类型 ===============
    /**
     * 检测一个类型是否是 \`any\`。
     *
     * @see https://stackoverflow.com/questions/55541275/typescript-check-for-the-any-type
     */
    type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N

    /**
     * 检测一个类型是否是 \`never\`。
     */
    type IfNever<T, Y, N> = [T] extends [never] ? Y : N

    /**
     * 返回 T 中必需的键。
     */
    type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T]

    /**
     * 合并 M 和 N。
     */
    type Merge<M, N> = [M, N] extends [never, never]
      ? never
      : [M] extends [never]
        ? N
        : [N] extends [never]
          ? M
          : Omit<M, Extract<keyof M, keyof N>> & N


    // =============== 页面名称 ===============
    /**
     * 普通页面的名称，即不是 layout 的页面。
     */
    export type INormalPageName = ${
      flatSyntheticRoutes
        .filter(route => !route.isLayout)
        .map(route => `'${route.pageName}'`)
        .join(' | ') || /* istanbul ignore next */ 'never'
    }

    /**
     * layout 页面的名称。
     */
    export type ILayoutPageName = ${
      flatSyntheticRoutes
        .filter(route => route.isLayout)
        .map(route => `'${route.pageName}'`)
        .join(' | ') || /* istanbul ignore next */ 'never'
    }

    /**
     * 页面的名称，包括普通页面和 layout 页面。
     */
    export type IPageName = INormalPageName | ILayoutPageName

    /**
     * 普通页面的名称列表。
     */
    export const normalPageNames: INormalPageName[] = [
      ${flatSyntheticRoutes
        .filter(route => !route.isLayout)
        .map(route => `'${route.pageName}',`)
        .join('\n')}
    ]

    /**
     * layout 页面的名称列表。
     */
    export const layoutPageNames: ILayoutPageName[] = [
      ${flatSyntheticRoutes
        .filter(route => route.isLayout)
        .map(route => `'${route.pageName}',`)
        .join('\n')}
    ]

    /**
     * 页面的名称列表。
     */
    export const pageNames: IPageName[] = [
      ${flatSyntheticRoutes.map(route => `'${route.pageName}',`).join('\n')}
    ]


    // =============== 页面自身参数 ===============
    ${flatSyntheticRoutes
      .map(
        route => dedent`
          // @ts-ignore
          import { Params as ${
            route.pageOwnParamsTypesName
          } } from ${JSON.stringify(route.component!.replace(/\.tsx?$/, ''))}
        `,
      )
      .join('\n')}


    // =============== 页面名称 -> 页面参数 ===============
    /**
     * 页面名称到页面自身参数的映射。
     *
     * 页面自身参数指页面自身定义的参数，不包括从 layout 继承的参数。
     */
    export interface IPageNameToPageOwnParams {
      ${flatSyntheticRoutes
        .map(
          route => dedent`
            ${route.pageName}: IfAny<${route.pageOwnParamsTypesName}, never, ${route.pageOwnParamsTypesName}>,
          `,
        )
        .join('\n')}
    }

    /**
     * 页面名称到页面参数的映射。
     *
     * 页面参数包括页面自身定义的参数，还包括从 layout 继承的参数。
     */
    export interface IPageNameToPageParams {
      ${flatSyntheticRoutes
        .map(
          route => dedent`
            ${route.pageName}: ${
            !route.parentPageName
              ? `IPageNameToPageOwnParams['${route.pageName}']`
              : `Merge<IPageNameToPageParams['${route.parentPageName}'], IPageNameToPageOwnParams['${route.pageName}']>`
          },
          `,
        )
        .join('\n')}
    }


    // =============== 页面名称 -> 页面路径 ===============
    /**
     * 页面名称到页面路径的映射。
     */
    export const pageNameToPagePath: Record<IPageName, string> = {
      ${flatSyntheticRoutes
        .map(
          route => dedent`
            ${route.pageName}: ${JSON.stringify(route.path)},
          `,
        )
        .join('\n')}
    }

    // =============== 页面路径 -> 页面名称 ===============
    /**
     * 页面路径到页面名称的映射。
     */
    export const pagePathToPageName: Record<string, IPageName> = {
      ${flatSyntheticRoutes
        .map(
          route => dedent`
            ${JSON.stringify(route.path)}: ${JSON.stringify(route.pageName)},
          `,
        )
        .join('\n')}
    }

    // =============== 页面名称 -> 子页面名称列表 ===============
    /**
     * 页面名称到子页面名称列表的映射。
     */
    export const pageNameToChildrenPageNames: Record<IPageName, IPageName[]> = ${JSON.stringify(
      pageNameToChildrenPageNames,
    )}


    // =============== 路由辅助函数 ===============
    /**
     * 保留当前页面，跳转至某个页面，和 \`history.push\` 效果一致。
     *
     * @param pageName 要跳转到的页面名称
     * @param params 要传递的页面参数
     */
    export function navigateTo<TPageName extends INormalPageName>(
      pageName: TPageName,
      ...params: IfNever<
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

    /**
     * 关闭当前页面，跳转至某个页面，和 \`history.replace\` 效果一致。
     *
     * @param pageName 要跳转到的页面名称
     * @param params 要传递的页面参数
     */
    export function redirectTo<TPageName extends INormalPageName>(
      pageName: TPageName,
      ...params: IfNever<
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

    /**
     * 关闭当前页面，返回上一页面或多级页面，和 \`history.goBack\` 效果一致。
     *
     * @param delta 要返回的页面层数，默认为 \`1\`
     */
    export function navigateBack(delta: number = 1) {
      history.go(-delta)
    }

    /**
     * 保留当前页面，前进到下一页面或多级页面，和 \`history.goForward\` 效果一致。
     *
     * @param delta 要前进的页面层数，默认为 \`1\`
     */
    export function navigateForward(delta: number = 1) {
      history.go(delta)
    }


    // =============== Hooks ===============
    /**
     * 获取传给页面的参数。
     */
    export function usePageParams(): Record<string, any>
    /**
     * 获取传给页面的参数。
     *
     * @param pageName 当前页面的名称
     */
    export function usePageParams<TPageName extends IPageName>(pageName: TPageName): IPageNameToPageParams[TPageName]
    export function usePageParams<TPageName extends IPageName>(pageName?: TPageName): IPageNameToPageParams[TPageName] {
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

    /**
     * 获取传给页面的 query。
     */
    export function usePageQuery<T extends Record<string, string> = Record<string, string>>(): T {
      // @ts-ignore
      const { query } = useLocation()
      return query
    }

    /**
     * 获取传给页面的 query。
     *
     * @deprecated 使用 usePageQuery 代替
     */
    export const useQuery = usePageQuery

    /**
     * 获取当前页面名称。
     */
    export function usePageName(): INormalPageName {
      // @ts-ignore
      const { pathname } = useLocation()
      return pagePathToPageName[pathname]
    }
  `
}
