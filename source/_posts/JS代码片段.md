---
title: JS代码片段
date: 2018-01-15 16:27:23
categories: 原生JS
---

搬砖时的 JS 代码片段整理

<!--more-->

# 将 bytes 格式化

```javascript
let total = this.fileSizeFormat(spaceSize, 2, true, false)

 fileSizeFormat(bytes, digits, unitFlag, floorFlag) {
      bytes = parseFloat(bytes)
      let absBytes = Math.abs(bytes)
      let humanSize, unit

      if (digits === undefined) {
        digits = 2
      }
      if (unitFlag === undefined) {
        unitFlag = true
      }

      if (absBytes < 1024) {
        digits = 0
        humanSize = bytes
        unit = 'B'
      } else {
        if (absBytes < 900 * 1024) {
          humanSize = bytes / 1024
          unit = 'K'
        } else {
          if (absBytes < 900 * 1048576) {
            humanSize = bytes / 1048576
            unit = 'M'
          } else {
            if (absBytes < 900 * 1073741824 || (digits === 0 && absBytes < 1048576 * 1048576)) {
              humanSize = bytes / 1073741824
              unit = 'G'
            } else {
              humanSize = bytes / (1048576 * 1048576)
              unit = 'T'
            }
          }
        }
        humanSize = Math.round(humanSize * Math.pow(10, digits)) / parseFloat(Math.pow(10, digits))
        humanSize = humanSize.toFixed(digits)

        let result
        if (floorFlag && digits > 0) {
          if (humanSize !== Math.floor(humanSize)) {
            result = humanSize
          } else {
            result = parseInt(Math.floor(humanSize), 10)
          }
        } else {
          result = humanSize
        }
        if (unitFlag) {
          result = result + unit
        }

        return result
      }
    }
```

## 获取文件扩展名

```javascript
const extname = filename => {
  if (filename.indexOf('.') > 0) {
    var resultArr = filename.split('.');
    var result = '.' + resultArr[resultArr.length - 1];
    return result;
  } else return '';
};
```

## 冒泡排序

```javascript
function bubbleSort(arr) {
  var i = arr.length,
    j;
  var tempExchangVal;
  while (i > 0) {
    for (j = 0; j < i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        tempExchangVal = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tempExchangVal;
      }
    }
    i--;
  }
  return arr;
}

var arr = [3, 2, 4, 9, 1, 5, 7, 6, 8];
var arrSorted = bubbleSort(arr);
console.log(arrSorted);
alert(arrSorted);
```

## 快速排序算法

快速排序是处理大数据急最快的排序算法之一。它是一种分而治之的算法，通过递归的方式将数据一次分解为包含较小元素和较大元素的不同子序列。

![img caption](/images/common/kuaipai.png)

```javascript
function quickSort(array) {
  if (array.length == 0) {
    return [];
  }
  var left = [];
  var right = [];
  var priot = array[0];

  for (var i = 1; i < array.length; i++) {
    if (array[i] < privot) {
      left.push(array[i]);
    } else {
      right.push(array[i]);
    }
  }
  return quickSort(left).concat(privot, quickSort(right));
}
```

## JS 深度克隆

```javascript
function deepClone(obj) {
  var _toString = Object.prototype.toString;

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true);
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime());
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    var flags = [];
    if (obj.global) {
      flags.push('g');
    }
    if (obj.multiline) {
      flags.push('m');
    }
    if (obj.ignoreCase) {
      flags.push('i');
    }

    return new RegExp(obj.source, flags.join(''));
  }

  var result = Array.isArray(obj)
    ? []
    : obj.constructor
    ? new obj.constructor()
    : {};

  for (var key in obj) {
    result[key] = deepClone(obj[key]);
  }

  return result;
}

function A() {
  this.a = a;
}

var a = {
  name: 'qiu',
  birth: new Date(),
  pattern: /qiu/gim,
  container: document.body,
  hobbys: ['book', new Date(), /aaa/gim, 111]
};

var c = new A();
var b = deepClone(c);
console.log(c.a === b.a);
console.log(c, b);
```

## Javascript 的节流和防抖

函数节流和函数防抖，两者都是优化高频率执行 JS 代码的一种手段。

### 函数节流

防抖动和节流本质是不一样的。放

是指一定时间内 js 方法只跑一次。

函数节流应用的实际场景，多数在监听页面元素滚动时间的时候会用到。因为滚动事件，是一个高频触发的事件。以下是监听页面元素滚动的示例代码：

```javascript
//函数节流
var canRun = true;
document.getElementById('throttle').onsroll = function() {
  if (!canRun) {
    //判断是否空闲，如果在执行中，则直接return
    return;
  }
  canRun = false;
  setTimeout(function() {
    console.log('函数节流');
    canRun = true;
  }, 300);
};
```

