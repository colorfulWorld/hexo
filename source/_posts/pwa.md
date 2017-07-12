---
title: pwa
---
## PWA (Progressive Web App) 特点
1. installability(可安装性)，可被添加自主屏与全屏运行。
2. app shell:第一次渲染个壳，等异步数据来了在填充。
3. offline(离线能力)：离线和弱网环境也能秒开，server worker给了web一个可以跑后台的线程，它可以搭配非常靠谱的cache Api做缓存、可以拦截所有Http请求并使用Fetch API进行response ，一个非常完备哦的proxy就这么诞生了
4. re-engageable：推送通知的能力，依赖service Worker 与http push，不过默认支持的可是GCM
5. 推送是指服务器向服务工作线程提供信息的操作
6. 通知是指服务工作线程或网页脚本向用户信息的操作。
------------------------------

## manifest.json
pwa 添加至桌面的功能实现依赖于manifest.json。主流浏览器的情况有

### Create a new post

``` bash
$ hexo new "My New Post"
```

More info: [Writing](https://hexo.io/docs/writing.html)

### Run server

``` bash
$ hexo server
```

More info: [Server](https://hexo.io/docs/server.html)

### Generate static files

``` bash
$ hexo generate
```

More info: [Generating](https://hexo.io/docs/generating.html)

### Deploy to remote sites

``` bash
$ hexo deploy
```

More info: [Deployment](https://hexo.io/docs/deployment.html)
