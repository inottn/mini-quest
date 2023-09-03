# 请求锁

当请求锁定后，所有未发送的请求将依次等待，直到请求解锁时才能继续发送。请求锁提供了如下 API：

- `miniquest.lock()` 将请求锁定
- `miniquest.unlock()` 将请求解锁，锁定期间待处理的请求将依次执行
- `miniquest.interrupt()` 将请求解锁，锁定期间待处理的请求将中断并抛出错误
- `miniquest.isLocked()` 返回请求是否锁定

在发送请求时，通常为了安全考虑，会将用于标识用户身份的 token 放在 headers 中。如果在此时尚未获取到 token，则一般会在获取到 token 后再发送请求。然而，若存在多个请求同时并发的情况，可能会导致多次发送获取 token 的请求。

在这个场景我们有两个解决办法，一是使用缓存，让同时发送获取 token 的请求返回的都是一个请求。二是使用请求锁，获取 token 时，将其余请求锁定，示例如下：

::: tip
注意，不要用锁定的请求实例直接获取 token，这会导致死锁。

推荐新建一个请求实例获取 token。

或者在获取 token 的请求配置中设置 `skipLock` 为 true，它表示跳过请求锁。
:::

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
