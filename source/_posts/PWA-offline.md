---
title: PWA 离线缓存
categories: PWA
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

* 一个独立的 worker 线程，独立于当前网页进程，有自己独立的 worker context。
* 一旦被 install，就永远存在，除非被 uninstall
* 需要的时候可以直接唤醒，不需要的时候自动睡眠（有效利用资源，此处有坑）
* 可编程拦截代理请求和返回，缓存文件，缓存的文件可以被网页进程取到（包括网络离线状态）
* 离线内容开发者可控
* 能向客户端推送消息
* 不能直接操作 DOM
* 出于安全的考虑，必须在 HTTPS 环境下才能工作
* 异步实现，内部大都是通过 Promise 实现

### service Worker 前提条件

* 要求 HTTPS 的环境
* 缓存机制是依赖 cache API 实现的 (cacheStorage)
* 依赖 HTML5 fetchAPI
* 依赖 Promise

### 注册

````javascript
      if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('./pwa/sw.js', {scope: '/pwa'})
                /* 每次页面加载成功后，就会调用register()方法。浏览器会判断service Worker线程是否
                 已注册，并作出相应的处理*/
                /* scope 方法是可选的，用于指定你想让service worker 控制内容的子目录。service worker 线程将接受
                 scope指定网域目录上所有事项的fetch事件。
                 scope的意义在于如果sw.js在/a/b/sw.js下，那么scope默认是/a/b,那么service worker 线程只能
                 捕捉到path为/a/b开头的（/a/b/page1,/a/b/page2,..)下的fetch事件*/
                .then(function (registration) {
                    console.log('Service Worker 注册成功，域名: ', registration.scope);
                })
                .catch(function (err) {
                    console.log('Service Worker 注册失败: ', err);
                });

        }

```

### 安装

install事件我们会绑定在service worker 文件中，在service worker 安装成功后，install事件被触发。**install事件一般是被用来填充你的浏览器的离线缓存能力。**为了达到这个目的，我们使用了service worker 新的标志性的存储**cache API** ——一个service worker上的全局对象，**它使我们可以存储网络响应发来的资源，并且根据他们的请求来生成key**。这个 API 和浏览器的标准的缓存工作原理很相似，但是是只对应你的站点的域的。它会一直持久存在，直到你告诉它不再存储，你拥有全部的控制权。

```javascript
    self.addEventListener('install', function (e) {
        console.log('[ServiceWorker] Install');
        /*ExtendableEvent.waitUntil():
         延长了时间的生命周期。在服务工作中，延长事件的生命周期阻止浏览器在事件中的一部操作完成之前终止service worker。
         当在与安装事件相关联的EventHandler中调用时，它会延时将已安装的工作程序视为安装，
         直到传递的promise成功解析为止。这主要用于确保service worker在其依赖的所有核心高速缓存填充之前不会被考虑安装*/
        e.waitUntil(
            caches.open(chache_name).then(function (cache) {
                console.log('[ServiceWorker] Caching app shell');
                console.log(cache);
                return cache.addAll(filesToCache);
            })
        );
    });
    /*这里我们新增了install 事件监听器，接着在事件上接了一个ExtendableEvent.waitUntil()方法
      这会确保service worker不会在waitUntil()里面的代码执行完毕之前安装完成*/
    /*我们使用caches.open()方法创建了一个yu的新缓存，将会是我们站点资源的缓存的第一个版本。它返回了一个创建缓存的promise,
      当它resolved 的时候，我们接着会调用在创建的缓存上的一个方法addALL()，这个方法的参数是一个由一组相对于origin的URL组成的数组，
      这个数组就是你想缓存的资源的列表*/
