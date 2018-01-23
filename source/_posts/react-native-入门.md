---
title: react-native 入门
categories: react-native
tags:
---

react-native 入门基础笔记：使用 ：react-native init AwesomeProject 进行构建 react-native 项目

<!--more-->

## react-native 目录详解

里面有四个文件夹：

* android / ios ：各自存放了一个相关平台的工程 project，可以直接下拉 JS Bundle 并运行，对于 移动端小白而言可以不用管里面的具体实现；
* node_modules ：里面是自动生成的 node 依赖之类的文件，通过读取 package.json 里的配置来生成；
* js ：这个文件夹最为重要，我们的开发都在这个文件夹里，把写好的 js 文件打包下发给 client 就会自
