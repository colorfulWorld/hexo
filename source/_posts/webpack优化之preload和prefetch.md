---
title: webpack优化之preload和prefetch
date: 2019-08-16 17:26:11
categories: HTML5
---

链接预取是一种浏览器机制，其利用浏览器空闲时间来下载或预取用户在不久的将来可能访问的文档。网页向浏览器提供一组预取提示，并在浏览器完成当前页面的加载后开始静默地拉取指定的文档并将其存储在缓存中。当用户访问其中一个预取文档时，便可以快速的从浏览器缓存中得到。

<!--more-->

# prefetch

prefetch 的设计初衷是为了让当前页面的关键资源尽早被发现和加载，从而提升首屏渲染性能。

当我们使用 webpack 构建页面时，就会在页面中发现有很多使用`link`引入的 JS 资源。

![15659449621.jpg](https://img.hacpai.com/file/2019/08/15659449621-5fea8870.jpg)

这段代码告诉浏览器，这段资源将会在未来某个导航或者功能要用到，但是本资源的下载顺序权重比较低。也就是说 prefetch 通常用于加速下一次导航，而不是本次的。

被标记为 prefetch 的资源，将会被浏览器在空闲时间加载。prefetch 指示的是**下一次**导航可能需要的资源。浏览器识别到 Prefetch 时，应该加载该资源（且不执行），等到真正请求相同资源时，就能够得到更快的响应。

[prefetch-MDN 定义](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Link_prefetching_FAQ)

# preload

```
<link rel="preload" href="late_discovered_thing.js" as="script">
```

as 属性的作用是告诉浏览器被加载的是什么资源，可能的 as 值包括：

-   "script"
-   "style"
-   "image"
-   "media"
-   "document"

忽略 as 属性，或者错误的 as 属性会使 preload 等同于 XHR 请求，浏览器不知道加载的是什么，因此会赋予此类资源非常低的加载优先级。

preload 通常用于本页面要用到的关键资源，包括关键 js、字体、css 文件。preload 将会把资源得下载顺序权重提高，使得关键数据提前下载好，优化页面打开速度。

# 什么时候使用 preload 和 prefetch

```
对于当前页面很有必要的资源使用 `preload`，对于可能在将来的页面中使用的资源使用 `prefetch`。
```

-   `preload`  是对浏览器指示预先请求当前页需要的资源（关键的脚本，字体，主要图片）。

-   `prefetch`  应用场景稍微又些不同 —— 用户将来可能在其他部分（比如视图或页面）使用到的资源。如果  `A`  页面发起一个  `B`  页面的  `prefetch`  请求，这个资源获取过程和导航请求可能是同步进行的，而如果我们用  `preload`  的话，页面  `A`  离开时它会立即停止。

使用  `preload`和  `prefetch`，我们有了对当前页面和将来页面加载关键资源的解决办法。

# preload 和  prefetch  的缓存行为

chrome 有四种缓存：HTTP 缓存，内存缓存，Service Worker 缓存和 Push 缓存，preload 和 prefetch 都被缓存在 HTTP 缓存中。

当一个资源被  `preload`  或者  `prefetch`  获取后，它可以从 HTTP 缓存移动至渲染器的内存缓存中。如果资源可以被缓存（比如说存在有效的[`cache-control`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)  和  `max-age`），它被存储在 HTTP 缓存中可以被现在或将来的任务使用，如果资源不能被缓存在 HTTP 缓存中，作为代替，它被放在内存缓存中直到被使用。

# webpack 搭配 prefetch 优化单页面应用 code-splitting

单页面应用由于页面过多，可能会导致代码体积过大，从而使得首页打开速度过慢。所以切分代码，优化首屏打开速度尤为重要。

但是所有的技术手段都不是完美的。当我们切割代码后，首屏的 js 文件体积减少了好多。但是也有一个突出的问题：
那就是当跳转其他页面的时候，需要下载相应页面的 js 文件，这就导致体验极其不好，每一次点击访问新页面都要等待 js 文件下载，然后再去请求接口获取数据。频繁出现 loading 动画的体验真的不好.

所以如果我们在进入首页后，在浏览器的空闲时间提前下好用户可能会点击页面的 js 文件，这样首屏的 js 文件大小得到了控制，而且再点击新页面的时候，相关的 js 文件已经下载好了，就不再会出现 loading 动画。

动态引入 js 文件，实现 code-splitting，减少首屏打开时间

```javascript
**// 代码分割后的react组件
const Brand = asyncComponent(() => import(
/*webpackChunkName: 'mp-supports'*/
'./views/Brand' )) // 路由引入
<Route path="/" component={App}>
<Route path="/brand" component={Brand} /> </Route>
```

首页组件的生命周期：

```javascript
// 在接口取的数据后，进行prefetch
componentDidUpdate({ topics }) {
  if( topics.length === 0 && this.props.topics.length > 0 ) {
   // 实行prefetch，注意只有webpack 4版本才支持prefetch功能。
    import(
        /* webpackPrefetch: true */
        /*webpackChunkName: 'topic'*/
        "../topic"
      )
  }
}
```

关键点：
1、 `_webpackChunkName: 'chunk-name'_`
2、 componentDidUpdate

## 这里有两个关键点：

1. webpack 的动态 import()需要指定包命，如果不在注释中说明包名，那么用了几次 import() , webpack 就会给同一个文件打包多少次。使得我们 prefetch 的文件和路由中要用到的文件并不是同一个文件。
2. prefetch 会在浏览器空闲时，下载相应文件。这是一个很笼统的定义，在我的使用中，我发现在接口没有返回数据，以及图片等还没有请求成功时，prefetch 就会请求数据了。这一点是很不好的，最起码 prefetch 不能影响首页接口的获取速度。所以我把 prefetch 的执行事件放在了 componentDidUpdate 生命周期内。保障了 prefetch 的执行，不会影响到关键的首页数据获取。

当然 prefetch 在服务端渲染的页面并不会有影响接口的问题，是一个比较好的技术选择

# 参考文献

1. [Prefetch 和预加载实践](https://www.itcodemonkey.com/article/9707.html)
1. [关于 Preload, 你应该知道些什么](https://www.jianshu.com/p/24ffa6d45087)
1. [Preload，Prefetch 和它们在 Chrome 之中的优先级)](https://www.w3cplus.com/performance/reloading/preload-prefetch-and-priorities-in-chrome.html)
