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
  var o = new Object()
  o.name = name
  o.age = age
  o.job = job
  o.sayName = function() {
    alert(this.name)
  }
  return 0
}

var person1 = createPerson('Nicholas', 29, 'Software Engineer')
var person2 = createPerson('Greg', 27, 'Doctor')

person1 // Person {name: "Zaxlct", age: 28, job: "Software Engineer", sayName: ƒ}
person2 // Person {name: "Mick", age: 23, job: "Doctor", sayName: ƒ}
```

## 构造函数

```javascript
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function() {
    alert(this.name)
  }
}
var person1 = new Person('Zaxlct', 28, 'Software Engineer')
var person2 = new Person('Mick', 23, 'Doctor')
var person3 = new Person('Mick', 23, 'Doctor')
person1 // Person {name: "Zaxlct", age: 28, job: "Software Engineer", sayName: ƒ}
person2 // Person {name: "Mick", age: 23, job: "Doctor", sayName: ƒ}
person2 === person3 //false
person1.constructor == Person //true
Person.prototype // {constructor: ƒ}  为原型对象
person1.prototype //undefined
Person.prototype.prototype //undefined
person1.constructor == Person //true
Person.prototype.constructor == Person //true
```

实例的构造函数属性（constructor ）指向构造函数。所有的原型对象都会自动获得一个 constructor （构造函数属性）属性

```javascript
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function() {
    alert(this.name)
  }
  return this
}
var person1 = Person('Zaxlct', 28, 'Software Engineer')
var person2 = Person('Mick', 23, 'Doctor')
person1 // this 指向window 且被person2覆盖
person2 // this 指向window
```

**与工厂模式的区别**

* 没有显示创建对象（new 运算符创建并实例化新对象）。
* 直接将属性和方法赋给了 this 对象。
* 没有 return 语句。
* 要创建新实例必须要使用 new 运算符，否者属性和方法将会被添加到 window 对象
* 可以使用 instanceof 操作符检测对象类型。

构造函数的问题：构造函数的内部方法会被重复构建，不同实例内的同名函数是不相等的。

## 跨域

具体概念如下：只要协议、域名、端口有任何一个不同，都被当作是不同的域。

** 凡是拥有 “src” 这个属性的标签都有跨域的能力**

**如果是协议和端口造成的跨域问题。则前台无法解决。** 同源策略具体分为以下几类：

* 不同域名
* 相同域名不同端口号，如`https://www.oschina.net:8000`和`https://www.oschina.net:8001`
* 同一个域名不同协议，如`http://www.oschina.net/`和`https://www.oschina.net/`
* 域名和域名对应的的 IP，如`http://b.qq.com/`和 `http://10.198.7.85`
* 主域和子域，如`http://www.oschina.net/`和`https://test.oschina.net`
* 子域和子域，如`https://test1.oschina.net`和`https://test2.oschina.net` 以上情况只要出现了，那么就会产生跨域问题。那么如果解决跨域问题呢，下面的小节会总结一些解决跨域常用的方法。

### JSONP 带 callback 的 json

有个通俗易懂的解释 -JSONP（JSON with Padding ）是数据格式 JSON 的一种 “ 使用模式 ”，可以让网页从别的网域要数据。利用`<script>`标签没有跨域限制，来达到与第 3 方通讯的目的。

** jsonp 的客户端具体实现：**

1. 远程服务器 remoteserver.com 根目录下有个 remote.js 文件代码如下：

```javascript
alert('我是远程文件')
```

2. 本地服务器 localserver.com 下有个 jsonp.html 页面代码如下：

```javascript
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <script type="text/javascript" src="http://remoteserver.com/remote.js"></script>
</head>
<body>

</body>
</html>
```

页面将会弹出一个提示窗体，显示跨域调用成功。

3. 现在我们在 jsonp.html 页面定义一个函数，然后在远程 remote.js 中传入数据进行调用。

jsonp.html 页面代码如下：

```javascript
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title></title>
    <script type="text/javascript">
    var localHandler = function(data){
        alert('我是本地函数，可以被跨域的remote.js文件调用，远程js带来的数据是：' + data.result);
    };
    </script>
    <script type="text/javascript" src="http://remoteserver.com/remote.js"></script>
</head>
<body>

</body>
</html>
```

4. remote.js 文件代码如下：

```javascript
localHandler({ result: '我是远程js带来的数据' })
```

**要注意的是他支持 GET 这一种 HTTP 请求类型**

### 跨域资源共享（CORS-Cross Origin Resource Sharing ）

跨域资源共享（ CORS ）机制允许 Web 应用服务器进行跨域访问控制，从而使跨域数据传输得以安全进行。

