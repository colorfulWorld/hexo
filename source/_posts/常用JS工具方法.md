---
title: 常用JS工具方法
date: 2021-05-26 16:03:02
categories: JavaScript
---

搬运平时常用的工具函数

<!--more-->

## 常用 H5 适配方案

```JS
    ;(function (n) {
        var e = n.document,
          t = e.documentElement,
          i = 720,
          d = i / 100,
          o = 'orientationchange' in n ? 'orientationchange' : 'resize',
          a = function () {
            var n = t.clientWidth || 320
            n > 720 && (n = 720)
            t.style.fontSize = n / d + 'px'
          }
        e.addEventListener && (n.addEventListener(o, a, !1), e.addEventListener('DOMContentLoaded', a, !1))
      })(window)
```

## isStatic：检测数据是不是除了 symbol 外的原始数据

```javascript
function isStatic(value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'undefined' ||
    value === null
  )
}
```

## isPrimitive：检测数据是不是原始数据

```javascript
function isPrimitive(value) {
  return isStatic(value) || typeof value === 'symbol'
}
```

## isObject：判断数据是不是引用类型的数据

例如： arrays, functions, objects, regexes, new Number(0),以及 new String('')

```javascript
function isObject(value) {
  let type = typeof value
  return value != null && (type == 'object' || type == 'function')
}
```

## isObjectLike：检查 value 是否是 类对象。

如果一个值是类对象，那么它不应该是 null，而且 typeof 后的结果是 "object"

```javascript
function isObjectLike(value) {
  return value != null && typeof value == 'object'
}
```

## getRawType：获取数据类型，返回结果为 Number、String、Object、Array 等

```javascript
function getRawType(value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}
```

## isPlainObject：判断数据是不是 Object 类型的数据

```javascript
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
```

## isArray：判断数据是不是数组类型的数据

```javascript
function isArray(arr) {
  return Array.isArray(arr)
}
```

## isArrayLike：检查 value 是否是类数组

如果一个值被认为是类数组，那么它不是一个函数，并且 value.length 是个整数，大于等于 0，小于或等于 Number.MAX_SAFE_INTEGER。这里字符串也将被当作类数组。

```javascript
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value)
}
```

## isEmpty：检查 value 是否为空

如果是 null，直接返回 true；如果是类数组，判断数据长度；如果是 Object 对象，判断是否具有属性；如果是其他数据，直接返回 false(也可改为返回 true)

```javascript
function isEmpty(value) {
    if (value == null) {
        return true;
    }
    if (isArrayLike(value)) {
        return !value.length;
    }else if(isPlainObject(value)){
          for (let key in value) {
            if (hasOwnProperty.call(value, key)) {
              return false;
            }
        }
    }
    return false;

```

## cached：记忆函数：缓存函数的运算结果

```js
function cached(fn) {
  let cache = Object.create(null)
  return function cachedFn(str) {
    let hit = cache[str]
    return hit || (cache[str] = fn(str))
  }
}
```

## camelize：横线转驼峰命名

```js
let camelizeRE = /-(\w)/g
function camelize(str) {
  return str.replace(camelizeRE, function (_, c) {
    return c ? c.toUpperCase() : ''
  })
}
//ab-cd-ef ==> abCdEf
//使用记忆函数
let _camelize = cached(camelize)
```

## hyphenate：驼峰命名转横线命名：拆分字符串，使用 - 相连，并且转换为小写

```js
let hyphenateRE = /\B([A-Z])/g
function hyphenate(str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
}
//abCd ==> ab-cd
//使用记忆函数
let _hyphenate = cached(hyphenate)
```

## capitalize：字符串首位大写

```js
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
// abc ==> Abc
//使用记忆函数
let _capitalize = cached(capitalize)
```

## extend：将属性混合到目标对象中

```js
function extend(to, _from) {
  for (let key in _from) {
    to[key] = _from[key]
  }
  return to
}
```

## 识别各种浏览器及平台

```javascript
//运行环境是浏览器
let inBrowser = typeof window !== 'undefined'
//运行环境是微信
let inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform
let weexPlatform = inWeex && WXEnvironment.platform.toLowerCase()
//浏览器 UA 判断
let UA = inBrowser && window.navigator.userAgent.toLowerCase()
let isIE = UA && /msie|trident/.test(UA)
let isIE9 = UA && UA.indexOf('msie 9.0') > 0
let isEdge = UA && UA.indexOf('edge/') > 0
let isAndroid = (UA && UA.indexOf('android') > 0) || weexPlatform === 'android'
let isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || weexPlatform === 'ios'
let isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge
```

## getExplorerInfo：获取浏览器信息

