---
title: localstorage
categories: webAPI
---

HTML5 中 Web Storage 的出现，主要是为了弥补使用 Cookie 作为本地存储的不足。**Cookie 存储的数据量非常小，而且数据会自动携带到请求头里，但服务器端可能并不关心这些数据，所以会造成带宽的浪费**。

web storage 提供了两个存储对象：localStorage 和 sessionStorage。

<!--more-->

## localStorage 和 sessionStorage

sessionStorage 存储的数据仅在本次会话有用，会话结束之后会自动失效，而且数据仅在当前窗口有效，同一源下新窗口也访问不到其他窗口基于 sessionStorage 存储的数据。也是由这些特性导致 sessionStorage 的使用场景较少。

localStorage 可以永久存储，而且同源下数据多窗口可以共享。

## localStorage 的基本使用

有两点需要注意一下。在 setItem 时，可能会达到大小限制，最好加上错误捕捉 ：

```javascript
try {
  localStorage.setItem(key, value);
} catch(e) {
  if (isQuotaExceeded(e)) {
    // Storage full, maybe notify user or do some clean-up
  }
}

function isQuotaExceeded(e) {
  var quotaExceeded = false;
  if (e) {
    if (e.code) {
      switch (e.code) {
        case 22:
          quotaExceeded = true;
          break;
        case 1014:
          // Firefox
          if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            quotaExceeded = true;
          }
          break;
      }
    } else if (e.number === -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true;
    }
  }
  return quotaExceeded;
```

另外在存储容量快满时，会造成 getItem 性能急剧下降