### 函数防抖

函数防抖的应有场景，最常见的就是用户注册的时候的手机号码验证和邮箱验证了。只有等用户输入完毕后，前端才需要检查格式是否正确，如果不正确，在弹出提示语。以下还是以页面元素滚动监听的例子，来解析：

```javascript
//函数防抖
var timer = fasle;
document.getElementById('document').onsrcoll = function() {
  clearTimeout(timer).timer = setTimeout(function() {
    //清楚未执行的代码，重置回初始状态
    console.log('函数防抖');
  }, 300);
};

// func是用户传入需要防抖的函数
// wait是等待时间
const debounce = (func, wait = 50) => {
  // 缓存一个定时器id
  let timer = 0;
  // 这里返回的函数是每次用户实际调用的防抖函数
  // 如果已经设定过定时器了就清空上一次的定时器
  // 开始一个新的定时器，延迟执行用户传入的方法
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};
// 不难看出如果用户调用该函数的间隔小于wait的情况下，上一次的时间还未到就被清除了，并不会执行函数
```

函数防抖的要点，也是需要一个 setTimeout 来辅助实现。延迟执行需要跑的代码

但是这种简单版的防抖也是缺陷的，这个防抖只能在最后调用。一般的防抖会有 imm 选项，表示是否立即调用。这两者的区别在于：

- 在搜索引擎搜索问题的时候，希望达到用户数万最后一个字才调用查询整个接口，这个时候适用`延迟执行`的防抖函数，它总是在一连串（间隔小于 wait 的）函数出发之后才调用。
- 例如在用户点击按钮时，是立即调用接口，并且下一次调用时间间隔大于 wait 才会触发。

带有立即执行选项的防抖函数

```javascript
function now() {
  //获取当前时间戳
  return +new Date();
}
/**
 * 防抖函数，返回函数连续调用时，空闲时间必须大于或等于 wait，func 才会执行
 *
 * @param  {function} func        回调函数
 * @param  {number}   wait        表示时间窗口的间隔
 * @param  {boolean}  immediate   设置为ture时，是否立即调用函数
 * @return {function}             返回客户调用函数
 */

function debounce(func, wait = 50, immediate = true) {
  let timer, context, args;

  // 延迟执行函数
  const later = () =>
    setTimeout(() => {
      // 延迟函数执行完毕，清空缓存的定时器序号
      timer = null;
      // 延迟执行的情况下，函数会在延迟函数中执行
      // 使用到之前缓存的参数和上下文
      if (!immediate) {
        func.apply(context, args);
        context = args = null;
      }
    }, wait);

  // 这里返回的函数是每次实际调用的函数
  return function(...params) {
    // 如果没有创建延迟执行函数（later），就创建一个
    if (!timer) {
      timer = later();
      // 如果是立即执行，调用函数
      // 否则缓存参数和调用上下文
      if (immediate) {
        func.apply(this, params);
      } else {
        context = this;
        args = params;
      }
      // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
      // 这样做延迟函数会重新计时
    } else {
      clearTimeout(timer);
      timer = later();
    }
  };
}
```

## 图片上传 小图片转 base64

```javascript
let reader = new FileReader();
let imgUrlBase64 = reader.readAsDataURL(file);
reader.onload = function(e) {
  reader.result.length; //去判断大小 reader.result就是
};
```

### FileReader

`FileReader`对象允许 WEB 应用程序异步读取存储在用户及上级上的文件（或原始数据缓冲）的内容,使用`File`和`Blob`对象指定要读取的文件或数据。

其中 file 对象可以是来自用户在一个`<input>`元素上悬着文件后返回的 filelist 对象，也可以来自拖放操作生成的`DataTransfer`对象，还可以是来自一个`HTMLCanvasElement`上执行`mozGetAsFile()`方法后返回结果。

`FileReader.readyState`表示 FileReader 状态的数字。取值如下：

- EMPTY: 0 还没有加载任何数据。
- LOADING: 1 数据正在加载。
- DONE：2 已经完成全部的读取请求。

`FileReader.result`表示文件内容。该属性仅在读取操作完成后才有效，数据的格式取决于使用哪个方法来启动读取操作。

`FileReader.readAsDataURL()`表示开始读取指定的 Blob 中的内容。一旦完成，result 属性中将包含一个 data:URL 格式的字符串以表示所读取文件的内容。

## 查找数组对象里面是否含有某对象

查找 selectedList 里面是否存在 listAppEquipment 数组里面的对象

```javascript
let selectedListString = JSON.stringify(that.selectedList);
that.listAppEquipment.forEach((item: any) => {
  let value = JSON.stringify(item.value);
  if (selectedListString.indexOf(value) != -1) {
    item.checked = true;
    item.selected = true;
  }
});
```
