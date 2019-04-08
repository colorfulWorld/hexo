---
title: 疑难杂问整理（原生JS）
date: 2018-01-19 10:12:08
categories: 原生JS
---

在学习原生的过程中的困惑与解惑的总结

<!--more-->

## 工厂模式

```javascript
function createPerson(name, age, job) {
  var o = new Object();
  o.name = name;
  o.age = age;
  o.job = job;
  o.sayName = function() {
    alert(this.name);
  };
  return 0;
}

var person1 = createPerson('Nicholas', 29, 'Software Engineer');
var person2 = createPerson('Greg', 27, 'Doctor');

person1; // Person {name: "Zaxlct", age: 28, job: "Software Engineer", sayName: ƒ}
person2; // Person {name: "Mick", age: 23, job: "Doctor", sayName: ƒ}
```

## 构造函数

```javascript
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() {
    alert(this.name);
  };
}
var person1 = new Person('Zaxlct', 28, 'Software Engineer');
var person2 = new Person('Mick', 23, 'Doctor');
var person3 = new Person('Mick', 23, 'Doctor');
person1; // Person {name: "Zaxlct", age: 28, job: "Software Engineer", sayName: ƒ}
person2; // Person {name: "Mick", age: 23, job: "Doctor", sayName: ƒ}
person2 === person3; //false
person1.constructor == Person; //true
Person.prototype; // {constructor: ƒ}  为原型对象
person1.prototype; //undefined
Person.prototype.prototype; //undefined
person1.constructor == Person; //true
Person.prototype.constructor == Person; //true
```

实例的构造函数属性（constructor ）指向构造函数。所有的原型对象都会自动获得一个 constructor （构造函数属性）属性

```javascript
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() {
    alert(this.name);
  };
  return this;
}
var person1 = Person('Zaxlct', 28, 'Software Engineer');
var person2 = Person('Mick', 23, 'Doctor');
person1; // this 指向window 且被person2覆盖
person2; // this 指向window
```

**与工厂模式的区别**

- 没有显示创建对象（new 运算符创建并实例化新对象）。
- 直接将属性和方法赋给了 this 对象。
- 没有 return 语句。
- 要创建新实例必须要使用 new 运算符，否者属性和方法将会被添加到 window 对象
- 可以使用 instanceof 操作符检测对象类型。

构造函数的问题：构造函数的内部方法会被重复构建，不同实例内的同名函数是不相等的。

## 从输入 URL 到 页面加载发生了什么

发生过程：

- 查看 web 缓存
- DNS 解析
- TCP 连接
- 发送 HTTP 请求
- 服务器处理请求并返回 HTTP 报文
- 浏览器解析渲染页面
- 连接结束

### 查看 web 缓存

三级缓存原理

1. 先去内存中看，如果有，直接加载。
2. 如果内存没有，这区硬盘获取，如果有直接加载。
3. 如果硬盘中也没有，那么就进行网络请求。
4. 加载到的资源缓存到硬盘和内存。

#### 浏览器缓存机制

![img caption](/images/problem/2.png)

##### 当前缓存是否过期。

如果浏览器通过某些条件 ( 条件之后再说 ) 判断出来，ok 现在这个缓存没有过期可以用，那么连请求都不会发的，直接是启用之前浏览器缓存下来的那份文件 (from memory cache). 浏览器直接通过缓存读取了出来，注意这个时候是不会向浏览器请求的！ 如果过期了就会向服务器重新发起请求，但是不一定就会重新拉取文件！

##### 服务器中的文件是否改动。

1. 缓存过期，文件有改动：如果服务器发现这个文件改变了那么你肯定不能再用以前浏览器的缓存了，那就返回个 200 并且带上新的文件。

2. 缓存过期，文件无改动：同时如果发现虽然那个缓存虽然过期了，可你在服务器端的文件没有变过，那么服务器只会给你返回一个头信息 (304)，让你继续用你那过期的缓存，这样就节省了很多传输文件的时间带宽啥的

过期了的缓存需要请求一次服务器，若服务器判断说这个文件没有改变还能用，那就返回 304。浏览器认识 304，它就会去读取过期缓存。否则就真的传一份新文件到浏览器。

### DNS 解析

浏览器查找域名对应的 IP 地址。互联网上每一台计算机的唯一识别是它的 IP 地址，DNS 解析就是讲网址转换为 IP 地址。

查找过程：

1. 浏览器搜索自己的 DNS 缓存（维护一张域名与 IP 地址的对应表）
2. 搜索操作系统中的 DNS 缓存（维护一张域名与 IP 地址的对应表）
3. 搜索操作系统的 host 文件（Windows 环境下，维护一张域名与 IP 地址的对应表）
4. 操作系统间根域名发送至 LDNS（本地域名服务器），首先查找自己的缓存若是失败：
   - 向根域名服务器发起请求，此处根域名服务器返回 com 域的 sing 机域名服务器地址。
   - LDNS 向 com 域的顶级域名服务器发起请求，得到 www.baidu.com 的地址。
   - LONS 向 baidu.com 域名服务器发起请求，得到 www.baidu.com 的 IP 地址。
