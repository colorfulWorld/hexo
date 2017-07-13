---
title: http-https
---
### 什么是HTTPS网站
https 可以理解为HTTP+TLS，TLS是传输层加密协议，是HTTPS安全的核心，其前身是SSL。

### 为什么要实现HTTPS？
为保护用户隐私和网络安全。通过数据加密、校验数据完整性和身份认证三种机制来保障安全。


### HSTS
##### HTTPS 网站通常的做法是对HTTP的访问服务器端做302 跳转，跳转到HTTPS。但是这个302跳转存在两个问题:
1.  使用不安全的HTTP协议进行通信。
2.  增加一个Round-Trip Time。

而HSTS 是HTTP Strict Transport Security 的缩写，作用是强制客户端（如浏览器）使用HTTPS与服务器创建链接。其实HSTS的最大作用是防止302HTTP劫持（中间人）HSTS的缺点是浏览器支持率不高，另外配置HTST后HTTPS很难实时降级为HTTP。

采用HSTS协议的网站将保证浏览器始终连接到该网站的HTTPS加密版本，不需要用户手动在URL地址栏中输入加密地址。该协议将帮助网站采用全局加密，用户看到的是该网站的安全版本。

在https://xxx 的响应头中含有Strict-Transport-Security:max-age=31536000;includeSubDomains这就意味着2点：
   1. 在一年的时间里（31536000秒）中，浏览器只要向XXX或者
