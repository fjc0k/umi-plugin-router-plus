import { parseQuery } from './runtime'

test('true', () => {
  expect(parseQuery({
    true: 'true',
  })).toEqual({
    true: true,
  })
})

test('false', () => {
  expect(parseQuery({
    false: 'false',
  })).toEqual({
    false: false,
  })
})

test('数值', () => {
  expect(parseQuery({
    1: '1',
    2: '2.0',
    3: '-48',
    4: '1e3',
  })).toEqual({
    1: 1,
    2: 2,
    3: -48,
    4: 1e3,
  })
})

test('其他', () => {
  expect(parseQuery({
    's': 's',
    '-': '-',
    '___': '___',
    '我们': '我们',
    'call120': 'call120',
  })).toEqual({
    's': 's',
    '-': '-',
    '___': '___',
    '我们': '我们',
    'call120': 'call120',
  })
})

test('综合', () => {
  expect(parseQuery({
    isMale: 'true',
    age: '40',
    name: 'Jane',
    isChinese: 'false',
  })).toEqual({
    isMale: true,
    age: 40,
    name: 'Jane',
    isChinese: false,
  })
})