CORS 除了 GET 要求方法以外也支持其他的 HTTP 要求。浏览器 CORS 请求分成两种：

1. 简单请求
2. 协商模型 / 预检请求（Preflighted Request ），即非简单请求如何区分请求具体属于哪一种呢，下面我总结了几点：

   1. 请求方式：

   * GET
   * HEAD
   * POST

   2. HTTP 的头信息子段

   * Accept
   * Accept-Language
   * Content-Language
   * Last-Event-ID
   * Content-Type：只限于三个值 application/x-www-form-urlencoded、multipart/form-data 、 text/plain，其中 'text/plain' 默认支持，其他两种则需要预检请求和服务器协商。

满足以上两大点的即为简单请求，否则为非简单请求。

假如站点 http://foo.example 的网页应用想要访问 http://bar.other 的资源。http://foo.example 的网页中可能包含类似于下面的 JavaScript 代码：

```javascript
var invocation = new XMLHttpRequest()
var url = 'http://bar.other/resources/public-data/'

function callOtherDomain() {
  if (invocation) {
    invocation.open('GET', url, true)
    invocation.onreadystatechange = handler
    invocation.send()
  }
}
```

### document.domain+iframe （适用于主域名相同的情况）

比如，有一个页面，它的地址是http://www.damonare.cn/a.html ， 在这个页面里面有一个 iframe，它的 src 是http://damonare.cn/b.html, 很显然，这个页面与它里面的 iframe 框架是不同域的，所以我们是无法通过在页面中书写 js 代码来获取 iframe 中的东西的：

```javascript
<script type="text/javascript">
    function test(){
        var iframe = document.getElementById('￼ifame');
        var win = iframe.contentWindow;//可以获取到iframe里的window对象，但该window对象的属性和方法几乎是不可用的
        var doc = win.document;//这里获取不到iframe里的document对象
        var name = win.name;//这里同样获取不到window对象的name属性
    }
</script>
<iframe id = "iframe" src="http://damonare.cn/b.html" onload = "test()"><\/iframe>
```

这时只要把http://www.damonare.cn/a.html和http://damonare.cn/b.html这两个页面的document.domain都设成相同的域名就可以了。但要注意的是，document.domain的设置是有限制的，我们只能把document.domain设置成自身或更高一级的父域，且主域必须相同。

* 在页面http://www.damonare.cn/a.html 中设置 document.domain:

```javascript
<iframe id = "iframe" src="http://damonare.cn/b.html" onload = "test()"></iframe>
<script type="text/javascript">
    document.domain = 'damonare.cn';//设置成主域
    function test(){
        alert(document.getElementById('￼iframe').contentWindow);//contentWindow 可取得子窗口的 window 对象
    }
</script>
```

* 在页面http://damonare.cn/b.html 中也设置 document.domain:

```javascript
;<script type="text/javascript">
  document.domain = 'damonare.cn';//在iframe载入这个页面也设置document.domain，使之与主页面的document.domain相同
</script>
```

修改 document.domain 的方法只适用于不同子域的框架间的交互。

### 通过 location.hash 跨域

此方法的原理就是改变 URL 的 hash 部分来进行双向通信。每个 window 通过改变其他 window 的 location 来发送消息（由于两个页面不在同一个域下 IE、Chrome 不允许修改 parent.location.hash 的值，所以要借助于父窗口域名下的一个代理 iframe），并通过监听自己的 URL 的变化来接收消息。这个方式的通信会造成一些不必要的浏览器历史记录，而且有些浏览器不支持 onhashchange 事件，需要轮询来获知 URL 的改变，最后，这样做也存在缺点，诸如数据直接暴露在了 url 中，数据容量和类型都有限等。

### 通过 HTML5 的 postMessage 方法跨域

这个功能主要包括接受信息的 ”message” 事件和发送消息的 ”postMessage” 方法。比如http://damonare.cn域的A页面通过iframe嵌入了一个http://google.com域的B页面，可以通过以下方法实现A和B的通信

A 页面通过 postMessage 方法发送消息：

```javascript
window.onload = function() {
  var ifr = document.getElementById('ifr')
  var targetOrigin = 'http://www.google.com'
  ifr.contentWindow.postMessage('hello world!', targetOrigin)
}
```

**postMessage 的使用方法**

otherWindow.postMessage(message, targetOrigin);

* otherWindow: 指目标窗口，也就是给哪个 window 发消息，是 window.frames 属性的成员或者由 window.open 方法创建的窗口
* message: 是要发送的消息，类型为 String、Object (IE8 、 9 不支持 )
* targetOrigin: 是限定消息接收范围，不限制请使用 ‘\*

B 页面通过 message 事件监听并接受消息 :

