import {IRoute} from 'umi'
import {Key} from 'path-to-regexp'

export interface INormalizedParam extends Key {
  originalName: string,
  jsType: StringConstructor | NumberConstructor | BooleanConstructor | [StringConstructor] | [NumberConstructor] | [BooleanConstructor],
  tsType: string,
}

export interface INormalizedRoute extends IRoute {
  name: string,
  params: INormalizedParam[],
  paramsTypeName: string,
}

export interface IPluginOptions {
  /**
   * 是否将路由路径中的 `$` 号替换为 `:` 号。
   *
   * @default false
   */
  transformDollarSignToColonOnRoutePaths?: boolean,
}
