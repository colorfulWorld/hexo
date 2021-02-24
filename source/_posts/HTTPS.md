---
title: HTTPS
categories: WEB
comments: false
---

https 可以理解为 HTTP+TLS，TLS 是传输层加密协议，是 HTTPS 安全的核心，其前身是 SSL。TLS 主要有五部分 : 应用数据层协议，握手协议，报警协议，加密消息确认协议，心跳协议。TLS 协议本身又是由 record 协议传输的。

### 为什么要实现 HTTPS？

为保护用户隐私和网络安全。通过数据加密、校验数据完整性和身份认证三种机制来保障安全。

<!--more-->

### 全站 HTTPS 必须解决的问题

---

**性能**

* HTTPS 需要多次握手，因此网络耗时变长，用户从 HTTP 跳转到 HTTPS 需要一些时间。但是如果使用 SPDY，HTTPS 的速度甚至比 HTTP 快。HTTPS 对速度的影响主要来自两方面 :
  1. 协议交换所增加的网络 RTT。
  2. 加解密相关的计算耗时。
* HTTPS 要做 RSA 校验，这会影响到设备性能。
* 所有 CDN 节点要支持 HTTPS，而且需要有极其复杂的解决方案来面对 DDoS 的挑战。 ** 其次，兼容性及周边 :**
* 页面中所有嵌入的资源（图片、附件、js 、视频等）都要改为 HTTPS 的，否者就会报警。

### 基于协议和配置的优化

1.HTTPS 访问速度优化 2.Tcp fast open

#### HTTPS:

网站通常的做法是对 HTTP 的访问服务器端做 302 跳转，跳转到 HTTPS。但是这个 302 跳转存在两个问题 : 1. 使用不安全的 HTTP 协议进行通信。 2. 增加一个 Round-Trip Time。

而 HSTS 是 HTTP Strict Transport Security 的缩写，作用是强制客户端（如浏览器）使用 HTTPS 与服务器创建链接。其实 HSTS 的最大作用是防止 302HTTP 劫持（中间人）HSTS 的缺点是浏览器支持率不高，另外配置 HTST 后 HTTPS 很难实时降级为 HTTP。

采用 HSTS 协议的网站将保证浏览器始终连接到该网站的 HTTPS 加密版本，不需要用户手动在 URL 地址栏中输入加密地址。该协议将帮助网站采用全局加密，用户看到的是该网站的安全版本。

在https://xxx 的响应头中含有 Strict-Transport-Security:max-age=31536000;includeSubDomains 这就意味着两点：

1. 在一年的时间里（31536000 秒）中，浏览器只要向 XXX 或者其子域名发送 HTTP 请求时，必须采用 HTTPS 来发起连接。比如用户在地址栏输入http://xxx 或者点击超链接，浏览器应当自动将 http 转写成 https, 然后直接向https://xxx/ 发起请求。
2. 在接下来的一年中，如果 xxx 服务器发送的 TLS 证书无效，用户不能忽略浏览器警告继续访问网站。

##### 作用

HTST 可以用来抵御 SSL 剥离攻击。攻击者在用户访问 HTTP 页面时替换所有 https 开头的连接为 http。达到阻止 HTTPS 的目的。但是如果使用了 HTST，一旦服务器发送了 HSTS 字段，用户将不再允许忽略警告。

##### 不足

用户首次访问网站是不受 HSTS 保护的。这是因为首次访问时，浏览器还未收到 HSTS，所以仍有可能明文 HTTP 访问。HTST 会在一段时间后失效（由 max-age 指定 )。所以浏览器是否强制 HSTS 取决于当前系统时间。部分操作系统经常通过网络时间协议更新系统时间。

一旦浏览器接受到 HSTS Header( 假如有效期是 1 年），但是网站的证书出现问题，那么在有效都无法访问网站。

#### Session resume 复用 session

1. 减少 CPU 消耗，因为不需要非对称秘钥交换的计算。
2. 提升访问速度，不需要进行完全握手阶段二，节省了一个 RTT 和计算耗时。

##### Session cache

Session cache 的原理是使用 client hello 中的 session id 查询服务端的 session cache, 如果服务端有对应的缓存，则直接使用已有的 session 信息提前完成握手，称为简化握手。

Session cache 有两个缺点：

1. 需要消耗服务端内存来存储 session 内容。

2. 目前的开源软件包括 nginx,apache 只支持单机多进程间共享缓存，不支持多机间分布式缓存，对于百度或者其他大型互联网公司而言，单机 session cache 几乎没有作用。

Session cache 也有一个非常大的优点：

1. session id 是 TLS 协议的标准字段，市面上的浏览器全部都支持 session cache。

百度通过对 TLS 握手协议及服务器端实现的优化，已经支持全局的 session cache，能够明显提升用户的访问速度，节省服务器计算资源。

#### 使用 SPDY 或者 HTTP2

SPDY 是 google 推出的优化 HTTP 传输效率的协议（https://www.chromium.org/spdy） 它基本上沿用了 HTTP 协议的语义 , 但是通过使用帧控制实现了多个特性，显著提升了 HTTP 协议的传输效率。SPDY 最大的特性就是多路复用，能将多个 HTTP 请求在同一个连接上一起发出去，不像目前的 HTTP 协议一样，只能串行地逐个发送请求。Pipeline 虽然支持多个请求一起发送，但是接收时依然得按照顺序接收，本质上无法解决并发的问题。

HTTP2 是 IETF 2015 年 2 月份通过的 HTTP 下一代协议，它以 SPDY 为原型，经过两年多的讨论和完善最终确定。

需要说明两点 :

1. SPDY 和 HTTP2 目前的实现默认使用 HTTPS 协议。

2. SPDY 和 HTTP2 都支持现有的 HTTP 语义和 API，对 WEB 应用几乎是透明的。

Google 宣布 chrome 浏览器 2016 年将放弃 SPDY 协议，全面支持 HTTP2，但是目前国内部分浏览器厂商进度非常慢，不仅不支持 HTTP2，连 SPDY 都没有支持过。

百度服务端和百度手机浏览器现在都已经支持 SPDY3.1 协议。
