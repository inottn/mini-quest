# 基本 API

## 请求方式别名

为了方便起见，为常用且支持的请求方法提供了别名。不同小程序平台支持的请求方法会有所不同，以实际情况为准：

::: tip
`miniquest` 是 `miniquest.request` 的别名，两者可以认为是等价的，目的在于简化使用。
:::

- miniquest.request(config)

- miniquest.request(url[, config])

- miniquest.delete(url[, config])

- miniquest.download(url[, config])

- miniquest.get(url[, config])

- miniquest.head(url[, config])

- miniquest.options(url[, config])

- miniquest.post(url[, config])

- miniquest.put(url[, config])

- miniquest.upload(url[, config])

注意这和 `axios` 提供的实例方法略有不同，如果你更习惯 `axios` 提供的传参方式，你也可以基于此再封装一层：

```js
export function post(url, data, config) {
  return miniquest.post(url, {
    ...config,
    data,
  });
}
```

## 创建实例

通常情况下，使用默认导出的实例就能够满足需求。但在某些场景下，可能需要创建一个或多个实例来满足不同的需求。你可以使用 `create` 方法，并传入自定义配置：

```js
import { create } from '@inottn/miniquest';

const miniquest = create({
  baseURL: 'https://base.domain.com',
  timeout: 1000,
  headers: { 'X-Custom-Header': 'foobar' },
});
```
