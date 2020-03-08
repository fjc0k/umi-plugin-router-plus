import {flat, includes, isEmpty, isObject, isString, memoize} from 'vtils'
import {INormalizedParam} from './types'
import {IRoute, utils} from 'umi'
import {Key, parse} from 'path-to-regexp'
import {PARAM_DESCRIPTOR_BOOLEAN_TYPE, PARAM_DESCRIPTOR_ENUM_SEPARATOR, PARAM_DESCRIPTOR_NUMBER_TYPE, PARAM_DESCRIPTOR_SEGMENT_SEPARATOR, PARAM_DESCRIPTOR_TYPES} from './consts'

const {upperFirst, camelCase} = utils.lodash

const parsePath = memoize(parse)

/**
 * 将路由表转换为只有一级。
 *
 * @param routes 路由表
 */
export function flatRoutes(routes: IRoute[]): IRoute[] {
  return flat(
    routes.map(route => [
      route,
      ...flatRoutes(route.routes || []),
    ]),
  )
}

/**
 * 遍历路由表。
 *
 * @param routes 路由表
 * @param cb 回调
 */
export function walkRoutes(routes: IRoute[], cb: (route: IRoute) => IRoute): IRoute[] {
  return routes.map(route => {
    route = cb(route)
    if (!isEmpty(route.routes)) {
      route.routes = walkRoutes(route.routes!, cb)
    }
    return route
  })
}

/**
 * 获取规范化的路由名称。
 *
 * - 获取 `pageName` 或 `name` 作为原始名称，没有则从 `path` 中解析；
 * - 对获取到的原始名称做 `PascalCase` 转换后作为基本名称，若其为空，则设为 Index；
 * - 判断是否有子路由，是则将后缀设为 `Layout`；
 * - 将基本名称和后缀相加作为规范化的路由名称返回。
 *
 * @param route 路由信息
 */
export function getNormalizedRouteName(route: IRoute): string {
  const originalName = route.pageName || route.name || (
    parsePath(route.path || '')
      .filter(isString)
      .join('')
      .replace(/\.html$/, '')
  )
  const baseName = upperFirst(camelCase(originalName)) || 'Index'
  const suffix = isEmpty(route.routes) ? '' : 'Layout'
  const routeName = `${baseName}${suffix}`
  return routeName
}

/**
 * 获取规范化的路由参数。
 *
 * @param route 路由信息
 */
export function getNormalizedRouteParams(route: IRoute): INormalizedParam[] {
  const tokens = parsePath(route.path || '')
  const params = (tokens.filter(isObject) as Key[]).map<INormalizedParam>(param => {
    return {
      ...param,
      ...getNormalizedRouteParamDescriptor(param as any),
      originalName: String(param.name),
    }
  })
  return params
}

/**
 * 获取规范化的路由参数描述。
 *
 * @param param 参数信息
 */
export const getNormalizedRouteParamDescriptor = memoize(
  (param: INormalizedParam): Pick<INormalizedParam, 'name' | 'jsType' | 'tsType'> => {
    const [name, ...descriptors] = String(param.name).split(PARAM_DESCRIPTOR_SEGMENT_SEPARATOR)

    let jsType: INormalizedParam['jsType']
    let tsType: INormalizedParam['tsType']

    // ==== 根据模式推测 ====
    // 数值
    if (param.pattern === '\\d+' || param.pattern === '[0-9]+') {
      jsType = Number
      tsType = 'number'
    }

    // 枚举数值
    else if (/^[0-9|]+$/.test(param.pattern)) {
      jsType = Number
      tsType = param.pattern.split('|')
        .map(value => Number(value))
        .join(' | ')
    }

    // 枚举
    else if (/^[A-Za-z0-9_|]+$/.test(param.pattern)) {
      jsType = String
      tsType = param.pattern.split('|')
        .map(value => JSON.stringify(value))
        .join(' | ')
    }

    // 默认
    else {
      jsType = String
      tsType = 'string'
    }

    // ==== 根据描述推测 ====
    if (descriptors.length > 0) {
      // == 类型 ==
      const type = descriptors.find(descriptor => includes(PARAM_DESCRIPTOR_TYPES as any, descriptor))
      // 布尔
      if (type === PARAM_DESCRIPTOR_BOOLEAN_TYPE) {
        jsType = Boolean
        tsType = 'boolean'
      }
      // 数字
      else if (type === PARAM_DESCRIPTOR_NUMBER_TYPE) {
        jsType = Number
        tsType = 'number'
      }
      // 字符串
      else {
        jsType = String
        tsType = 'string'
      }

      // == 枚举 ==
      const enums = (descriptors.find(descriptor => includes(descriptor, PARAM_DESCRIPTOR_ENUM_SEPARATOR)) || '').split(PARAM_DESCRIPTOR_ENUM_SEPARATOR)
      if (enums.length > 1) {
        // 数字
        if (jsType === Number) {
          tsType = enums.map(Number).join(' | ')
        }
        // 字符串
        else if (jsType === String) {
          tsType = enums.map(value => `'${value}'`).join(' | ')
        }
      }
    }

    // 重复
    jsType = param.repeat
      ? [jsType] as any
      : jsType
    tsType = param.repeat
      ? `${tsType} | Array<${tsType}>`
      : tsType

    return {name, jsType, tsType}
  },
  {
    serializer: param => `${param.name}###${param.repeat}###${param.pattern}`,
  },
)
