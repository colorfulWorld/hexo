---
title: PWA 离线缓存
date: 2017-11-01 11:28:03
categories: Web
---

## PWA (Progressive Web App) 特点

1. installability( 可安装性 )，可被添加自主屏与全屏运行。
2. app shell: 第一次渲染个壳，等异步数据来了在填充。
3. offline( 离线能力 )：离线和弱网环境也能秒开，server worker 给了 web 一个可以跑后台的线程，它可以搭配非常靠谱的 cache Api 做缓存、可以拦截所有 Http 请求并使用 Fetch API 进行 response ，一个非常完备哦的 proxy 就这么诞生了
4. re-engageable：推送通知的能力，依赖 service Worker 与 http push，不过默认支持的可是 GCM
5. 推送是指服务器向服务工作线程提供信息的操作
6. 通知是指服务工作线程或网页脚本向用户信息的操作。

<!--more-->

## service Worker 有以下功能和特性

service Worker 是 Chorme 团队提出和力推的一个 WEB Api，用于给 web 应用日工高级的可持续的后台处理能力。

service Worke 最主要的特点是：在页面中注册成功后，运行与浏览器后台，不受页面刷新的影响（此功能对于执行后台同步和提供推送通知很重要），可以监听和拦截作用于范围内所有页面的 HTTP 请求

类似一个服务器与浏览器之间的中间人角色，如果网站中注册了 service worker 那么它可以拦截当前网站的所有请求，进行判断（需要编写相应的判断程序），如果需要向服务器发起请求的就转给服务器，如果可以直接使用缓存的就直接返回缓存不再给服务器，从而大大挺高浏览器体验。

- 一个独立的 worker 线程，独立于当前网页进程，有自己独立的 worker context。
- 一旦被 install，就永远存在，除非被 uninstall
- 需要的时候可以直接唤醒，不需要的时候自动睡眠（有效利用资源，此处有坑）
- 可编程拦截代理请求和返回，缓存文件，缓存的文件可以被网页进程取到（包括网络离线状态）
- 离线内容开发者可控
- 能向客户端推送消息
- 不能直接操作 DOM
- 出于安全的考虑，必须在 HTTPS 环境下才能工作
- 异步实现，内部大都是通过 Promise 实现

### service Worker 前提条件

- 要求 HTTPS 的环境
- 缓存机制是依赖 cache API 实现的 (cacheStorage)
- 依赖 HTML5 fetchAPI
- 依赖 Promise

