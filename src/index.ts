import { getRouteName, walkRoutes } from './utils'
import { IApi, utils } from 'umi'
import { ISyntheticRoute } from './types'
import { makeExports } from './templates'
import { PLUGIN_ID, PLUGIN_KEY } from './consts'

export default function (api: IApi) {
  api.describe({
    key: PLUGIN_KEY,
    enableBy: api.EnableBy.register,
  })

  api.onGenerateFiles(async () => {
    const routes = await api.getRoutes()
    const usedNames = new Map<
      ISyntheticRoute['pageName'],
      ISyntheticRoute['path']
    >()
    walkRoutes(routes, (route, parentRoute) => {
      if (route.path === '/') {
        const dupeRouteIndexes: number[] = []
        parentRoute?.routes?.forEach((route, index) => {
          if (route.path && /^\/index(\.html)?$/i.test(route.path)) {
            dupeRouteIndexes.push(index)
          }
        })
        dupeRouteIndexes.sort((a, b) => b - a)
        for (const i of dupeRouteIndexes) {
          parentRoute!.routes!.splice(i, 1)
        }
      }
    })
    const syntheticRoutes = walkRoutes(routes, (route, parentRoute) => {
      const routeName = getRouteName(route)
      /* istanbul ignore if */
      if (usedNames.has(routeName)) {
        throw new Error(
          api.utils.chalk.red(
            `页面 ${route.path} 的名称 ${routeName} 与 ${usedNames.get(
              routeName,
            )} 页面重复，请保证二者不同且全局唯一！`,
          ),
        )
      } else {
        usedNames.set(routeName, route.path)
      }
      return {
        ...route,
        pageName: routeName,
        pageOwnParamsTypesName: `I${routeName}OwnParams`,
        parentPageName: parentRoute && getRouteName(parentRoute),
        isLayout: !utils.lodash.isEmpty(route.routes),
      } as ISyntheticRoute
    })
    api.writeTmpFile({
      path: `${PLUGIN_ID}/exports.ts`,
      content: makeExports(syntheticRoutes),
    })
  })

  api.addUmiExports(() => {
    return {
      exportAll: true,
      source: `../${PLUGIN_ID}/exports`,
    }
  })
}
