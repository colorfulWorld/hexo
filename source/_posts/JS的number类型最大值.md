---
title: JS的number类型最大值
date: 2019-09-10 14:42:07
categories: JavaScript
---

遇到过几次number类型精度丢失的问题，一次是后台传的类型为number类型的 超大值，结果丢失了精度，后来就修改成string 型的就没有了这个问题，一次是对number 型进行乘除操作，后台返回了超大值，出于产品方面的考虑，数据库限定了输入长度。但我想，若是真的有对一个超长number型数字处理的话，那该如何呢？

<!--more-->

## 精度丢失的根本原因

js 的number类型有个最大值（安全值），即2的53次方，为9007199254740992，如果超出这个值，那么js 会出现不精准的问题，这个值为16位。在浏览器控制台分别输入Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER可查看对应的最大/小值

## BigInt

BigInt 是JavaScript 中一个新的原始类型，可以用任一精度表示整数。使用BigInt，即使超出JS Number 的安全整数限制，也可以安全的存储和操作大整数。

chrome 67+开始支持BigInt，本文所有demo都是基于chrome 67。

要创建BigInit,在数字后面添加n后缀即可，例如123变成123n。

BigInt是JavaScript语言中的一个原始类型。因此，可以使用typeof操作符检测到这种类型：
```javascript
typeof 123;
// → 'number'
typeof 123n;
// → 'bigint'
```