### 注册

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./pwa/sw.js', { scope: '/pwa' })
    .then(function (registration) {
      console.log('Service Worker 注册成功，域名: ', registration.scope)
    })
    .catch(function (err) {
      console.log('Service Worker 注册失败: ', err)
    })
}
```

每次页面加载成功后，就会调用 register()方法。浏览器会判断 service Worker 线程是否已注册，并作出相应的处理
scope 方法是可选的，用于指定你想让 service worker 控制内容的子目录。service worker 线程将接受
scope 指定网域目录上所有事项的 fetch 事件。并将它保存在你正在访问的域名下。
sw.js 将包含所有自定义的 service worker 事件处理程序
scope 的意义在于如果 sw.js 在/a/b/sw.js 下，那么 scope 默认是/a/b,那么 service worker 线程只能
捕捉到 path 为/a/b 开头的（/a/b/page1,/a/b/page2,..)下的 fetch 事件

现在 Service Worker 已经被注册好了，接下来是在 Service Worker 生命周期中触发实现对应的事件处理程序了。

### 事件处理程序

生命周期：installing installed activating activated,这个状态变化的过程就是 service worker 生命周期的反应。

### 安装

install 事件我们会绑定在 service worker 文件中，在 service worker 安装成功后，install 事件被触发。**install 事件一般是被用来填充你的浏览器的离线缓存能力。**为了达到这个目的，我们使用了 service worker 新的标志性的存储**cache API** ——一个 service worker 上的全局对象，**它使我们可以存储网络响应发来的资源，并且根据他们的请求来生成 key**。这个 API 和浏览器的标准的缓存工作原理很相似，但是是只对应你的站点的域的。它会一直持久存在，直到你告诉它不再存储，你拥有全部的控制权。

由于 service worker 是走的另外的线程，因此，window 和 DOM 都是不能访问的，因此我们要使用 self 访问全局上下文。

```javascript
const CACHE_NAME = 'yu'
const urlsToCache = ['/', '/js/main.js', '/css/style.css', '/img/bob-ross.jpg']

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install')
  /*ExtendableEvent.waitUntil():
         延长了时间的生命周期。在服务工作中，延长事件的生命周期阻止浏览器在事件中的一部操作完成之前终止service worker。
         当在与安装事件相关联的EventHandler中调用时，它会延时将已安装的工作程序视为安装，
         直到传递的promise成功解析为止。这主要用于确保service worker在其依赖的所有核心高速缓存填充之前不会被考虑安装*/
  e.waitUntil(
    caches.open(chache_name).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell')
      console.log(cache)
      return cache.addAll(urlsToCache)
    })
  )
})
```

这里我们新增了`install`事件监听器，接着在事件上接了一个`ExtendableEvent.waitUntil()`方法
这会确保`service worker`不会在`waitUntil()`里面的代码执行完毕之前安装完成
我们使用`caches.open()`方法创建了一个 yu 的新缓存，将会是我们站点资源的缓存的第一个版本。它返回了一个创建缓存的`promise`,
当它`resolved` 的时候，我们接着会调用在创建的缓存上的一个方法`addALL()`，这个方法的参数是一个由一组相对于 origin 的 URL 组成的数组，
这个数组就是你想缓存的资源的列表
`caches`是一个全局的`CacheStorage`对象，允许在浏览器中管理你的缓存。调用`open`方法来检索具体我们想要使用的`Cache`对象。

### 更新静态资源

缓存资源随着版本的更新会过期，所以会根据缓存的字符串名称（CACHE_NAME）值清除旧缓存，可以遍历所有的缓存名称最易判断决定是否清除

```javascript
self.addEventListener('activate', function (e) {
  e.waitUntil(
    Promise.all(
      caches.keys().then((cacheNames) => {
        return cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name)
          }
        })
      })
    ).then(() => {
      return self.clients.claim()
    })
  )
})
```

在新安装的 Service Worker 中调用 self.clients.claim()取的页面的控制权，这样之后打开的页面都会使用版本更新的缓存。旧的 Service Worker 脚本不在控制页面之后会被停止。

### 自定义请求响应

```javascript
self.addEventListener('fetch', function (e) {
  console.log('[service worker] fetch', e.request.url)
  /*respondWith()方法旨在包裹代码，这些代码为来自受控页面的request生成的自定义的response。用来劫持我们的http响应*/
  e.resondWith(
    caches.match(e.request).then(function () {
      //如果sw有自己的返回，就直接返回，减少一次http请求。
      if (response) {
        return response
      }

      //如果没有返回，就直接请求真实远程服务
      var request = e.request.clone() //拷贝原始请求
      //clone()允许多次请求body()对象。
      return fetch(request).then(function (httpRes) {
        //http请求的返回已经抓到，可以进行设置

        //请求失败，直接返回失败的结果
        if (!httpRes || httpRes.status !== 200) {
          return httpRes
        }
        //  请求成功，将请求缓存
        var responseClone = httpRes.clone()
        caches.open(cache_name).then(function (cache) {
          cache.put(e.request, responseClone)
        })
        return httpRes
      })
    })
  )
})
```

每次任何被`service worker` 控制的资源被请求到时，都会触发`fetch`事件，这些资源包括了指定的`scope`内的
`html` 文档，和这些`html`文档内引用的其他任何资源（比如`index.html`发起了一个跨域的请求来嵌入一张图片，这个也会通过`service worker`。
我们可以在`install` 的时候进行静态资源缓存。也可以通过`fetch`事件回调来代理页面请求从而实现动态资源缓存:

- `on install` 的优点是第二次访问就可以离线访问，缺点是需要缓存的 URL 在编译时插入到脚本中，增加代码量和降低可维护性。
- `on fetch` 的优点是无需变更编译过程，也不会产生额外的流量，缺点是需要多一次访问才能离线访问。
- `request` 属性包含在`FetchEvent`对象里，它用于查找匹配请求的缓存。
- `cache.match`将尝试找到一个与指定请求匹配的缓存响应。如果没有找到对应的缓存，则`promise`会返回一个 undefined 值。在这里我们通过判断这个值来决定是否返回这个值，还是调用`fetch`发出一个网络请求并返回一个`promise`。
- `e.resondWith`是一个 fetchevent 对象中的特殊方法，用于将请求的响应发送回浏览器（提供对应的请求）。打开缓存找到匹配的响应，如果它不存在，就发情网络请求。

#### Fetch 事件

`fetch`事件是在每次网页发出请求的时候触发的，触发该事件的时候 `service worker`能够拦截请求，弄决定是返回缓存的数据，还是返回真是请求响应的数据。与请求匹配的任何缓存数据都将优先被返回，而不需要发送网络请求。只有当没有现有的缓存数据时才会发出网络请求。

#### Service Worker 生命周期 （也许翻译的不好，尽量去看原文）

- **installing**: 这一阶段标志着开始注册。它想要允许设置 worker-specific 的资源,例如离线模式的 caches.
  - 用 **event.waitUntil()** 通过一个 promise 去延长安装 service worker 阶段直到 e.waitUntil()里的代码执行完毕。如果所有资源安装成功缓存则安装成功，否则安装失败，则无法激活 service worker。
  - 用 **self.skipWaiting()** self 是当前 context 的 global 变量。强制当前处于 waiting 状态的脚本进入 activate 状态。
- **installed**:service worker 已经完成了它的安装，在等待其他 service Workers 线程被关闭。
- **activating**: 这时没有被其他 workers 控制的客户端。这个阶段允许 workers 去完成安装并且清理其他 worker 以及关联缓存的就缓存资源，等待新的 service worker 线程被激活。
- **activated**:现在可以处理方法事件。
- **message**: service worker 运行于独立 context 中，无法直接访问当前页面主线程的 DOM 信息，但是通过 postMessageAPI ,可以实现他们之间的消息传递，这样主线程就可以接受 service worker 的指令操作 DOM。

### 定期后台同步

service Worker 与其他服务工作者 在一个单独的线程上运行，所以即使关闭页面，它们也可以执行其代码，此功能对于执行后台同步和提供推送通知很重要

后台同步的目的是解决这个问题，一旦链接重新建立，自动发送数据

```JS
// app.js
navigator.serviceWorker.ready.then((registration) => {
  return registration.sync.register('sync-save-document');
});
```

```JS
//service-worker.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-save-document') {
    event.waitUntil(saveDocument());
  }
});
```

saveDocument 是一个返回 Promise，如果被拒接(例如网络问题)，同步将自动重试。

要注意的一件事是，同步标记必须是唯一的。 例如，如果我要安排 5 个“message”类型的后台同步，则只有最后一个会通过。 因此，在这种情况下，每个标签都应具有唯一的标识符。

#### 后台同步

用户离开页面后，后台同步通常用于同步数据

例如，在手机上编辑文档后，我们写完会点击保存并离开页面，如果在编辑文档期间链接断开，我们必须等待链接回复才能保存文档

#### 定期后台同步

定期后台同步解决与正常那个后台同步不同的问题。该 API 可用于在后台更新数据，而不必等待用户

有了这项技术，用户可以在没有互联网链接的情况下阅读最新的新闻文章

为了防止滥用这个功能，同步的频率取决于浏览器为每个网站设置的站点参与度分数。如果经常打开一个页面，这个频率最多可以达到 12 小时

不放此目的一个要求的是，该网站以作为移动端上的一个 PWA 安装并被天假到主屏幕

## manifest.json

pwa 添加至桌面的功能实现依赖于 manifest.json。

### 基本功能

- name:{string} 应用名称，用于安装横幅、启动画面显示
- short_name:{string} 应用短名称，用于主屏幕显示
- icon:img 应用图标列表，其中包括:
  - src:{string} 图标 URL
  - type:图标的 mime 类型
  - size:图标尺寸。当 PWA 添加到主屏幕时，浏览器会根据有效图标的 size 字段进行选择，如果匹配到的图标路径错误，将会显示浏览器默认 icon。
- start_url:{string=} 应用启动地址
- background_color:{color} css 色值
- display: {string} 显示类型
  - fullScreen: 应用的显示界面将占满整个屏幕
  - standalone: 浏览器相关 UI（导航栏、工具栏等）将会被隐藏
  - minimal-ui: 显示形式与 standalone 类似，浏览器相关 UI 会最小化为一个按钮，不同浏览器在实现上略有不同
  - browser: 浏览器模式，与普通网页在浏览器中打开的显示一致
- orientation: string 应用显示方向
- theme_color: 主题颜色

### 设置作用域

- 如果没有在 manifest 中设置 scope，则默认的作用域为 manifest.json 所在的文件夹；
- **start_url 必须在作用域范围之内**;
- 如果 start_url 为相对地址，其根路径收 scope 所影响;
- 如果 start_url 为绝对地址（以/开头）,则该地址将永远以/作为跟地址；

### 添加启动动画

当 PWA 添加到主屏幕点击打开时，幕后执行了若干操作：

1. 启动浏览器
2. 启动显示页面的渲染器
3. 加载资源

在这个过程中，由于页面未加载完毕，因此屏幕将显示空白并且看似停滞。如果是从网络加载的页面资源，白屏过程将会变得更加明显。因此 PWA 提供了启动画面功能，用标题、颜色和图像组成的画面来替代白屏，提升用户体验。

目前，如果修改了 manifest.json 的应用的名称，已经添加到主屏幕的名称并不会改变，只有当用户重新添加到桌面时，更改后的名称才会显示出来。但是未来版本的 chrome 支持自动更新。

## 更新页面

如何解决每次发布上线，用户首次拿到的都是旧的，需要再次刷新呢？
（个人认为这是一个缺点）
页面被缓存之后，就需要适当处理缓存失效时的页面更新。某些配置中被缓存的资源是无法发起请求判断是否被更新的，只有 sw.js 会自动根据 HTTP 缓存的机制尝试去判断应用是否被更新。所以当页面发生改变时，要同时对 sw.js 文件的缓存名进行修改。这就意味着在联网情况下，用户得到的可能不是最新的数据。

然后重新打开页面，这个时候渲染的页面依旧是的，但是 sw.js 被安装和激活。之后关闭页面后再次打开才可以看到更新过后的页面。所以最好是将一些不经常更改的静态文件发到缓存中，提高用户体验。

### 如何更新一个 service Worker

更新你 service worker 的 JavaScript 文件

1. 当用户浏览你的网站时，浏览器尝试在后台重新下载 service worker 的脚本文件。经过对比，只要服务器上的文件和本地文件有一个字节不同，这个文件就认为是新的。
2. 之后更新后的 service worker 启动并触发 install 事件。
3. 此时，当前页面生效的依然是老版本的 service worker，新的 service worker 会进入 “waiting” 状态。
4. 当页面关闭之后，老的 service worker 会被干掉，新的 servicer worker 接管页面
5. 一旦新的 service worker 生效后会触发 activate 事件。

之前我们使用的缓存可以叫 my-site-cache-v1 ，我们想把这个拆封到多个缓存，一份给页面使用，一份给博客文章使用。这意味着，install 步骤里，我们要创建两个缓存： pages-cache-v1 和 blog-posts-cache-v1。在 activite 步骤里，我们需要删除旧的 my-site-cache-v1。

下面的代码会遍历所有的缓存，并删除掉不在 cacheWhitelist 数组（我们定义的缓存白名单）中的缓存。

```JS
self.addEventListener('activate', function(event) {

  var cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

### 设置 Cache-Control

静态文件，类似于图片和视频等不会经常改变的资源，做长时间缓存是没有很大的问题，可以在 HTTP 头里设置 `Cache-Control`来缓存文件使其缓存时间为一年：`Cache-Control: max-age=31536000`

页面，css 和 script 文件会经常变化，所以应该设置一个很短的缓存时间比如 24 小时，并在联网时与服务区端文件进行验证 `Cache-Control: must-revalidate, max-age=86400`

### 为什么首次注册之后的首次刷新没有拦截到网络请求

而在首次注册、安装、激活之后，Service Worker 已经拿到了当前页面的控制权了，但为什么首次刷新却没有拦截到网络请求呢？主要是因为在 Service Worker 的注册是一个异步的过程，在激活完成后当前页面的请求都已经发送完成，因为时机太晚，此时是拦截不到任何请求的，只能等待下次访问再进行。

而第二次刷新页面，由于当前站点的 Service Worker 是处于激活状态，所以不会再次新建 worker 工作线程并执行 Service Worker。也就是说激活状态的 Service Worker 在一个站点只会存在一个 worker 工作线程，除非 Service Worker 文件发生了变化（手动 unregister Service Worker 也会注销掉 worker 工作线程），触发了浏览器更新，才会重新开启生命周期。而由于 Service Worker 工作线程的离线特性，只要处于激活状态，在后续的任何访问中，都会通过 fetch 事件监听器拦截当前页面的网络请求，并执行 fetch 事件回调。

## 参考

1. [Service Worker 生命周期](hhttps://developers.google.com/web/fundamentals/primers/service-workers/lifecycle?hl=zh-cn)
1. [PWA 应用实战](https://lavas-project.github.io/pwa-book/)
1. [发现刷新两次，数据才更新](https://blog.csdn.net/zmx_FZ/article/details/106206890)
1. [浏览器缓存、CacheStorage、Web Worker 与 Service Worke](https://github.com/youngwind/blog/issues/113)
1. [谨慎处理 Service Worker 的更新](https://juejin.cn/post/6844903792522035208)
1. [ServiceWorkerRegistration.update](https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorkerRegistration/update)
1. [Service Worker 更新机制](https://harttle.land/2017/04/10/service-worker-update.html)
1. [借助 Service Worker 和 cacheStorage 缓存及离线开发](https://www.zhangxinxu.com/wordpress/2017/07/service-worker-cachestorage-offline-develop/)
1. [Service Workers - JavaScript API 简介](https://segmentfault.com/a/1190000027080988)
