---
title: JS原生-ES6
date: 2018-01-24 10:51:11
categories: 原生JS
---

发现自己对于 javascript 的底层 API 所知甚少，在这里记录一下所遇到的有趣又是在的 API。

<!--more-->

## set 对象 （可用于去重）

set 独享允许你存储任何类型唯一值，无论是原始值或是对象。NaN 之间视为相同的值。

```javascript
引用 const set1 = new Set([1,1, 2, NaN, NaN, 5]);

console.log(set1.has(1)); // expected output: true

console.log(set1.has(5)); // expected output: true

console.log(set1.has(6)); // expected output:false

console.log(Array.from(set1)) // Array [1, 2, 3, 4, NaN, 5]
```

## Array.from()
从一个类似数组或可迭代对象中创建一个新的数组实例。
