import { IRoute } from 'umi'

// ref: https://stackoverflow.com/questions/58216298/how-to-omit-keystring-any-from-a-type-in-typescript
type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends { [_ in keyof T]: infer U } ? U : never

export interface ISyntheticRoute extends Pick<IRoute, KnownKeys<IRoute>> {
  /** 页面名称 */
  pageName: string,
  /** 页面参数类型的名称 */
  pageParamsTypesName: string,
}
