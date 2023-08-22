<p align="center">
  <img alt="logo" src="https://fastly.jsdelivr.net/npm/@inottn/assets/miniapp-request/logo.svg" width="420" style="margin-bottom: 10px;">
</p>

<p align="center">🚧 施工中，axios API 风格的小程序请求库</p>

## 特性

- 使用 TypeScript 编写，提供完整的类型定义
- 支持 创建多个实例
- 支持 请求锁
- 支持 校验状态码
- 支持 请求／响应拦截器
- 支持 转换请求和响应数据
- 支持 上传／下载
- 支持 自定义适配器
- 适配 多端小程序（微信、支付宝、百度等）

## 安装

使用 `pnpm` 安装:

```bash
pnpm add @inottn/miniapp-request
```

使用 `yarn` 或 `npm` 安装:

```bash
# 使用 yarn
yarn add @inottn/miniapp-request

# 使用 npm
npm i @inottn/miniapp-request
```

## 实例方法

为了方便起见，为常用且支持的请求方法提供了别名。

#### instance.request(config)

#### instance.request(url[, config])

#### instance.delete(url[, config])

#### instance.download(url[, config])

#### instance.get(url[, config])

#### instance.head(url[, config])

#### instance.options(url[, config])

#### instance.post(url[, config])

#### instance.put(url[, config])

#### instance.upload(url[, config])

注意这和 axios 提供的实例方法略有不同，如果你更习惯 axios 提供的传参方式，你也可以再封装一层。

```js
export function post(url, data, config) {
  return instance.post(url, {
    ...config,
    data,
  });
}
```

## 校验状态码

在微信小程序中，只要成功收到服务器返回，无论 HTTP 状态码是多少都会进入 success 回调。而在支付宝小程序中则还会校验 HTTP 状态码，例如 404、500、504 等状态码会触发 fail 回调。这个时候你可以使用 validateStatus 配置选项自定义哪些 HTTP 状态码是有效的，从而统一多端小程序行为。

```js
instance.get('/user/12345', {
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 这是默认配置
  },
});
```

## 拦截器

在请求或响应被 then 或 catch 处理前拦截它们。

```js
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 默认 2xx 范围内的 HTTP 状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  function (error) {
    // 默认 请求失败或超出 2xx 范围的 HTTP 状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  },
);
```
