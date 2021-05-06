---
title: JavaScript动态规划和贪心算法
date: 2019-07-24 09:58:16
categories: JavaScript
---

自从做了一个树的深度搜索、广度查询、树的之后，我就深刻的意识到自己对算法和数据结构一无所知，做出来的方案总感觉不是最优解。

<!--more-->

这里记录两种常用的算法：动态规划和贪心算法。动态规划常被人比作是递归的逆过程，而贪心算法在很多求有问题上，是不二之选。

# 动态规划

动态规划为什么会被认为是递归相反的技术呢，是因为递归是从顶部开始将问题分解，通过解决掉所有小问题的方式，来解决整个问题，动态规划是从底部开始解决问题，将所有小问题解决掉，然后合并成整个大的问题。

递归算法写法简单但是效率并不高。

## 斐波拉契数列

斐波拉契数列 定义为一下序列：0,1,1,2,3,5,8,13,21,34,55

公式为：n>=2,a<sub>n</sub> = a<sub>n-1</sub>+a <sub>n-2</sub>,这个序列是用来描述在理想状况下兔子的增长情况。

若是用递归实现：

```javascript
function fibo(n) {
  if (n <= 0) {
    return 0
  }
  if (n === 1) {
    return 1
  }
  return fibo(n - 1) + fibo(n - 2)
}
```

这种实现方式非常耗性能，在 n 的数量级到达千级别就会变得特别慢，甚至失去响应。

优化方案：

```javascript
function fibo(n) {
  if (n <= 0) return 0
  if (n <= 1) return 1
  var a = 0,
    b = 1
  for (var i = 2; i <= n; i++) {
    b = a + b
    a = b - a
  }
  return b
}
```

## 寻找最长公共子串

例如在 hello 和 wellcome 中最长子串是 ell

一种暴力的办法：

```javascript
function maxSubString(str1, str2) {
  if (!str1 || !str2) return ''
  var len1 = str1.length,
    len2 = str2.length
  var maxSubStr = ''
  for (var i = 0; i < len1; i++) {
    for (var j = 0; j < len2; j++) {
      var tempStr = '',
        k = 0
      while (i + k < len1 && j + k < len2 && str1[i + k] === str2[j + k]) {
        tempStr += str1[i + k]
        k++
      }
      if (tempStr.length > maxSubStr.length) {
        maxSubStr = tempStr
      }
    }
  }
  return maxSubStr
}
```

而且上面不考虑多个一样长的情况吗？

```javascript
function findSubStr(str1, str2) {
  if (str1.length > str2.length) {
    var temp = str1
    str1 = str2
    str2 = temp
  }
  var len1 = str1.length,
    len2 = str2.length
  for (var j = len1; j > 0; j--) {
    for (var i = 0; i < len1 - j; i++) {
      var current = str1.substr(i, j)
      if (str2.indexOf(current) >= 0) {
        return current
      }
    }
  }
  return ''
}
console.log(findSubStr('aaa3333', 'baa333cc')) // aa333
console.log(findSubStr('aaaX3333--', 'baa333ccX3333333x')) // X3333
```
