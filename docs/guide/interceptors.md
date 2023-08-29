# 拦截器

使用拦截器在请求发起之前和收到响应数据之后对配置或响应做一些处理，并且可以在拦截器中执行异步任务。

## 请求拦截器

添加请求拦截器，请求拦截器在执行时会接收**本次请求的配置**为参数：

```js
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
```

当某个请求拦截器不再需要时，可以移除它：

```js
const interceptor = miniquest.interceptors.request.use(function () {
  /*...*/
});
miniquest.interceptors.request.eject(interceptor);
```

当添加了多个请求拦截器时，也可以通过 `clear` 方法全部移除：

```js
miniquest.interceptors.request.clear();
```

## 响应拦截器

响应拦截器的添加和移除和请求拦截器相似，不同的是响应拦截器在执行时会接收**本次请求的响应数据**为参数：

```js
// 添加响应拦截器
const interceptor = miniquest.interceptors.response.use(
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

// 移除指定的响应拦截器
miniquest.interceptors.response.eject(interceptor);

// 移除所有的响应拦截器
miniquest.interceptors.response.clear();
```

## 多个拦截器的执行顺序

如果你添加了多个请求或响应拦截器，它们会按如下顺序执行：

1. 先添加的请求拦截器后执行，后添加的请求拦截器先执行。
2. 先添加的响应拦截器先执行，后添加的响应拦截器后执行。