```javascript
var onmessage = function(event) {
  var data = event.data //消息
  var origin = event.origin //消息来源地址
  var source = event.source //源Window对象
  if (origin == 'http://www.baidu.com') {
    console.log(data) //hello world!
  }
}
if (typeof window.addEventListener != 'undefined') {
  window.addEventListener('message', onmessage, false)
} else if (typeof window.attachEvent != 'undefined') {
  //for ie
  window.attachEvent('onmessage', onmessage)
}
```

### 通过 window.name 跨域

在一个窗口生命周期内，窗口载入的所有的页面都是共享一个 window.name 的，每一个页面对 window.name 都有读写的权限，window.name 是持久的存在于一个窗口载入的所有页面，并不会因为新的页面的载入而被重置。

下面为 a.html 中代码

```javascript
<script>
    window.name = '我是页面a中设置的值';
    setInterval(function(){
        window.location = 'b.html';
    },2000)//两秒后把一个新页面b.html载入到当前的window中
</script>
```

b.html 中的代码

```javascript
;<script>console.log(window.name);//读取window.name的值</script>
```

## 从输入 URL 到 页面加载发生了什么

发生过程：

* 查看 web 缓存
* DNS 解析
* TCP 连接
* 发送 HTTP 请求
* 服务器处理请求并返回 HTTP 报文
* 浏览器解析渲染页面
* 连接结束

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
   * 向根域名服务器发起请求，此处根域名服务器返回 com 域的 sing 机域名服务器地址。
   * LDNS 向 com 域的顶级域名服务器发起请求，得到 www.baidu.com 的地址。
   * LONS 向 baidu.com 域名服务器发起请求，得到 www.baidu.com 的 IP 地址。
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

* 为什么服务器在接到断开请求时不立即同意断开：当服务器收到断开连接的请求时，可能仍然有数据未发送完毕，所以服务器先发送确认信号，等所有数据发送完毕后再同意断开。

* 第四次握手后，主机发送确认信号后并没有立即断开连接，而是等待了 2 个报文传送周期，原因是：如果第四次握手的确认信息丢失，服务器将会重新发送第三次握手的断开连接的信号，而服务器发觉丢包与重新发送的断开连接到达主机的时间正好为 2 个报文传输周期。

## session、cookie、seesionStorage、localStorage 的区别

cookie 和 session 都是用来跟踪浏览器用户身份的会话方式。

### cookie 机制

如果不子啊浏览器中设置过期时间，cookie 会被保存在内存中，生命周期谁浏览器的关闭而结束，这种 cookie 称为会话 cookie，如果设置了 cookie 过期时间会保存在硬盘中，关闭浏览器之后，cookie 数据仍然存在，直到过期时间结束才消失。

cookie 是服务器发给客户端的特殊信息，cookie 是以文本的方式保存在客户端，每次请求时会带上它。

### session 机制

当服务器收到请求需要创建 seesion 对象时，首先会检查客户端请求是否包含 sessionId。如果有 seesionId,服务器将根据该 id 返回对象的 session 对象，如果没有 sessionid,服务器将会创建新的 session 对象，并把 sessionid 再本次响应中返回给客户端。通常使用 cookie 方式存储 sessionid 到客户端，再交互中浏览器按照规则将 sessionid 发给服务端。如果用户禁用 cookie，则要使用 URL 重写，可以通过 response.encodeURL(url)进行实现；API 对 encodeURL 的结束为，当浏览器支持 Cookie 时，url 不做任何处理；当浏览器不支持 Cookie 时，url 不做任何处理；当浏览器不支持 Cookie 的时候，将会重写 URL 将 seesionid 拼接到访问地址之后。

### 存储内容

cookie 只能保存字符串，以文本的方式；session 通过类型与 Hashtable 的数据结构来保存，能支持任何类型的对象（session 中可含有多个对象）。

### 存储的大小

* cookie:单个 cookie 保存的数据不能超过 4kb;
* session:大小没有限制。

### sessionStorage

是一个 HTML5 新增的一个会话储存对象，用于临时保存同一个窗口（或标签页）的数据，再关闭窗口或关闭标签页之后会将删除这些数据。

在 JavaScript 中可以通过 window。sessionStorage 或 sessionStrorage

非常适合 SPA，可以方便再各业务模块进行传值

### localSotrage

localStorage 存储的数据是永久性的。

## html 页面的渲染过程

当用户请求页面时，浏览器获取 HTML 并构造 DOM。然后获取 CSS 并构造 CSSOM。然后通过匹配 DOM 和 CSSDOM 生成渲染树。如果有任何的 javascript 需要解决，浏览器将不会开始渲染页面，知道 javascript 解决完毕。
