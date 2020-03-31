import { flatRoutes, getRouteName } from './utils'
import { IApi } from 'umi'
import { ISyntheticRoute } from './types'
import { makeExports } from './templates'
import { PLUGIN_ID, PLUGIN_KEY } from './consts'

export default function (api: IApi) {
  api.describe({
    key: PLUGIN_KEY,
    enableBy: api.EnableBy.register,
  })

  api.onGenerateFiles(async () => {
    const routes = flatRoutes(await api.getRoutes())
    const usedNames = new Map<ISyntheticRoute['pageName'], ISyntheticRoute['path']>()
    const syntheticRoutes: ISyntheticRoute[] = routes.map(route => {
      const routeName = getRouteName(route)
      /* istanbul ignore if */
      if (usedNames.has(routeName)) {
        throw new Error(api.utils.chalk.red(`页面 ${route.path} 的名称 ${routeName} 与 ${usedNames.get(routeName)} 页面重复，请保证二者不同且全局唯一！`))
      }
      else {
        usedNames.set(routeName, route.path)
      }
      return {
        ...route,
        pageName: routeName,
        pageParamsTypesName: `I${routeName}ParamsTypes`,
      }
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
