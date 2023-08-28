# 校验状态码

在微信小程序中，只要成功收到服务器返回，无论 HTTP 状态码是多少都会进入 success 回调。而在支付宝小程序中则还会校验 HTTP 状态码，例如 404、500、504 等状态码会触发 fail 回调。这个时候你可以使用 `validateStatus` 配置选项自定义哪些 HTTP 状态码是有效的，从而统一多端小程序行为。

```js
miniquest.get('/user/12345', {
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 这是默认配置
  },
});
```
