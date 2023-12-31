<p align="center">
  <img alt="logo" src="https://fastly.jsdelivr.net/npm/@inottn/assets/miniquest/logo.svg" width="420" style="margin-bottom: 10px;">
</p>

<p align="center">Axios API 风格的小程序 HTTP 请求库</p>

<p align="center">
  <img src="https://img.shields.io/npm/v/%40inottn%2Fminiquest" />
  <img src="https://img.shields.io/codecov/c/github/inottn/miniquest" />
  <img src="https://img.shields.io/bundlejs/size/%40inottn%2Fminiquest" />
  <img src="https://img.shields.io/badge/tree_shaking-supported-4c1" />
  <img src="https://img.shields.io/npm/l/%40inottn%2Fminiquest" />
</p>

## 特性

- 使用 TypeScript 编写，提供完整的类型定义
- 超过 95% 的单元测试覆盖率，提供稳定性保障
- 支持 创建多个实例
- 支持 [校验状态码](#校验状态码)
- 支持 [请求／响应拦截器](#拦截器)
- 支持 [转换请求和响应数据](#数据转换器)
- 支持 [请求锁](#请求锁)
- 支持 [轮询](#轮询)
- 支持 上传／下载
- 支持 自定义适配器
- 适配 多端小程序（微信、支付宝、百度、抖音等）

## 安装

使用 `pnpm` 安装:

```bash
pnpm add @inottn/miniquest
```

使用 `yarn` 或 `npm` 安装:

```bash
# 使用 yarn
yarn add @inottn/miniquest

# 使用 npm
npm i @inottn/miniquest
```

## 基本用例

默认导出了一个 `MiniQuest` 的实例：

```js
import miniquest from '@inottn/miniquest';

// 因为是默认导出，你也可以使用任何你习惯的命名，例如：
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

发送 GET 请求，`miniquest` 是 `miniquest.request` 的别名：

```js
miniquest({ url: '/user?id=1' });

miniquest('/user?id=1');

miniquest.request('/user?id=1');

miniquest.get('/user?id=1');

miniquest.get('/user', {
  data: { id: '1' },
});
```

发送 POST 请求：

```js
miniquest({
  url: '/user/create',
  methods: 'post',
  data: {
    name: 'xxx',
  },
});

miniquest('/user/create', {
  methods: 'post',
  data: {
    name: 'xxx',
  },
});

miniquest.post({
  url: '/user/create',
  data: {
    name: 'xxx',
  },
});
```

并发请求：

```js
Promise.all([miniquest.get('/user?id=1'), miniquest.get('/user?id=2')]).then(
  ([user1, user2]) => {
    // ...
  },
);
```

## 实例方法

为了方便起见，为常用且支持的请求方法提供了别名。不同小程序平台支持的请求方法会有所不同，以实际情况为准：

- miniquest.request(config)

- miniquest.request(url[, config])

- miniquest.delete(url[, config])

- miniquest.download(url[, config])

- miniquest.get(url[, config])

- miniquest.head(url[, config])

- miniquest.options(url[, config])

- miniquest.post(url[, config])

- miniquest.put(url[, config])

- miniquest.upload(url[, config])

注意这和 axios 提供的实例方法略有不同，如果你更习惯 axios 提供的传参方式，你也可以基于此再封装一层：

```js
export function post(url, data, config) {
  return miniquest.post(url, {
    ...config,
    data,
  });
}
```

## 请求配置

这些是创建请求时可以用的通用配置选项。只有 `url` 是必需的。如果没有指定 `method`，请求将默认使用 GET 方法。

实例配置和单次请求配置将会合并为最终请求时的配置，相同的选项，后者会覆盖前者。

由于运行小程序平台不同，平台特有的配置选项这里不再列出。你可以添加任何自定义字段，最终会透传给对应的小程序请求 API。

```js
{
  // 用于请求的服务器 URL，会和 baseURL 合并为最终发送的 URL
  url: '/user',

  // 创建请求时使用的方法，大小写均可
  method: 'get', // 默认值

  // baseURL 将自动加在 url 前面，除非 url 是一个绝对 URL
  baseURL: 'https://some-domain.com/api/',

  // 请求头
  headers: { 'X-Requested-With': 'XMLHttpRequest' },

  // 请求转换器，允许在向服务器发送请求前，修改请求数据
  transformRequest: null,

  // 响应转换器，允许在接收到响应后，修改响应数据
  transformResponse: null,

  // 是否跳过请求锁
  skipLock: false,

  // 允许自定义哪些 HTTP 状态码是有效的
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认值
  },

  // 允许自定义处理请求的适配器，接收本次请求的配置为参数，返回一个 promise 并提供一个有效的响应
  adapter: function (config) {
    /* ... */
  },
}
```

## 响应结构

一个请求的响应包含以下通用信息，以及对应小程序平台返回的响应信息。

```js
{
  // 由服务器提供的响应数据
  data: {},

  // 来自服务器响应的 HTTP 状态码
  status: 200,

  // 服务器的响应头
  headers: {},

  // 请求的配置信息
  config: {},
}
```

## 校验状态码

在微信小程序中，只要成功收到服务器返回，无论 HTTP 状态码是多少都会进入 success 回调。而在支付宝小程序中则还会校验 HTTP 状态码，例如 404、500、504 等状态码会触发 fail 回调。这个时候你可以使用 `validateStatus` 配置选项自定义哪些 HTTP 状态码是有效的，从而统一多端小程序行为。

```js
miniquest.get('/user/12345', {
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 这是默认配置
  },
});
```

## 拦截器

使用拦截器在请求发起之前和收到响应数据之后对配置或响应做一些处理，并且可以在拦截器中执行异步任务。

```js
// 添加请求拦截器
miniquest.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么，例如修改请求的配置、请求头、URL，添加认证信息等
    return config;
  },
  function (error) {
    // 根据上一个请求拦截器抛出的错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
miniquest.interceptors.response.use(
  function (response) {
    // 默认 2xx 范围内的 HTTP 状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 默认 请求失败或超出 2xx 范围的 HTTP 状态码都会触发该函数。
    // 对响应错误做点什么，例如设置全局错误处理
    return Promise.reject(error);
  },
);
```

### 多个拦截器

如果你添加了多个请求或响应拦截器，它们会按如下顺序执行：

1. 先添加的请求拦截器后执行，后添加的请求拦截器先执行。
2. 先添加的响应拦截器先执行，后添加的响应拦截器后执行。

## 数据转换器

`transformRequest` 允许在向服务器发送请求前，修改请求数据。它会在请求拦截器后执行：

```js
{
  transformRequest: [function (data, headers) {
    // 对发送的 data 进行任意转换处理，注意最后需要 return data
    return data;
  }],
}
```

`transformResponse` 允许在接收到响应后，修改响应数据。它会在响应拦截器前执行：

```js
{
  transformResponse: [function (data) {
    // 对接收的 data 进行任意转换处理，注意最后需要 return data
    return data;
  }],
}
```

### 拦截器和转换器的区别？

拦截器一般用于拦截和修改请求与响应的配置和信息，可以处理异步任务。而转换器一般用于对请求与响应的数据进行格式转换，只能进行同步操作。

## 请求锁

当请求锁定后，所有未发送的请求将依次等待，直到请求解锁时才能继续发送。请求锁提供了如下 API：

- `miniquest.lock()` 将请求锁定
- `miniquest.unlock()` 将请求解锁，锁定期间待处理的请求将依次执行
- `miniquest.interrupt()` 将请求解锁，锁定期间待处理的请求将中断并抛出错误
- `miniquest.isLocked()` 返回请求是否锁定

在发送请求时，通常为了安全考虑，会将用于标识用户身份的 token 放在 headers 中。如果在此时尚未获取到 token，则一般会在获取到 token 后再发送请求。然而，若存在多个请求同时并发的情况，可能会导致多次发送获取 token 的请求。

在这个场景我们有两个解决办法，一是使用缓存，让同时发送获取 token 的请求返回的都是一个请求。二是使用请求锁，获取 token 时，将其余请求锁定，示例如下：

```js
let token;

// 获取 token 的请求逻辑
const getToken = () => {
  // 注意，不要用锁定的请求实例直接获取 token，这会导致死锁。
  // 可以在获取 token 的请求配置中设置 skipLock 为 true，它表示跳过请求锁。
  // 或者新建一个请求实例获取 token。
};

miniquest.interceptors.request.use(function (config) {
  if (!token) {
    // 没有 token 时将请求锁定
    miniquest.lock();

    return getToken()
      .then((token) => {
        config.headers.token = token;

        // 获取 token 后将请求解锁
        miniquest.unlock();

        // 返回请求配置，使当前请求继续执行
        return config;
      })
      .catch(() => {
        // 获取 token 失败则待处理的请求全部中断
        miniquest.interrupt();
      });
  } else {
    config.headers.token = token;
  }

  return config;
});
```

## 轮询

提供了 `poll` 和 `poll.create` API 用来轮询。

调用 `poll` 后会立即开始轮询：

```js
poll(() => miniquest.get('/user?id=1'), {
  validate: (response) => response.success,
  interval: 1000,
  retries: 5,
});
```

也可以调用 `poll.create` 创建一个轮询函数：

```js
const pollFn = poll.create(() => miniquest.get('/user?id=1'), {
  validate: (response) => response.success,
  interval: 1000,
  retries: 5,
});

pollFn(); // 开始轮询
```
