// ref: https://stackoverflow.com/questions/55541275/typescript-check-for-the-any-type
export type IfAny<T, Y, N> = 0 extends (1 & T) ? Y : N

export type IfNever<T, Y, N> = [T] extends [never] ? Y : N

// ref: https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T]

function isNumeric(value: string): boolean {
  const result = Number(value) - parseFloat(value)
  return result === result
}

export function parseQuery<T extends {}>(query: Record<string, string>): T {
  const parsedQuery: T = {} as any
  for (const key of Object.keys(query)) {
    (parsedQuery as any)[key] = (
      query[key] === 'true' // true
        ? true
        : query[key] === 'false' // false
          ? false
          : isNumeric(query[key]) // 数值
            ? Number(query[key])
            : query[key] // 其他
    )
  }
  return parsedQuery
}
