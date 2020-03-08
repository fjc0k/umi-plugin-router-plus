import {flatRoutes, getNormalizedRouteName, getNormalizedRouteParams, walkRoutes} from './utils'
import {IRoute, utils} from 'umi'
import {omit} from 'vtils'

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

describe('walkRoutes', () => {
  test('表现正常', () => {
    const _routes = utils.lodash.cloneDeep(routes)
    expect(walkRoutes(_routes, route => {
      route.path += '_ok'
      return route
    })).toMatchSnapshot('遍历路由表')
  })
})

describe('getNormalizedRouteName', () => {
  const route: IRoute = {
    pageName: 'isPageName',
    name: 'isName',
    path: 'isPath',
  }
  test('pageName 优先', () => {
    expect(
      getNormalizedRouteName(route),
    ).toMatch(
      utils.lodash.upperFirst(route.pageName),
    )
  })
  test('name 次之', () => {
    expect(
      getNormalizedRouteName(omit(route, ['pageName'])),
    ).toMatch(
      utils.lodash.upperFirst(route.name),
    )
  })
  test('path 最后', () => {
    expect(
      getNormalizedRouteName(omit(route, ['pageName', 'name'])),
    ).toMatch(
      utils.lodash.upperFirst(route.path),
    )
  })
  test('应去除 path 中的 .html 后缀', () => {
    expect(
      getNormalizedRouteName({path: 'isPath.html'}),
    ).toMatch('IsPath')
  })
  test('包含子路由时加上 Layout 后缀', () => {
    expect(
      getNormalizedRouteName({path: 'isPath.html', routes: []}),
    ).toMatch('IsPath')
    expect(
      getNormalizedRouteName({path: 'isPath.html', routes: [{}]}),
    ).toMatch('IsPathLayout')
  })
  test('基本名称为空时应将之设为 Index', () => {
    expect(
      getNormalizedRouteName({path: '/'}),
    ).toMatch('Index')
  })
})

describe('getNormalizedRouteParams', () => {
  test('表现正常', () => {
    expect(
      getNormalizedRouteParams({}),
    ).toMatchSnapshot('没有 path')
    expect(
      getNormalizedRouteParams({path: ''}),
    ).toMatchSnapshot('path 为空')
    expect(
      getNormalizedRouteParams({path: '/sss/ssk'}),
    ).toMatchSnapshot('没有参数')
    expect(
      getNormalizedRouteParams({path: '/:sss/ssk'}),
    ).toMatchSnapshot('一个没有指定类型的参数')
    expect(
      getNormalizedRouteParams({path: '/:sss?/ssk'}),
    ).toMatchSnapshot('一个没有指定类型的可选参数')
    expect(
      getNormalizedRouteParams({path: '/:sss+/ssk'}),
    ).toMatchSnapshot('一个没有指定类型的重复参数')
    expect(
      getNormalizedRouteParams({path: '/:sss__n/ssk'}),
    ).toMatchSnapshot('一个指定类型为数字的参数')
    expect(
      getNormalizedRouteParams({path: '/:sss(\\d+)/ssk'}),
    ).toMatchSnapshot('一个通过正则指定类型为数字的参数')
    expect(
      getNormalizedRouteParams({path: '/:sss__n?/ssk'}),
    ).toMatchSnapshot('一个指定类型为数字的可选参数')
    expect(
      getNormalizedRouteParams({path: '/:sss__n+/ssk'}),
    ).toMatchSnapshot('一个指定类型为数字的重复参数')
    expect(
      getNormalizedRouteParams({path: '/:sss__b/ssk'}),
    ).toMatchSnapshot('一个指定类型为布尔的参数')
    expect(
      getNormalizedRouteParams({path: '/:sss__s/ssk'}),
    ).toMatchSnapshot('一个指定类型为字符串的参数')
    expect(
      getNormalizedRouteParams({path: '/:sss__1_2_3/ssk'}),
    ).toMatchSnapshot('一个没有指定类型但指定了枚举的参数')
    expect(
      getNormalizedRouteParams({path: '/:sss__n__1_2_3/ssk'}),
    ).toMatchSnapshot('一个指定类型为数字且指定了枚举的参数')
    expect(
      getNormalizedRouteParams({path: '/post/:id(\\d+)/:pid([0-9]+)/type_:type(1|2)_:name__s/:gender__f_m/:is_18__b?/:prop(x|y|0)'}),
    ).toMatchSnapshot('一个复杂的综合案例')
  })
})
