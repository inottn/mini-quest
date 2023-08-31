---
outline: deep
---

# 请求配置

这些是创建请求时可以用的通用配置选项。只有 `url` 是必需的。如果没有指定 `method`，请求将默认使用 GET 方法。

实例配置和单次请求配置将会合并为最终请求时的配置，相同的选项，后者会覆盖前者。

由于运行小程序平台不同，平台特有的配置选项这里不再列出。你可以添加任何自定义字段，最终会透传给对应的小程序请求 API。

## 通用配置选项

::: tip
暂不支持 `params` 和 `paramsSerializer` 配置，如有需求可以在拦截器中自行实现。
:::

### url

用于请求的服务器 URL，会和 `baseURL` 合并为最终发送的 URL。在单次请求配置中，它是必需的。

### method

创建请求时使用的 HTTP 方法，大小写均可，最终都会转化为大写的形式。如果没有指定，请求将默认使用 GET 方法。

### baseURL

`baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。

### headers

请求头，默认值为 `{ 'content-type': 'application/json' }`，字段名称不区分大小写，最终都会转化为小写的形式。

上传或下载时会自动过滤掉 `content-type` 字段。

### transformRequest

请求转换器，允许在向服务器发送请求前，修改请求数据。具体参考[数据转换器](/guide/transformer)。

### transformResponse

响应转换器，允许在接收到响应后，修改响应数据。具体参考[数据转换器](/guide/transformer)。

### skipLock

是否跳过请求锁。具体参考[请求锁](/guide/request-lock)。

### validateStatus

允许自定义哪些 HTTP 状态码是有效的。具体参考[校验状态码](/guide/validate-status)。

### adapter

允许自定义处理请求的适配器，接收本次请求的配置为参数，返回一个 promise 并提供一个有效的响应。具体参考自定义适配器。
