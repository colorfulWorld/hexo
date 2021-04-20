---
title: Web Workers
date: 2019-07-05 16:43:57
categories: Web
---

JavaScript 语言采用的是单线程模型，也就是说，所有任务只能在一个线程上完成，一次只能做一件事情。前面的任务没有做完，后面的任务只能等着。随着电脑计算能力增强，尤其是多核 CPU 的出现，单线程带来很大的不便，无法充分发挥计算机的计算能力。

<!--more-->

## Web Worker 的作用

是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互相不打扰。等到 Worker 线程完成计算任务，再把结果返给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程担负了，主线程（通常负责 UI 交互）就会很流畅，不会因此阻塞/放慢。

## 注意点

1. 同源限制
   分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。
2. DOM 限制
   Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用 document、window、parent 这些对象。但是 Worker 线程可以 navigator 对象和 location 对象（PWA 的应用）。
3. 通信联系
   Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。
4. 脚本限制
   Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成。
5. 文件限制
   Worker 线程无法读取本地文件，即不能打开本机的文件系统（file://），它所加载的脚本，必须来自网络。

**Worker 线程一旦新建成功，就会始终运行**，不会被主线程上的活动（比如用户点击按钮、提交表单）单端，这样有利于随时的响应主线程的通信。但是这也造成了 Worker 比较耗费资源，不应该过度使用，而且一旦使用完毕，就应该关闭。

## 基本用法

```javascript
var worker = new Worker('work.js')

worker.postMessage('Hello World')

worker.postMessage({ method: 'echo', args: ['Work'] })
```

`worker.postMessage()`方法的参数，就是主线程传给 Worker 的数据。它可以是各种数据类型，包括二进制数据。

接着，主线程通过 worker.onmessage 指定监听函数，接收子线程发回来的消息。

```javascript
worker.onmessage = function (event) {
  console.log('Received message ' + event.data)
  doSomething()
}

function doSomething() {
  // 执行任务
  worker.postMessage('Work done!')
}
```

上面代码中，事件对象的 data 属性可以获取 Worker 发来的数据。

Worker 完成任务以后，主线程就可以把它关掉。

`worker.terminate();`

## Web Worker 实战

Web Worker 可以提高应用的总体性能，并且提升用户体验

### 如何使用 Worker 预加载图片

ndex.js 中启用 worker

```javascript
let w = new Worker('js/workers.js')
w.onmessage = function (event) {
  /*var img = document.createElement("img");
 img.src = window.URL.createObjectURL(event.data); document.querySelector('#result').appendChild(img) */
  console.log(event.data)
}
w.onerror = function (e) {
  e.currentTarget.terminate()
  console.log('erro: ' + e.message)
}
```

worker.js 中请求图片

```javascript
let arr = [...好多图片路径];
for (let i = 0, len = arr.length; i < len; i++) {
 let req = new XMLHttpRequest();
req.open('GET', arr[i], true);
req.responseType = "blob";
//req.setRequestHeader("client_type", "DESKTOP_WEB");
 req.onreadystatechange = () => {
 if (req.readyState == 4) {
 // postMessage(req.response);
}
} req.send(null); }
```
