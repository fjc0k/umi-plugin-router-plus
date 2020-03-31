# umi-plugin-router-plus ![Node CI](https://github.com/fjc0k/umi-plugin-router-plus/workflows/Node%20CI/badge.svg) [![codecov](https://codecov.io/gh/fjc0k/umi-plugin-router-plus/branch/master/graph/badge.svg)](https://codecov.io/gh/fjc0k/umi-plugin-router-plus)

一款 [Umi 3](https://github.com/umijs/umi) 插件，为你带来**类型友好**的**基于 query string** 的**页面参数的定义、传递与获取**。

----

<!-- TOC depthFrom:2 -->

- [安装](#安装)
- [启用方式](#启用方式)
- [使用介绍](#使用介绍)
  - [定义页面参数](#定义页面参数)
  - [获取页面参数](#获取页面参数)
- [API 列表](#api-列表)
    - [navigateTo(pageName, query)](#navigatetopagename-query)
    - [redirectTo(pageName, query)](#redirecttopagename-query)
    - [navigateBack(delta)](#navigatebackdelta)
    - [navigateForward(delta)](#navigateforwarddelta)
    - [useQuery(pageName)](#usequerypagename)
- [页面名称(pageName)如何定义](#页面名称pagename如何定义)
- [许可](#许可)

<!-- /TOC -->

## 安装

```bash
# yarn
yarn add umi-plugin-router-plus -D

# npm
npm i umi-plugin-router-plus -D
```

## 启用方式

默认开启。

## 使用介绍

### 定义页面参数

在页面文件内定义 `Query` 类型，并将之导出即可：

```tsx
// src/pages/test.tsx

export interface Query {
  id: number,
  enabled?: boolean,
  gender: 'male' | 'female',
  name: string,
}
```

### 获取页面参数

在页面文件内定义好页面参数后，只需在页面组件内使用 `useQuery` 即可获取：

```tsx
// src/pages/test.tsx
import React from 'react'
import { useQuery } from 'umi'

export interface Query {
  id: number,
  enabled?: boolean,
  gender: 'male' | 'female',
  name: string,
}

export default function () {
  const {
    id,
    enabled = false, // 指定默认值
    gender,
    name,
  } = useQuery('Test')

  return (
    <div>id is: {id}</div>
  )
}
```

`useQuery` 会自动转换传入的页面参数值的类型：

- 参数值为字符串 `true`，则表示这是一个布尔值 `true`；
- 参数值为字符串 `false`，则表示这是一个布尔值 `false`；
- 参数值为数值字符串，则表示这是一个数字；
- 参数值为其他字符串，则原样返回。

因此，你应避免使用 `true`

## API 列表

#### navigateTo(pageName, query)

```ts
import { navigateTo } from 'umi'

navigateTo('Index')
navigateTo('User', { id: 2 })
```

保留当前页面，跳转至某个页面，和 `history.push` 效果一致。

#### redirectTo(pageName, query)

```ts
import { redirectTo } from 'umi'

redirectTo('Index')
redirectTo('User', { id: 2 })
```

关闭当前页面，跳转至某个页面，和 `history.replace` 效果一致。

#### navigateBack(delta)

```ts
import { navigateBack } from 'umi'

navigateBack()
navigateBack(2)
```

关闭当前页面，返回上一页面或多级页面，和 `history.goBack` 效果一致。

#### navigateForward(delta)

```ts
import { navigateForward } from 'umi'

navigateForward()
navigateForward(2)
```

保留当前页面，前进到下一页面或多级页面，和 `history.goForward` 效果一致。

#### useQuery(pageName)

```ts
import { useQuery } from 'umi'

const { id } = useQuery('User')
```

在页面组件中获取传入的参数值，和 `useParams` 效果一致，但类型提示更友好，参数值也会根据参数的类型定义格式化，拿来即用，无需转换。


## 页面名称(pageName)如何定义

页面名称会根据路由的 `path` 自动生成，如果程序没有提示你页面名称重复，大可不必深究。

## 许可

Jay Fong (c) MIT
