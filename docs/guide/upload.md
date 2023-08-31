# 上传

当 `method` 指定为 upload 时会调用小程序上传 API：

::: tip
小程序上传请求 headers 的 content-type 指定为 multipart/form-data，所以会默认移除用户设置 content-type。
:::

```js
miniquest({
  method: 'upload',
  headers: {
    'content-type': 'application/json', // 无效，会被移除掉
  },
  filePath: 'xxx', // 要上传的文件路径。
  name: 'file', // 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容。
});

// 或者
miniquest.upload('/upload', {
  filePath: 'xxx',
  name: 'file',
});
```

上传时，传递给请求配置的 `data` 字段最终会传递给小程序上传 API 的 `formData` 参数：

::: tip
你仍然可以传递 `formData` 参数，和传递 `data` 的区别是：

1. 当同时传递 `data` 和 `formData` 时，会优先使用 `data` 字段。
2. 可以在请求转换器中接收并处理 `data`，但 `formData` 不行。
   :::

```js
miniquest.upload('/upload', {
  filePath: 'xxx',
  name: 'file',
  data: {
    // HTTP 请求中其他额外的 form data
    key: 'xxxx',
  },
});
```
