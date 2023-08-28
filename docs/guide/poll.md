# 轮询

提供了 `poll` 和 `poll.create` API 用来轮询。

调用 `poll` 后会立即开始轮询。

```js
poll(() => miniquest.get('/user?id=1'), {
  validate: (response) => response.success,
  interval: 1000,
  retries: 5,
});
```

也可以调用 `poll.create` 创建一个轮询函数。

```js
const pollFn = poll.create(() => miniquest.get('/user?id=1'), {
  validate: (response) => response.success,
  interval: 1000,
  retries: 5,
});

pollFn(); // 开始轮询
```