```js
function getExplorerInfo() {
  let t = navigator.userAgent.toLowerCase()
  return 0 <= t.indexOf('msie')
    ? {
        //ie < 11
        type: 'IE',
        version: Number(t.match(/msie ([\d]+)/)[1])
      }
    : !!t.match(/trident\/.+?rv:(([\d.]+))/)
    ? {
        // ie 11
        type: 'IE',
        version: 11
      }
    : 0 <= t.indexOf('edge')
    ? {
        type: 'Edge',
        version: Number(t.match(/edge\/([\d]+)/)[1])
      }
    : 0 <= t.indexOf('firefox')
    ? {
        type: 'Firefox',
        version: Number(t.match(/firefox\/([\d]+)/)[1])
      }
    : 0 <= t.indexOf('chrome')
    ? {
        type: 'Chrome',
        version: Number(t.match(/chrome\/([\d]+)/)[1])
      }
    : 0 <= t.indexOf('opera')
    ? {
        type: 'Opera',
        version: Number(t.match(/opera.([\d]+)/)[1])
      }
    : 0 <= t.indexOf('Safari')
    ? {
        type: 'Safari',
        version: Number(t.match(/version\/([\d]+)/)[1])
      }
    : {
        type: t,
        version: -1
      }
}
```

## isPCBroswer：检测是否为 PC 端浏览器模式

```js
function isPCBroswer() {
  let e = navigator.userAgent.toLowerCase(),
    t = 'ipad' == e.match(/ipad/i),
    i = 'iphone' == e.match(/iphone/i),
    r = 'midp' == e.match(/midp/i),
    n = 'rv:1.2.3.4' == e.match(/rv:1.2.3.4/i),
    a = 'ucweb' == e.match(/ucweb/i),
    o = 'android' == e.match(/android/i),
    s = 'windows ce' == e.match(/windows ce/i),
    l = 'windows mobile' == e.match(/windows mobile/i)
  return !(t || i || r || n || a || o || s || l)
}
```

## dateFormater：格式化时间

```js
function dateFormater(formater, t) {
  let date = t ? new Date(t) : new Date(),
    Y = date.getFullYear() + '',
    M = date.getMonth() + 1,
    D = date.getDate(),
    H = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds()
  return formater
    .replace(/YYYY|yyyy/g, Y)
    .replace(/YY|yy/g, Y.substr(2, 2))
    .replace(/MM/g, (M < 10 ? '0' : '') + M)
    .replace(/DD/g, (D < 10 ? '0' : '') + D)
    .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
    .replace(/mm/g, (m < 10 ? '0' : '') + m)
    .replace(/ss/g, (s < 10 ? '0' : '') + s)
}
// dateFormater('YYYY-MM-DD HH:mm', t) ==> 2019-06-26 18:30
// dateFormater('YYYYMMDDHHmm', t) ==> 201906261830
```

## dateStrForma：将指定字符串由一种时间格式转化为另一种

from 的格式应对应 str 的位置

```js
function dateStrForma(str, from, to) {
  //'20190626' 'YYYYMMDD' 'YYYY年MM月DD日'
  str += ''
  let Y = ''
  if (~(Y = from.indexOf('YYYY'))) {
    Y = str.substr(Y, 4)
    to = to.replace(/YYYY|yyyy/g, Y)
  } else if (~(Y = from.indexOf('YY'))) {
    Y = str.substr(Y, 2)
    to = to.replace(/YY|yy/g, Y)
  }

  let k, i
  ;['M', 'D', 'H', 'h', 'm', 's'].forEach((s) => {
    i = from.indexOf(s + s)
    k = ~i ? str.substr(i, 2) : ''
    to = to.replace(s + s, k)
  })
  return to
}
// dateStrForma('20190626', 'YYYYMMDD', 'YYYY年MM月DD日') ==> 2019年06月26日
// dateStrForma('121220190626', '----YYYYMMDD', 'YYYY年MM月DD日') ==> 2019年06月26日
// dateStrForma('2019年06月26日', 'YYYY年MM月DD日', 'YYYYMMDD') ==> 20190626

// 一般的也可以使用正则来实现
//'2019年06月26日'.replace(/(\d{4})年(\d{2})月(\d{2})日/, '$1-$2-$3') ==> 2019-06-26
```

## GetUrlParam：获取 Url 参数，返回一个对象

```js
function GetUrlParam() {
  let url = document.location.toString()
  let arrObj = url.split('?')
  let params = Object.create(null)
  if (arrObj.length > 1) {
    arrObj = arrObj[1].split('&')
    arrObj.forEach((item) => {
      item = item.split('=')
      params[item[0]] = item[1]
    })
  }
  return params
}
// ?a=1&b=2&c=3 ==> {a: "1", b: "2", c: "3"}
```

## downloadFile：base64 数据导出文件，文件下载

```js
function downloadFile(filename, data) {
  let DownloadLink = document.createElement('a')

  if (DownloadLink) {
    document.body.appendChild(DownloadLink)
    DownloadLink.style = 'display: none'
    DownloadLink.download = filename
    DownloadLink.href = data

    if (document.createEvent) {
      let DownloadEvt = document.createEvent('MouseEvents')

      DownloadEvt.initEvent('click', true, false)
      DownloadLink.dispatchEvent(DownloadEvt)
    } else if (document.createEventObject) DownloadLink.fireEvent('onclick')
    else if (typeof DownloadLink.onclick == 'function') DownloadLink.onclick()

    document.body.removeChild(DownloadLink)
  }
}
```

