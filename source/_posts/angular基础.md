---
title: angular 基础
comments: true
---
## angular 与 vue 的区别
- angular2全部采用TypeScript编写，TypeScript（编译工具），它为JS带来了类似于Java 和C# 的静态类型，
- vue 的双向绑定基于ES5 的getter/setter 来实现的，而angular是由自己实现一套模板编译规则们需要进行“脏”检查，而vue不需要，因此vue在性能上更高效。
- angular 中，当watcher 越来越多时会越来越慢，因为作用域的每一次变化

——————————————————————
## 快速起步
@Component 装饰器

----------------------------
## Angular 为表单内置了4种css样式

- ng-valid 校验合法状态
- ng-invalid 校验非法状态
- ng-pristine 如果要使用原生的form，需要设置这个值
- ng-dirty 表单处于脏数据状态
-----------------------------

## @Component 
@Component是Angular提供的装饰器函数，用来描述Compoent的元数据
