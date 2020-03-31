// ==== 运行时工具 ====
export class QueryTypes<TValueType = string, TEnum = never, TOptional extends boolean = false, TDefault extends boolean = false> {
  private type: StringConstructor | NumberConstructor | BooleanConstructor = String

  private values: TValueType[] = []

  private defaultValue: TValueType | undefined

  string() {
    this.type = String
    return this as any as QueryTypes<[TEnum] extends [never] ? string : TEnum, TEnum, TOptional, TDefault>
  }

  number() {
    this.type = Number
    return this as any as QueryTypes<[TEnum] extends [never] ? number : TEnum, TEnum, TOptional, TDefault>
  }

  boolean() {
    this.type = Boolean
    return this as any as QueryTypes<boolean, TEnum, TOptional, TDefault>
  }

  enum<T extends TValueType>(values: T[]) {
    this.values = values
    return this as any as QueryTypes<TValueType extends boolean ? TValueType : T, TValueType extends boolean ? never : T, TOptional, TDefault>
  }

  optional(): QueryTypes<TValueType | undefined, TEnum, true, false>

  // eslint-disable-next-line no-dupe-class-members
  optional<T extends TValueType>(defaultValue: TValueType): QueryTypes<TValueType, TEnum, true, true>

  // eslint-disable-next-line no-dupe-class-members
  optional(defaultValue?: any) {
    this.defaultValue = defaultValue
    return this as any
  }

  private parse(originalValue: string): TValueType {
    let value = !originalValue ? this.defaultValue : (
      this.type === Boolean
        ? originalValue === 'true'
        : this.type === Number
          ? Number(originalValue)
          : originalValue
    )
    if (this.values.length > 0) {
      value = this.values.indexOf(value as any) > -1
        ? value
        : this.values[0]
    }
    return value as any
  }
}

export const queryTypes = {
  string() {
    return new QueryTypes().string()
  },
  number() {
    return new QueryTypes().number()
  },
  boolean() {
    return new QueryTypes().boolean()
  },
}

export function getNormalizedQuery<T extends IQueryType>(query: Record<any, any>, queryType: T): ExtractInternalQueryType<T> {
  const normalizedQuery = {} as any as ExtractInternalQueryType<T>
  for (const key of Object.keys(query)) {
    if (queryType[key]) {
      (normalizedQuery as any)[key] = (queryType[key] as any).parse(query[key])
    }
  }
  return normalizedQuery
}

// ==== 辅助类型 ====
export type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N

export type NonNever<T extends {}> = Pick<T, {[K in keyof T]: T[K] extends never ? never : K }[keyof T]>

export type IQueryType = Record<string, QueryTypes<any, any, any, any>>

export type ExtractExternalQueryType<T extends IQueryType> = (
  NonNever<{
    [K in keyof T]: T[K] extends QueryTypes<infer IValueType, any, infer IOptional, any>
      ? (IOptional extends true ? never : IValueType)
      : never
  }> & NonNever<{
    [K in keyof T]?: T[K] extends QueryTypes<infer IValueType, any, infer IOptional, any>
      ? (IOptional extends true ? IValueType : never)
      : never
  }>
)

export type ExtractInternalQueryType<T extends IQueryType> = (
  NonNever<{
    [K in keyof T]: T[K] extends QueryTypes<infer IValueType, any, infer IOptional, infer IDefault>
      ? (IOptional extends true ? (IDefault extends true ? IValueType : never): IValueType)
      : never
  }> & NonNever<{
    [K in keyof T]?: T[K] extends QueryTypes<infer IValueType, any, infer IOptional, infer IDefault>
      ? (IOptional extends true ? (IDefault extends true ? never : IValueType): never)
      : never
  }>
)