5. LDNS 将得到的 IP 地址返回给操作系统，同时将 IP 地址缓存起来；
6. 操作系统将 IP 地址返回给浏览器，同时自己也缓存起来；

此时浏览器得到了域名对应的 IP 地址。

### TCP 连接

浏览器根据 IP 地址与服务器建立 socket 连接 。

### 发送 HTTP 请求

1. 浏览器根据 URL 内容生成 HTTP 请求，请求中包含文件的位置，请求文件的方式等。
2. 服务器接到请求后，会根据 HTTP 请求中的内容来决定如何获取相应的 HTML 文件。

#### http 状态码

1. 200 form memory cache 不访问服务器，直接读缓存 ，此时的缓存是缓存在内存中的，当 kill 进程之后数据就会不存在。这种方式只能缓存派生资源。
2. 200 OK (from cache) 是浏览器没有跟服务器确认，直接用了浏览器缓存。
3. 304 Not Modified 是浏览器和服务器多确认了一次缓存有效性，再用的缓存。200(from cache) 是速度最快的 , 因为不需要访问远程服务器 , 直接使用本地缓存 .304 的过程是 , 先请求服务器 , 然后服务器告诉我们这个资源没变 , 浏览器再使用本地缓存。
4. 200 from dist cache 不访问服务器，直接度缓存，当进程 kill 时，数据依旧存在。只能缓存派生资源。

![img caption](/images/problem/1.png)

### 浏览器解析渲染页面

现代浏览器渲染页面过程是：解码（字节流到字符流） ——> 分词（此法分析） ——> 解析（语法分析）——> 构建 DOM 树 ——> 构建渲染树 ——> 布局渲染树 ——> 绘制渲染树

### 连接结束

断开连接 --4 次挥手

- 为什么服务器在接到断开请求时不立即同意断开：当服务器收到断开连接的请求时，可能仍然有数据未发送完毕，所以服务器先发送确认信号，等所有数据发送完毕后再同意断开。

- 第四次握手后，主机发送确认信号后并没有立即断开连接，而是等待了 2 个报文传送周期，原因是：如果第四次握手的确认信息丢失，服务器将会重新发送第三次握手的断开连接的信号，而服务器发觉丢包与重新发送的断开连接到达主机的时间正好为 2 个报文传输周期。

## session、cookie、seesionStorage、localStorage、Service Worker 的区别

cookie 和 session 都是用来跟踪浏览器用户身份的会话方式。

### cookie 机制

如果不子啊浏览器中设置过期时间，cookie 会被保存在内存中，生命周期谁浏览器的关闭而结束，这种 cookie 称为会话 cookie，如果设置了 cookie 过期时间会保存在硬盘中，关闭浏览器之后，cookie 数据仍然存在，直到过期时间结束才消失。

cookie 是服务器发给客户端的特殊信息，cookie 是以文本的方式保存在客户端，每次请求时会带上它。

### session 机制

当服务器收到请求需要创建 seesion 对象时，首先会检查客户端请求是否包含 sessionId。如果有 seesionId,服务器将根据该 id 返回对象的 session 对象，如果没有 sessionid,服务器将会创建新的 session 对象，并把 sessionid 再本次响应中返回给客户端。通常使用 cookie 方式存储 sessionid 到客户端，再交互中浏览器按照规则将 sessionid 发给服务端。如果用户禁用 cookie，则要使用 URL 重写，可以通过 response.encodeURL(url)进行实现；API 对 encodeURL 的结束为，当浏览器支持 Cookie 时，url 不做任何处理；当浏览器不支持 Cookie 时，url 不做任何处理；当浏览器不支持 Cookie 的时候，将会重写 URL 将 seesionid 拼接到访问地址之后。

### 存储内容

cookie 只能保存字符串，以文本的方式；session 通过类型与 Hashtable 的数据结构来保存，能支持任何类型的对象（session 中可含有多个对象）。

### 存储的大小

- cookie:单个 cookie 保存的数据不能超过 4kb;
- session:大小没有限制。

### sessionStorage

是一个 HTML5 新增的一个会话储存对象，用于临时保存同一个窗口（或标签页）的数据，再关闭窗口或关闭标签页之后会将删除这些数据。

在 JavaScript 中可以通过 window。sessionStorage 或 sessionStrorage

非常适合 SPA，可以方便再各业务模块进行传值

### localSotrage

localStorage 存储的数据是永久性的。

### Service Worker

`Service Worker`本质上充当 web 应用程序与浏览器之间的代理服务器，也可以在网络可用是作为浏览器和网络之间的代理。他们旨在是的能够创建有效的离线体验。拦截网络请求并给予网络是否可用以及更新的资源是否驻留在服务器上来采取适当的动作。他们还允许访问推送通知和后台同步 API

## html 页面的渲染过程

当用户请求页面时，浏览器获取 HTML 并构造 DOM。然后获取 CSS 并构造 CSSOM。然后通过匹配 DOM 和 CSSDOM 生成渲染树。如果有任何的 javascript 需要解决，浏览器将不会开始渲染页面，知道 javascript 解决完毕。

## 事件模型是什么

w3c 中定义的事件发生过程中的 3 个阶段：捕获阶段，目标阶段，冒泡阶段
