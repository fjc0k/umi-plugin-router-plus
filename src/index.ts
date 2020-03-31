import { existsSync, readFileSync } from 'fs'
import { flatRoutes, getRouteName } from './utils'
import { IApi } from 'umi'
import { ISyntheticRoute } from './types'
import { join } from 'path'
import { makeExports } from './templates'
import { PLUGIN_ID, PLUGIN_KEY } from './consts'

export default function (api: IApi) {
  api.describe({
    key: PLUGIN_KEY,
    enableBy: api.EnableBy.register,
  })

  api.onGenerateFiles(async () => {
    // ==== exports.ts ====
    const routes = flatRoutes(await api.getRoutes())
    const usedNames = new Map<ISyntheticRoute['name'], ISyntheticRoute['path']>()
    const syntheticRoutes: ISyntheticRoute[] = routes.map(route => {
      const routeName = getRouteName(route)
      if (usedNames.has(routeName)) {
        throw new Error(api.utils.chalk.red(`页面 ${route.path} 的名称 ${routeName} 与 ${usedNames.get(routeName)} 页面重复，请保证二者不同且全局唯一！`))
      }
      else {
        usedNames.set(routeName, route.path)
      }
      return {
        ...route,
        names: {
          page: routeName,
          QueryTypes: `I${routeName}QueryTypes`,
        },
      }
    })
    api.writeTmpFile({
      path: `${PLUGIN_ID}/exports.ts`,
      content: makeExports(syntheticRoutes),
    })

    // ==== runtime.ts ====
    const runtimeTs = join(__dirname, 'runtime.ts')
    const runtimeJs = join(__dirname, 'runtime.js')
    const runtimeDts = join(__dirname, 'runtime.d.ts')
    // 测试
    if (existsSync(runtimeTs)) {
      api.writeTmpFile({
        path: `${PLUGIN_ID}/runtime.ts`,
        content: readFileSync(runtimeTs, 'utf8'),
      })
    }
    // 正式
    /* istanbul ignore next */
    else {
      api.writeTmpFile({
        path: `${PLUGIN_ID}/runtime.js`,
        content: readFileSync(runtimeJs, 'utf8'),
      })
      api.writeTmpFile({
        path: `${PLUGIN_ID}/runtime.d.ts`,
        content: readFileSync(runtimeDts, 'utf8'),
      })
    }
  })

  api.addUmiExports(() => {
    return {
      exportAll: true,
      source: `../${PLUGIN_ID}/exports`,
    }
  })
}