```

### 自定义请求响应

``` javascript
    self.addEventListener('fetch', function (e) {
     console.log('[service worker] fetch',e.request.url);
    /*respondWith()方法旨在包裹代码，这些代码为来自受控页面的request生成的自定义的response。用来劫持我们的http响应*/
        e.resondWith(
            caches.match(e.request).then(function () {
                //如果sw有自己的返回，就直接返回，减少一次http请求。
               if (response) {
                   return response;
               }

               //如果没有返回，就直接请求真实远程服务
                var request = e.request.clone(); //拷贝原始请求
                //clone()允许多次请求body()对象。
                return fetch(request).then(function (httpRes) {
                   //http请求的返回已经抓到，可以进行设置

                    //请求失败，直接返回失败的结果
                    if(!httpRes||httpRes.status!==200){
                        return httpRes;
                    }
                    //  请求成功，将请求缓存
                    var responseClone = httpRes.clone();
                    caches.open(cache_name).then(function (cache) {
                        cache.put(e.request,responseClone);
                    });
                    return httpRes;
                });

            })
        );

    });
    /*每次任何被service worker 控制的资源被请求到时，都会触发fetch事件，这些资源包括了指定的scope内的
      html 文档，和这些html文档内引用的其他任何资源（比如index.html发起了一个跨域的请求来嵌入一张图片，这个也会通过service worker*/
      ```

我们可以在install 的时候进行静态资源缓存。也可以通过fetch事件回调来代理页面请求从而实现动态资源缓存:

- on install 的优点是第二次访问就可以离线访问，缺点是需要缓存的URL在编译时插入到脚本中，增加代码量和降低可维护性。
- on fetch 的优点是无需变更编译过程，也不会产生额外的流量，缺点是需要多一次访问才能离线访问。

#### Service Worker 生命周期 （也许翻译的不好，尽量去看原文）

- installing: 这一阶段标志着开始注册。它想要允许设置worker-specific 的资源,例如离线模式的caches.
    - 用 **event.waitUntil()** 通过一个promise 去延长安装service worker阶段直到e.waitUntil()里的代码执行完毕。如果所有资源安装成功缓存则安装成功，否则安装失败，则无法激活service worker。
    - 用 **self.skipWaiting()** self 是当前context 的 global 变量。强制当前处于waiting 状态的脚本进入activate状态。
- installed:service worker 已经完成了它的安装，在等待其他service Workers 线程被关闭。
- activating: 这时没有被其他workers 控制的客户端。这个阶段允许workers 去完成安装并且清理其他 worker以及关联缓存的就缓存资源，等待新的service worker线程被激活。
- activated:现在可以处理方法事件。
- message: service worker 运行于独立context 中，无法直接访问当前页面主线程的DOM信息，但是通过postMessageAPI ,可以实现他们之间的消息传递，这样主线程就可以接受service worker 的指令操作DOM。

## manifest.json
pwa 添加至桌面的功能实现依赖于manifest.json。

### 基本功能
- name:{string} 应用名称，用于安装横幅、启动画面显示
- short_name:{string} 应用短名称，用于主屏幕显示
- icon:img 应用图标列表，其中包括:
    - src:{string}  图标URL
    - type:图标的mime 类型
    - size:图标尺寸。当PWA添加到主屏幕时，浏览器会根据有效图标的size 字段进行选择，如果匹配到的图标路径错误，将会显示浏览器默认icon。
- start_url:{string=} 应用启动地址
- background_color:{color} css色值
- display: {string} 显示类型
    - fullScreen: 应用的显示界面将占满整个屏幕
    - standalone: 浏览器相关UI（导航栏、工具栏等）将会被隐藏
    - minimal-ui: 显示形式与standalone类似，浏览器相关UI会最小化为一个按钮，不同浏览器在实现上略有不同
    - browser: 浏览器模式，与普通网页在浏览器中打开的显示一致
- orientation: string 应用显示方向
- theme_color: 主题颜色

### 设置作用域

- 如果没有在manifest中设置scope，则默认的作用域为manifest.json所在的文件夹；
- **start_url 必须在作用域范围之内**;
- 如果start_url 为相对地址，其根路径收scope所影响;
- 如果start_url 为绝对地址（以/开头）,则该地址将永远以/作为跟地址；

### 添加启动动画

当PWA添加到主屏幕点击打开时，幕后执行了若干操作：
1. 启动浏览器
2. 启动显示页面的渲染器
3. 加载资源

在这个过程中，由于页面未加载完毕，因此屏幕将显示空白并且看似停滞。如果是从网络加载的页面资源，白屏过程将会变得更加明显。因此 PWA 提供了启动画面功能，用标题、颜色和图像组成的画面来替代白屏，提升用户体验。

目前，如果修改了manifest.json 的应用的名称，已经添加到主屏幕的名称并不会改变，只有当用户重新添加到桌面时，更改后的名称才会显示出来。但是未来版本的chrome 支持自动更新。
````