---
title: JS代码片段
date: 2018-01-15 16:27:23
tags:
---

搬砖时的 JS 代码片段整理

<!--more-->

## 将 bytes 格式化

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
    var resultArr = filename.split('.')
    var result = '.' + resultArr[resultArr.length - 1]
    return result
  } else return ''
}
```

## 冒泡排序

```javascript
function bubbleSort(arr) {
  var i = arr.length,
    j
  var tempExchangVal
  while (i > 0) {
    for (j = 0; j < i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        tempExchangVal = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = tempExchangVal
      }
    }
    i--
  }
  return arr
}

var arr = [3, 2, 4, 9, 1, 5, 7, 6, 8]
var arrSorted = bubbleSort(arr)
console.log(arrSorted)
alert(arrSorted)
```

## 快速排序算法

快速排序是处理大数据急最快的排序算法之一。它是一种分而治之的算法，通过递归的方式将数据一次分解为包含较小元素和较大元素的不同子序列。

![img caption](/images/common/kuaipai.png)

```javascript
function quickSort(array) {
  if (array.length == 0) {
    return []
  }
  var left = []
  var right = []
  var priot = array[0]

  for (var i = 1; i < array.length; i++) {
    if (array[i] < privot) {
      left.push(array[i])
    } else {
      right.push(array[i])
    }
  }
  return quickSort(left).concat(privot, quickSort(right))
}
```

## JS 深度克隆

```javascript
function deepClone(obj) {
  var _toString = Object.prototype.toString

  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj
  }

  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true)
  }

  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime())
  }

  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    var flags = []
    if (obj.global) {
      flags.push('g')
    }
    if (obj.multiline) {
      flags.push('m')
    }
    if (obj.ignoreCase) {
      flags.push('i')
    }

    return new RegExp(obj.source, flags.join(''))
  }

  var result = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {}

  for (var key in obj) {
    result[key] = deepClone(obj[key])
  }

  return result
}

function A() {
  this.a = a
}

var a = {
  name: 'qiu',
  birth: new Date(),
  pattern: /qiu/gim,
  container: document.body,
  hobbys: ['book', new Date(), /aaa/gim, 111]
}

var c = new A()
var b = deepClone(c)
console.log(c.a === b.a)
console.log(c, b)
```
