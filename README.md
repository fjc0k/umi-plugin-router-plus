# umi-plugin-router-plus ![Node CI](https://github.com/fjc0k/umi-plugin-router-plus/workflows/Node%20CI/badge.svg) [![codecov](https://codecov.io/gh/fjc0k/umi-plugin-router-plus/branch/master/graph/badge.svg)](https://codecov.io/gh/fjc0k/umi-plugin-router-plus)

一款 [Umi 3](https://github.com/umijs/umi) 插件，为你带来**类型友好**的**页面参数的定义、传递与获取**。

---

<!-- TOC depthFrom:2 -->

- [安装](#安装)
- [启用方式](#启用方式)
- [使用介绍](#使用介绍)
  - [定义页面参数](#定义页面参数)
  - [获取页面参数](#获取页面参数)
  - [传递页面参数](#传递页面参数)
- [API 列表](#api-列表)
  - [navigateTo(pageName, params)](#navigatetopagename-params)
  - [redirectTo(pageName, params)](#redirecttopagename-params)
  - [navigateBack(delta)](#navigatebackdelta)
  - [navigateForward(delta)](#navigateforwarddelta)
  - [usePageParams(pageName)](#usepageparamspagename)
  - [usePageQuery()](#usepagequery)
  - [useQuery()](#usequery)
- [页面名称](#页面名称)
- [许可](#许可)

<!-- /TOC -->

## 安装

```bash
# npm
npm i umi-plugin-router-plus -D

# or yarn
yarn add umi-plugin-router-plus -D

# or pnpm
pnpm add umi-plugin-router-plus -D
```

## 启用方式

默认开启。

## 使用介绍

### 定义页面参数

在页面文件内定义 `Params` 类型，并将之导出即可：

```tsx
// src/pages/test.tsx

export interface Params {
  id: number
  enabled?: boolean
  gender: 'male' | 'female'
  name: string
  tags?: string[]
}
```

### 获取页面参数

在页面文件内定义好页面参数后，只需在页面组件内使用 `usePageParams` 即可获取：

```tsx
// src/pages/test.tsx
import React from 'react'
import { usePageParams } from 'umi'

export interface Params {
  id: number
  enabled?: boolean
  gender: 'male' | 'female'
  name: string
  tags?: string[]
}

export default function () {
  const {
    id,
    enabled = false, // 指定默认值
    gender,
    name,
    tags = [],
  } = usePageParams('Test')

  return <div>id is: {id}</div>
}
```

### 传递页面参数

见下：[API 列表](#api-列表)。

## API 列表

### navigateTo(pageName, params)

```ts
import { navigateTo } from 'umi'

navigateTo('Index')
navigateTo('User', { id: 2 })
```

保留当前页面，跳转至某个页面，和 `history.push` 效果一致。

### redirectTo(pageName, params)

```ts
import { redirectTo } from 'umi'

redirectTo('Index')
redirectTo('User', { id: 2 })
```

关闭当前页面，跳转至某个页面，和 `history.replace` 效果一致。

### navigateBack(delta)

```ts
import { navigateBack } from 'umi'

navigateBack()
navigateBack(2)
```

关闭当前页面，返回上一页面或多级页面，和 `history.goBack` 效果一致。

### navigateForward(delta)

```ts
import { navigateForward } from 'umi'

navigateForward()
navigateForward(2)
```

保留当前页面，前进到下一页面或多级页面，和 `history.goForward` 效果一致。

### usePageParams(pageName)

```ts
import { usePageParams } from 'umi'

const { id } = usePageParams('User')
```

获取传给页面的参数，**会继承所有父 layout 页面定义的参数**。

### usePageQuery()

```ts
import { usePageQuery } from 'umi'

const { source } = usePageQuery<{
  source: string
}>()
```

获取传给页面的 query。

### useQuery()

同 `usePageQuery`，不再推荐使用，未来版本会被移除。

## 页面名称

页面名称会根据路由的 `path` 自动生成，如果程序没有提示你页面名称重复，大可不必深究。

比如，页面路径 `/user/detail` 生成的页面名称为 `UserDetail`。

## 许可

Jay Fong (c) MIT
