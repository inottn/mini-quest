# 快速上手

## 介绍

MiniQuest 是一个 Axios API 风格的小程序 HTTP 请求库，适配多个小程序平台，支持拦截器、转换器、请求锁、缓存、轮询、错误重试等功能。

## 支持的小程序

::: tip
如果你使用的是 taro 或 uni-app，只要编译后的小程序平台支持，就可以使用。
:::

| 微信 | 支付宝 | 百度 | 抖音 | QQ  | 钉钉 |
| :--: | :----: | :--: | :--: | :-: | :--: |
|  ✅  |   ✅   |  ✅  |  ✅  | ✅  |  ✅  |

## 特性

- 使用 TypeScript 编写，提供完整的类型定义
- 支持 创建多个实例
- 支持 校验状态码
- 支持 请求／响应拦截器
- 支持 转换请求和响应数据
- 支持 请求锁
- 支持 轮询
- 支持 上传／下载
- 支持 自定义适配器
- 适配 多端小程序（微信、支付宝、百度、抖音等）

## 安装

用你喜欢的包管理器安装 `miniquest`

::: tip
部分小程序平台在安装后还需要构建 **npm** 包，有关的详细信息，请参阅对应小程序平台的文档。
:::

::: code-group

```bash [npm]
npm i @inottn/miniquest
```

```bash [yarn]
yarn add @inottn/miniquest
```

```bash [pnpm]
pnpm add @inottn/miniquest
```

:::

## 引入

推荐使用 ESM 方式引入，默认导出了一个使用默认配置创建的 `MiniQuest` 的实例：

```js
import miniquest from '@inottn/miniquest';
```

因为是默认导出，你也可以使用任何你习惯的命名，例如：

```js
import axios from '@inottn/miniquest';
import http from '@inottn/miniquest';
```

如果有需要，你也可以使用自定义配置新建一个实例：

```js
import { create } from '@inottn/miniquest';

const miniquest = create({
  baseURL: 'https://base.domain.com',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
});
```

引入之后，就可以使用对应实例发起网络请求了：

```js
miniquest({
  url: '/user?id=1',
});
```
