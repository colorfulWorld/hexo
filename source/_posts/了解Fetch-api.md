---
title: 了解Fetch api
date: 2020-09-27
categories: Web
---

提及与服务器的异步通信，离不开 Ajax，实际上 Ajax 并非指某一项具体的技术，它主要是基于用脚本操作 HTTP 请求的 Web 应用架构。

在 Ajax 中涉及到的 JavaScript 方面的技术，即 XMLHttpRequest(以下简称 XHR)，至今我们基本都是通过 XHR 与服务器简历异步通信，在设计上将输入、输出和事件监听混杂在一个对象里，且必须通过实例化方式来发请求。配置和调用方式混乱，不符合关注分点离原则。

直到 Fetch API 的提出，前端和服务器端的异步通信方面更进了一步。

<!--more-->

## 什么是 Fetch

Fetch API 是近年来被提及将要取代 XHR 的技术新标准，是一个 HTML5 的 API。

Fetch 并不是 XHR 的升级版本，而是从一个全新的角度来思考的一种设计。Fetch 是基于 Promise 语法结构，而且它的设计足够低阶，这表示它可以在实际需求中进行更多的弹性设计。对于 XHR 所提供的能力来说，Fetch 已经足够取代 XHR ，并且提供了更多拓展的可能性。

Fetch 的核心在于对 HTTP 接口的抽象，包括 Request，Response，Headers，Body，以及用于初始化异步请求的 global fetch。

## 如何使用 Fetch

Fetch API 规范明确了用户代理获取资源的语义。原生支持 Promise1，调用方便，符合语义化。可配合使用 ES2016 中的 async / await 语法，更加优雅。

通过一个例子来快速了解和使用 Fetch API 最基本的用法

```javascript
// 获取 some.json 资源
fetch('some.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log('data', data);
  })
  .catch(function(error) {
    console.log('Fetch Error: ', error);
  });

// 采用ES2016的 async/await 语法
async function() {
  try {
    const response = await fetch('some.json');
    const data = await response.json();
    console.log('data', data);
  } catch (error) {
    console.log('Fetch Error: ', error)
  }
}
```

可以简单理解为，Fetch API 是面向未来的异步通信 API。通过例子我们可以发现，使用 Fetch API 能够快速便捷地进行资源地获取。

## 具体用法

fetch 方法有两种调用方式。

```javascript
Promise fetch(String url, [, Object options])
Promise fetch(Request req, [, Object options])
```

- 第一个参数是一个 Request 对象，第二个参数是配置信息，可选
- 第一个参数是一个 url，第二个参数是配置信息，可选
  可选配置信息是一个 Object 对象，可以包含以下字段：
- method: 请求的方法，例如：GET,POST。
- headers: 请求头部信息，可以是一个简单的对象，也可以是 Headers 类实例化的一个对象。
- body: 需要发送的信息内容，可以是 Blob,BufferSource,FormData,URLSearchParams 或者 USVString。注意，GET,HEAD 方法不能包含 body。
- mode: 请求模式，分别有 cors,no-cors,same-origin,navigate 这几个可选值。
  - cors: 允许跨域，要求响应中 Acess-Control-Allow-Origin 这样的头部表示允许跨域。
  - no-cors: 只允许使用 HEAD,GET,POST 方法。
  - same-origin: 只允许同源请求，否则直接报错。
  - navigate: 支持页面导航。
- credentials: 表示是否发送 cookie，有三个选项
  - omit: 不发送 cookie。
  - same-origin: 仅在同源时发送 cookie。
  - include: 发送 cookie。
- cache: 表示处理缓存的策略。
- redirect: 表示发生重定向时，有三个选项
  - follow: 跟随。
  - error: 发生错误。
  - manual: 需要用户手动跟随。
- integrity: 包含一个用于验证资资源完整性的字符串。

### Headers

Headers 可用来表示 HTTP 的头部信息，使用 Headers 的接口，你可以通过 Headers() 构造函数来创建一个你自己的 headers 对象。

```javascript
var headers = new Headers({
  'Content-Type': 'text/plain',
  'Content-Length': content.length.toString(),
  'X-Custom-Header': 'ProcessThisImmediately'
})
headers.append('X-Custom-Header', 'AnotherValue')
headers.has('Content-Type') // true
headers.getAll('X-Custom-Header') // ["ProcessThisImmediately", "AnotherValue"]
```

Headers 提供 append, delete, get, getAll, has, set, forEach 等这些实例方法，可供开发者更加灵活地配置请求中的 headers。

### Request

```javascript
var URL = '//api.some.com'
var getReq = new Request(URL, { method: 'GET', cache: 'reload' })
fetch(getReq)
  .then(function (response) {
    return response.json()
  })
  .catch(function (error) {
    console.log('Fetch Error: ', error)
  })
```

Request 接口中的配置项 headers 可以是实例化的 Headers 。

