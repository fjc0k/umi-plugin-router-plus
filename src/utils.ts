import { utils } from 'umi'

interface IBaseRoute<T> {
  path?: string,
  routes?: T[],
}

/**
 * 将路由表转换为只有一级。
 *
 * @param routes 路由表
 */
export function flattenRoutes<T extends IBaseRoute<T>>(routes: T[]): T[] {
  return utils.lodash.flatten(
    routes.map(route => [
      route,
      ...flattenRoutes(route.routes || []),
    ]),
  )
}

/**
 * 遍历路由表。
 *
 * @param routes 路由表
 * @param cb 回调
 */
export function walkRoutes<T extends IBaseRoute<T>, X>(routes: T[], cb: (route: T, parent: T | undefined) => X, parent?: T): X[] {
  return routes.map(route => {
    const currentRoute = { ...route }
    if (!utils.lodash.isEmpty(currentRoute.routes)) {
      currentRoute.routes = walkRoutes(currentRoute.routes!, cb, currentRoute) as any
    }
    return cb(currentRoute, parent)
  })
}

/**
 * 获取路由名称。
 *
 * - 将 `path` 去除 .html 后缀作为原始名称；
 * - 对获取到的原始名称做 `PascalCase` 转换后作为基本名称，若其为空，则设为 Index；
 * - 判断是否有子路由，是则将后缀设为 `Layout`；
 * - 将基本名称和后缀相加作为路由名称返回。
 *
 * @param route 路由信息
 */
export function getRouteName(route: IBaseRoute<any>): string {
  const originalName = (route.path || /* istanbul ignore next */ '').replace(/\.html?$/i, '')
  const baseName = utils.lodash.upperFirst(utils.lodash.camelCase(originalName)) || 'Index'
  const suffix = utils.lodash.isEmpty(route.routes) ? '' : 'Layout'
  const routeName = `${baseName}${suffix}`
  return routeName
}
