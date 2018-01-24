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

 fileSizeFormat(bytes, fixedDigits, unitFlag, floorFlag) {
      bytes = parseFloat(bytes)
      let absBytes = Math.abs(bytes)
      let humanSize, unit

      if (fixedDigits === undefined) {
        fixedDigits = 2
      }
      if (unitFlag === undefined) {
        unitFlag = true
      }

      if (absBytes < 1024) {
        fixedDigits = 0
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
            if (absBytes < 900 * 1073741824 || (fixedDigits === 0 && absBytes < 1048576 * 1048576)) {
              humanSize = bytes / 1073741824
              unit = 'G'
            } else {
              humanSize = bytes / (1048576 * 1048576)
              unit = 'T'
            }
          }
        }
        humanSize = Math.round(humanSize * Math.pow(10, fixedDigits)) / parseFloat(Math.pow(10, fixedDigits))
        humanSize = humanSize.toFixed(fixedDigits)

        let result
        if (floorFlag && fixedDigits > 0) {
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
