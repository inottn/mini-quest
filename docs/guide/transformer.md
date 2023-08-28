# 数据转换器

## 请求转换器

::: tip
在执行数据转换器时，会绑定 `this` 为当前的请求配置。这意味着当使用箭头函数时，将不能通过 `this` 获取到当前的请求配置。
:::

`transformRequest` 配置允许在向服务器发送请求前，修改请求数据。

它接收当前请求配置的 `data` 和 `headers` 作为参数，并会在请求拦截器后执行：

```js
{
  transformRequest: function (data, headers) {
    // 对发送的 data 进行任意转换处理，注意最后需要 return data
    return data;
  },
}
```

需要添加多个转换器，也可以传递一个数组：

```js
{
  transformRequest: [
    function (data, headers) {
      // 先执行
      return data;
    },

    function (data, headers) {
      // 后执行
      return data;
    },
  ],
}
```

## 响应转换器

`transformResponse` 允许在接收到响应后，修改响应数据。

它接收当前响应的 `data`、`headers` 以及 `status` 作为参数，并会在响应拦截器前执行：

```js
{
  transformResponse: [function (data, headers, status) {
    // 对接收的 data 进行任意转换处理，注意最后需要 return data
    return data;
  }],
}
```

## 拦截器和转换器的区别？

拦截器一般用于拦截和修改请求与响应的配置和信息，可以处理异步任务。而转换器一般用于对请求与响应的数据进行格式转换，只能进行同步操作。
