# 基本用例

## 发送 GET 请求

发送一个 GET 请求，当不指定 `method` 时，请求将默认使用 GET 方法：

```js
// 将参数拼接到 URL 上
miniquest('/user?id=1');

// 也可以指定具体的 method
miniquest('/user?id=1', { method: 'get' });
```

你也可以将 `url` 传递给请求配置，这两种方式是等价的：

```js
miniquest({
  method: 'get'
  url: '/user?id=1',
});
```

在有多个参数时，你可以将这些参数传递给请求配置的 `data` 字段，这样做会使代码逻辑更加清晰。特别是当你使用 TypeScript 时，类型检查将更加友好。最终，小程序的请求 API 将会把 `data` 中的参数拼接到 url 上：

```js
miniquest('/user', {
  data: {
    id: '1',
    name: 'inottn',
  },
});

// 当然，您也可以混合使用两者，但这只会降低代码的可读性和难以进行维护
miniquest('/user?id=1', {
  data: {
    name: 'inottn',
  },
});
```

## 发送 POST 请求

默认会使用 `application/json` 格式传输数据：

```js
miniquest({
  methods: 'post',
  url: '/user/create',
  data: {
    name: 'inottn',
  },
});
```

也可以使用 `application/x-www-form-urlencoded` 格式传输数据：

```js
miniquest({
  methods: 'post',
  url: '/user/create',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
  },
  data: {
    name: 'inottn',
  },
});
```

## 发送多个并发请求

使用 `Promise.all` 发送多个并发请求：

```js
Promise.all([miniquest.get('/user?id=1'), miniquest.get('/user?id=2')]).then(
  ([user1, user2]) => {
    // ...
  },
);
```