## toFullScreen：全屏

```js
function toFullScreen() {
  let elem = document.body
  elem.webkitRequestFullScreen
    ? elem.webkitRequestFullScreen()
    : elem.mozRequestFullScreen
    ? elem.mozRequestFullScreen()
    : elem.msRequestFullscreen
    ? elem.msRequestFullscreen()
    : elem.requestFullScreen
    ? elem.requestFullScreen()
    : alert('浏览器不支持全屏')
}
```

## exitFullscreen：退出全屏

```js
function exitFullscreen() {
  let elem = parent.document
  elem.webkitCancelFullScreen
    ? elem.webkitCancelFullScreen()
    : elem.mozCancelFullScreen
    ? elem.mozCancelFullScreen()
    : elem.cancelFullScreen
    ? elem.cancelFullScreen()
    : elem.msExitFullscreen
    ? elem.msExitFullscreen()
    : elem.exitFullscreen
    ? elem.exitFullscreen()
    : alert('切换失败,可尝试Esc退出')
}
```

## requestAnimationFrame：window 动画

```js
window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  function (callback) {
    //为了使setTimteout的尽可能的接近每秒60帧的效果
    window.setTimeout(callback, 1000 / 60)
  }

window.cancelAnimationFrame =
  window.cancelAnimationFrame ||
  Window.webkitCancelAnimationFrame ||
  window.mozCancelAnimationFrame ||
  window.msCancelAnimationFrame ||
  window.oCancelAnimationFrame ||
  function (id) {
    //为了使setTimteout的尽可能的接近每秒60帧的效果
    window.clearTimeout(id)
  }
```

## max：求取数组中非 NaN 数据中的最大值

```js
function max(arr) {
  arr = arr.filter((item) => !_isNaN(item))
  return arr.length ? Math.max.apply(null, arr) : undefined
}
//max([1, 2, '11', null, 'fdf', []]) ==> 11
```

## min：求取数组中非 NaN 数据中的最小值

```js
function min(arr) {
  arr = arr.filter((item) => !_isNaN(item))
  return arr.length ? Math.min.apply(null, arr) : undefined
}
//min([1, 2, '11', null, 'fdf', []]) ==> 1
```

## random：返回一个 lower - upper 之间的随机数

```js
function random(lower, upper) {
  lower = +lower || 0
  upper = +upper || 0
  return Math.random() * (upper - lower) + lower
}
//random(0, 0.5) ==> 0.3567039135734613
//random(2, 1) ===> 1.6718418553475423
//random(-2, -1) ==> -1.4474325452361945
```

## performance.timing：利用 performance.timing 进行性能分析

```js
window.onload = function () {
  setTimeout(function () {
    let t = performance.timing
    console.log(
      'DNS查询耗时 ：' + (t.domainLookupEnd - t.domainLookupStart).toFixed(0)
    )
    console.log('TCP链接耗时 ：' + (t.connectEnd - t.connectStart).toFixed(0))
    console.log(
      'request请求耗时 ：' + (t.responseEnd - t.responseStart).toFixed(0)
    )
    console.log(
      '解析dom树耗时 ：' + (t.domComplete - t.domInteractive).toFixed(0)
    )
    console.log(
      '白屏时间 ：' + (t.responseStart - t.navigationStart).toFixed(0)
    )
    console.log(
      'domready时间 ：' +
        (t.domContentLoadedEventEnd - t.navigationStart).toFixed(0)
    )
    console.log(
      'onload时间 ：' + (t.loadEventEnd - t.navigationStart).toFixed(0)
    )

    if ((t = performance.memory)) {
      console.log(
        'js内存使用占比 ：' +
          ((t.usedJSHeapSize / t.totalJSHeapSize) * 100).toFixed(2) +
          '%'
      )
    }
  })
}
```

## 禁止某些键盘事件

```js
document.addEventListener('keydown', function (event) {
  return (
    !(
      (
        112 == event.keyCode || //F1
        123 == event.keyCode || //F12
        (event.ctrlKey && 82 == event.keyCode) || //ctrl + R
        (event.ctrlKey && 78 == event.keyCode) || //ctrl + N
        (event.shiftKey && 121 == event.keyCode) || //shift + F10
        (event.altKey && 115 == event.keyCode) || //alt + F4
        ('A' == event.srcElement.tagName && event.shiftKey)
      ) //shift + 点击a标签
    ) || (event.returnValue = false)
  )
})
```

## 禁止右键、选择、复制

```js
;['contextmenu', 'selectstart', 'copy'].forEach(function (ev) {
  document.addEventListener(ev, function (event) {
    return (event.returnValue = false)
  })
})
```

```

```