```javascript
var URL = '//api.some.com'
// 实例化 Headers
var headers = new Headers({
  'Content-Type': 'text/plain',
  'Content-Length': content.length.toString(),
  'X-Custom-Header': 'ProcessThisImmediately'
})
var getReq = new Request(URL, { method: 'GET', headers: headers })
fetch(getReq)
  .then(function (response) {
    return response.json()
  })
  .catch(function (error) {
    console.log('Fetch Error: ', error)
  })
```

更便捷的是，Request 对象可以从已有的 Request 对象中继承，并拓展新的配置。

```javascript
var URL = '//api.some.com'
var getReq = new Request(URL, { method: 'GET', headers: headers })
// 基于已存在的 Request 实例，拓展创建新的 Request 实例
var postReq = new Request(getReq, { method: 'POST' })
```

### Response

Response 实例是在 fentch()处理完 promises 之后返回的。它的实例也可用通过 JavaScript 来创建，但只有在 ServiceWorkers 中才真正有用。
`var res = new Response(body, init);`
其中 body 可以是 Bolb, BufferSource, FormData, URLSearchParams, USVString 这些类型的值。

**init 是一个对象，可以包括以下这些字段**

- status: 响应状态码
- statusText: 状态信息
- headers: 头部信息，可以是对象或者 Headers 实例

**Response 实例提供了以下实例属性，均是只读属性。**

- bodyUsed: 用于表示响应内容是否被使用过
- headers: 头部信息
- ok: 表明请求是否成功，响应状态为 200 ~ 299 时，值为 true
- status: 状态码
- statusText: 状态信息
- type: 响应类型
  - basic: 同源
  - cors: 跨域
  - error: 出错
  - opaque: Request mode 设置为 “no-cors”的响应
- url: 响应地址

**Response 实例提供以下实例方法**

- clone: 复制一个响应对象。
- arrayBuffer: 将响应数据转换为 arrayBuffer 后 reslove 。
- bolb: 把响应数据转换为 Bolb 后 reslove 。
- formData: 把响应数据转换为 formData 后 reslove 。
- json: 把响应内容解析为对象后 reslove 。
- text: 把响应数据当做字符串后 reslove 。

## 常用的 fetch 请求

### HTML

```javascript
fetch('/index/fetchHtml')
  .then((res) => {
    return res.text()
  })
  .then((result) => {
    document.body.innerHTML += result
  })
  .catch((err) => {})
```

### JSON

```javascript
fetch('/api/user/CaiCai')
  .then((res) => {
    return res.json()
  })
  .then((json) => {
    console.log(json)
  })
  .catch((err) => {})
```

### POST Form

```javascript
function postForm() {
  const form = document.querySelector('form')
  const name = encodeURI(document.getElementsByName('name')[0].value)
  fetch(`/api/user/${name}`, {
    method: 'POST',
    body: new FormData(form)
  })
}
```

### POST JSON

```javascript
fetch('/api/user/CaiCai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'CaiCai',
    age: '26'
  })
})
```

## fetch 注意事项

### 错误处理

fetch 只有在网络错误的情况，返回的 promise 会被 reject。成功的 fetch() 检查不仅要包括 promise 被 resolve，还要包括 Response.ok 属性为 true。HTTP 404 状态并不被认为是网络错误，所以 Promise 的状态为 resolve。

### credentials 设置

fetch 可以通过 credentials 自己控制发送请求时是否带上 cookie。credentials 可设置为 include、same-origin、omit。include 为了让浏览器发送包含凭据的请求（即使是跨域源）。如果你只想在请求 URL 与调用脚本位于同一起源处时发送凭据，请添加 credentials: 'same-origin'。要改为确保浏览器不在请求中包含凭据，请使用 credentials: 'omit'。

### 中止

fetch 自身并没有提供 中止请求的方法。但是部分浏览器有实现 AbortController，可以通过 AbortController 中止 fetch 请求

```javascript
const controller = new AbortController()
const signal = controller.signal
setTimeout(() => controller.abort(), 5000)

fetch('/api/user/CaiCai', {
  signal, // 在option中加入signal
  method: 'POST',
  // credentials:'include',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'CaiCai',
    age: '26'
  })
})
  .then((res) => {
    return res.json()
  })
  .then((result) => {
    console.log(result)
  })
  .catch((err) => {
    console.log(err)
  })
```

## Fetch 的缺点

1. fetch 不支持 jsonp，如果项目中使用到 JSONP，需要单独实现一个 JSONP。

2. fetch 自身并没有提供 abort 的方法，需要 AbortController 去处理中止，实现起来会繁琐一点。并且 AbortController 兼容性不是很好，不过我们可以使用“abortcontroller-polyfill”。

3. 在我们平常使用中，fetch 相对 XHR 差别不大，实际业务上，api 请求都是用再次封装好的函数来处理的。底层是 Fetch 还是 XHR 影响不大。所以如果没有特别的需求，从 XHR 升级到 fetch 的意义不大。但是在 ServiceWorker 中 fetch 会大放异彩。目前淘宝首页就使用 fetch+ServiceWorker 来实现离线缓存。
