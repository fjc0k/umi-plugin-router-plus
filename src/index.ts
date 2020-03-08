import {existsSync, readFileSync} from 'fs'
import {flatRoutes, getNormalizedRouteName, getNormalizedRouteParams, walkRoutes} from './utils'
import {IApi, IRoute} from 'umi'
import {INormalizedRoute, IPluginOptions} from './types'
import {join} from 'path'
import {makeExports} from './templates'
import {PLUGIN_ID, PLUGIN_KEY} from './consts'

export function defineConfig(options: IPluginOptions = {}) {
  return {
    [PLUGIN_KEY]: options,
  }
}

export default function (api: IApi) {
  api.describe({
    key: PLUGIN_KEY,
    enableBy: api.EnableBy.config,
    config: {
      schema(joi) {
        return joi.object<IPluginOptions>({
          transformDollarSignToColonOnRoutePaths: joi.boolean(),
        })
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
  })

  const {
    transformDollarSignToColonOnRoutePaths = false,
  }: IPluginOptions = api.userConfig[PLUGIN_KEY] || {}

  if (transformDollarSignToColonOnRoutePaths) {
    api.modifyRoutes(routes => {
      return walkRoutes(routes, route => {
        route.path = route.path?.replace(/\$/g, ':')
        return route
      })
    })
  }

  api.onGenerateFiles(async () => {
    // ==== exports.ts ====
    const routes = flatRoutes(await api.getRoutes())
    const usedNames = new Map<INormalizedRoute['name'], IRoute['path']>()
    const normalizedRoutes: INormalizedRoute[] = routes.map(route => {
      const name = getNormalizedRouteName(route)
      if (usedNames.has(name)) {
        throw new Error(api.utils.chalk.red(`页面 ${route.path} 的名称 ${name} 与 ${usedNames.get(name)} 页面重复，请保证二者不同且全局唯一！`))
      } else {
        usedNames.set(name, route.path)
      }
      const params = getNormalizedRouteParams(route)
      const paramsIsOptional = params.every(param => param.optional)
      const paramsTypeName = `I${name}Params`
      return {
        ...route,
        name: name,
        params: params,
        paramsIsOptional: paramsIsOptional,
        paramsTypeName: paramsTypeName,
      }
    })
    api.writeTmpFile({
      path: `${PLUGIN_ID}/exports.ts`,
      content: makeExports(normalizedRoutes),
    })

    // ==== types.ts ====
    // 发布版
    const typesDts = join(__dirname, 'types.d.ts')
    // 本地版
    const typesTs = join(__dirname, 'types.ts')
    api.writeTmpFile({
      path: `${PLUGIN_ID}/types.ts`,
      content: existsSync(typesDts)
        ? readFileSync(typesDts, 'utf8')
        : existsSync(typesTs)
          ? readFileSync(typesTs, 'utf8')
          : '',
    })
  })

  api.addUmiExports(() => {
    return {
      exportAll: true,
      source: `../${PLUGIN_ID}/exports`,
    }
  })
}
