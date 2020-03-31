import {getNormalizedQuery, queryTypes} from './runtime'

const pageQueryTypes = {
  id: queryTypes.number(),
  pid: queryTypes.number().enum([1, 2, 5]),
  gender: queryTypes.string().enum(['male', 'female']).optional('male'),
  all: queryTypes.boolean(),
  noName: queryTypes.boolean().optional(),
  p2id: queryTypes.number().enum([1, 2]),
}

test('表现正常', () => {
  expect(getNormalizedQuery({
    id: '12',
  }, pageQueryTypes)).toMatchObject({
    id: 12,
  })
})
