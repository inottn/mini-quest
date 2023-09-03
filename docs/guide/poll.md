---
outline: deep
---

# 轮询

## 基本用例

提供了 `poll` 和 `poll.create` API 用来轮询。

`poll(fn, options)` 接收两个参数，`fn` 是需要轮询的函数，`options` 是轮询的[配置选项](#参数)。

调用 `poll` 后会立即开始轮询，并返回表示轮询结果的 promise 对象：

```js
const result = poll(() => miniquest.get('/user?id=1'), {
  validate: (response) => response.success,
  interval: 1000,
  retries: 5,
});

result
  .then((res) => {
    // 成功
  })
  .catch((reason) => {
    // 失败
  });

// 通过调用 cancel 方法取消轮询
result.cancel();
```

也可以调用 `poll.create` 创建一个轮询函数，它接收的参数和 `poll` 一致：

```js
const pollFn = poll.create(() => miniquest.get('/user?id=1'), {
  validate: (response) => response.success,
  interval: 1000,
  retries: 5,
});

pollFn(); // 开始轮询
```

## 参数

### fn

需要轮询的函数，可以在 `fn` 的参数中接收到当前重试次数和取消轮询的方法。`fn` 可以是一个同步函数或者一个最终返回表示轮询结果的 promise 的异步函数：

```js
const fn = ({ retried, cancel }) => {
  // retried: 当前重试次数
  // cancel: 取消轮询的方法
};

poll(fn, options);
```

### options.validate

校验轮询是否成功的函数。接收 `fn` 的返回结果，并返回一个布尔值来表示轮询是否成功。

### options.interval

轮询间隔，单位为毫秒。可以传递一个数字，或者一个接收当前重试次数，返回轮询间隔的函数：

```js
const options = {
  interval: 1000,
};

// 或者
const options = {
  interval: ({ retried }) => {
    // 可以根据当前重试次数实现指数退避算法
  },
};
```

### options.retries

轮询错误重试次数。可以传递一个数字，或者一个接收当前重试次数，返回重试次数的函数。

### options.onSuccess

轮询成功的回调函数。当 `options.validate` 返回 true 时触发。

### options.onFail

轮询失败的回调函数。当轮询超过最大重试次数时触发。

### options.onCancel

取消轮询的回调函数。当取消轮询时触发：

```js
const fn = ({ retried, cancel }) => {
  // 可以在 fn 中取消轮询
  cancel();
};

const result = poll(fn, options);
// 也可以调用返回值的 cancel 方法取消
result.cancel();
```

## 返回值

返回值是一个表示轮询结果的 promise 对象，并包含一个取消轮询的方法。
