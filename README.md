# umi-plugin-router-plus ![Node CI](https://github.com/fjc0k/umi-plugin-router-plus/workflows/Node%20CI/badge.svg) [![codecov](https://codecov.io/gh/fjc0k/umi-plugin-router-plus/branch/master/graph/badge.svg)](https://codecov.io/gh/fjc0k/umi-plugin-router-plus)

为 [Umi 3](https://github.com/umijs/umi) 带来增强的路由体验。

该插件会根据项目的路由配置自动生成类型友好的样板代码，包括**路由跳转函数**、**页面参数获取 Hook**等，同时还支持**为路径参数添加类型定义**。

![007RpWuggy1gcmugi86dlj30q60sowex](https://tva1.sinaimg.cn/mw690/007RpWuggy1gcmugi86dlj30q60sowex)

----

<!-- TOC depthFrom:2 -->

- [安装](#安装)
- [启用](#启用)
- [配置](#配置)
- [给参数加类型](#给参数加类型)
  - [布尔(boolean)](#布尔boolean)
  - [数字(number)](#数字number)
  - [字符串(string)](#字符串string)
  - [枚举(enum)](#枚举enum)
- [类型友好的路由 API](#类型友好的路由-api)
  - [navigateTo(pageName, pageParams)](#navigatetopagename-pageparams)
  - [redirectTo(pageName, pageParams)](#redirecttopagename-pageparams)
  - [navigateBack(delta)](#navigatebackdelta)
  - [navigateForward(delta)](#navigateforwarddelta)
  - [usePageParams(pageName)](#usepageparamspagename)
- [页面名称(pageName)如何定义](#页面名称pagename如何定义)
  - [在约定式路由下](#在约定式路由下)
  - [在配置式路由下](#在配置式路由下)
- [许可](#许可)

<!-- /TOC -->

## 安装

```bash
# yarn
yarn add umi-plugin-router-plus -D

# npm
npm i umi-plugin-router-plus -D
```

## 启用

打开 Umi 的配置文件：

```ts
import {defineConfig} from 'umi'
import {defineConfig as defineRouterPlusConfig} from 'umi-plugin-router-plus'

export default defineConfig({
  // ...其他配置...
  ...defineRouterPlusConfig({
    transformDollarSignToColonOnRoutePaths: true
  })
})
```

## 配置

- **transformDollarSignToColonOnRoutePaths**
  - 类型: `boolean`
  - 默认值: `false`
  - 说明: 是否将路由路径上的 `$` 符号替换为 `:` 符号，开启后可以在约定式路由下定义多个参数，比如这是一个定义了多个参数的页面文件的名称：`$id.$type.$page.tsx`。

## 给参数加类型

我们约定：**在参数名称后面加上双下划线(__)开启类型定义**。

目前支持布尔(`boolean`)、数字(`number`)、字符串(`string`)以及枚举(`enum`)。

### 布尔(boolean)

布尔类型用字符 `b` 表示，比如：`[isClose__b].tsx`，表示 `isClose` 是一个布尔类型的值。

### 数字(number)

数字类型用字符 `n` 表示，比如：`[id__n].tsx`，表示 `id` 是一个数字类型的值。

### 字符串(string)

字符串类型用字符 `s` 表示，它是默认类型，一般不必手动指定，比如：`[type__s].tsx`，表示 `type` 是一个字符串类型的值。

### 枚举(enum)

枚举使用单下划线(_)分割每一个值，比如：`[gender__female_male].tsx`，表示 `gender` 要么是 `female`、要么是 `male`。

我们还可以将枚举和数字类型联合使用，比如：`[state__n__0_1_2_3]`，表示 `state` 是一个数字类型，但它的值只可能是 `0`、`1`、`2`、`3` 之一。

## 类型友好的路由 API

### navigateTo(pageName, pageParams)

```ts
import { navigateTo } from 'umi'

navigateTo('Index')
navigateTo('User', {id: 2})
```

保留当前页面，跳转至某个页面，和 `history.push` 效果一致。

### redirectTo(pageName, pageParams)

```ts
import { redirectTo } from 'umi'

redirectTo('Index')
redirectTo('User', {id: 2})
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

const {id} = usePageParams('User')
```

在页面组件中获取传入的参数值，和 `useParams` 效果一致，但类型提示更友好，参数值也会根据参数的类型定义格式化，拿来即用，无需转换。


## 页面名称(pageName)如何定义

页面名称会根据路由的 `path` 自动生成，如果程序没有提示你页面名称重复，大可不必深究。

你也可以手动定义页面名称，但必须保证其全局唯一：

### 在约定式路由下

你可以通过 Umi 提供的扩展路由属性定义页面名称：

```tsx
function User() {
  return <h1>User</h1>
}

User.pageName = 'User'

export default User
```

### 在配置式路由下

你只需为路由指定 `name` 或 `pageName` 属性即可：

```ts
[
  {
    path: '/user/:id__n',
    name: 'User', 
    component: './user'
  }
]
```

## 许可

Jay Fong (c) MIT
