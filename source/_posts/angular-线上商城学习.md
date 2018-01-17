---
title: angular 线上商城学习
categories: angular
---

使用 angular 开发线上商城

<!--more-->

## 创建 angular 工程

1. ng new action
2. 引入第三方的包是通过更改 angular-cli 来实现的。
3. e2e: 是存放端到端的测试目录，是用来做自动化测试
4. protractor.conf.js 自动化测试文件
5. tsconfig.json 是 tsLink 的配置文件是用于 javascript 的代码检查。
6. assets 是用来存放静态资源的。
7. environments 开发、测试、生产环境的配置，多环境的开发。
8. main.ts 整个整个 web 应用的入口点，也是脚本的执行的入口点，通过这个文件启动 angular 整个项目。
9. polyfills.ts 使用来导入一些必要的库。使 angular 能正常的运行在某一些老版本的浏览器。
10. styles.css 用来编写全局使用的 css。

## 组件

* component 是整个应用的基础。
* @Component() 装饰器 : 用来告知 angular 框架如何处理一个 TypeScript 类， @Component() 装饰器 包含多个属性，属性的值叫做
  元数据，angular 会根据这些元数据进行渲染组件，并执行相应的逻辑。
* Template 模板 ，通过组建自带的模板来定义组件的外观，模板以 html 存在，用来呈现控制器中的数据。
* Controller 控制器 会被 @Component() 来装饰。用以处理模板中的数据。
* 所有组件都必须使用 @Component() 装饰器进行注解。

```angular
@Component{
  selector:'app-root',//元数据
  templateUrl:'./app.component.html',
  styleUrls:['./app.component.css'],
}

export class AppComponent{ //暴露为一个组件 ，TypeScript 类，为控制器
  title = 'app worker'
}
```

* @input 输入属性 是用来接受外部传入的数据，使得父组件可以直接传递数据给子组件。
* providers 是用来完成依赖注入的。
* @Outputs 输出属性

## 模块

* 使用 @ngModule 声明一个模块。
* 使用 declarations 说明了模块中包含了的组件，**这个元数据里面只能用于声明组件、指令、管道**。
* providers 用于声明模块的服务。
* bootstrap 用于声明模块的主组件。

<!-- 2-3 -->
