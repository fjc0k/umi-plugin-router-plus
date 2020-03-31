import { flatRoutes, getRouteName } from './utils'
import { IRoute, utils } from 'umi'

const routes: IRoute[] = [
  {
    path: '1',
    routes: [
      {
        path: '1.1',
        routes: [],
      },
      {
        path: '1.2',
        routes: [
          {
            path: '1.2.1',
          },
        ],
      },
    ],
  },
  {
    path: '2',
  },
  {
    path: '3',
    routes: [],
  },
  {
    path: '4',
    routes: [
      {
        path: '4.1',
        routes: [
          {
            path: '4.1.1',
            routes: [
              {
                path: '4.1.1.1',
                routes: [
                  {
                    path: '4.1.1.1.1',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]

describe('flatRoutes', () => {
  test('表现正常', () => {
    const _routes = utils.lodash.cloneDeep(routes)
    expect(flatRoutes(_routes)).toMatchSnapshot('一级路由表')
  })
})

describe('getRouteName', () => {
  test('应去除 path 中的 .html 后缀', () => {
    expect(
      getRouteName({ path: 'isPath.html' }),
    ).toMatch('IsPath')
  })
  test('包含子路由时加上 Layout 后缀', () => {
    expect(
      getRouteName({ path: 'isPath.html', routes: []}),
    ).toMatch('IsPath')
    expect(
      getRouteName({ path: 'isPath.html', routes: [{}]}),
    ).toMatch('IsPathLayout')
  })
  test('基本名称为空时应将之设为 Index', () => {
    expect(
      getRouteName({ path: '/' }),
    ).toMatch('Index')
  })
})
