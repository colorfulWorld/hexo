---
title: angular 基础
categories: angular
comments: true
---

## angular 与 vue 的区别

* angular2 全部采用 TypeScript 编写，TypeScript （编译工具），它为 JS 带来了类似于 Java 和 C# 的静态类型，
* vue 的双向绑定基于 ES5 的 getter/setter 来实现的，而 angular 是由自己实现一套模板编译规则们需要进行 “ 脏 ” 检查，而 vue 不需要，因此 vue 在性能上更高效。
* angular 中，当 watcher 越来越多时会越来越慢，因为作用域的每一次变化

<!--more-->

## angular

* 组件化，数据的单向中心。es6 的语法。angular.js 是通过脏值检测的方式比对数据是否有变更，来决定是否更新视图，最简单的方式就是通过 setInterval() 定时轮询检测数据变动，当然 Google 不会这么 low，angular 只有在指定的事件触发时进入脏值检测，大致如下：
* DOM 事件，譬如用户输入文本，点击按钮等。( ng-click )
* XHR 响应事件 ( $http )
* 浏览器 Location 变更事件 ( $location )
* Timer 事件 ( $timeout , $interval )
* 执行 $digest() 或 $apply()

## react

* 速度很快：来源于虚拟 DOM，只有在调用 get 和 set 的时候才会更新 DOM，而且是先更新虚拟 DOM 再更新实际的 DOM，由此更新 DOM 的次数少内容也会少很多。
* FLUX 架构，react 更关注 UI 的组件化和数据的单向更新。可以直接有 es6 的一些语法。
* 服务器端渲染，单页应用的缺陷是对于搜索引擎有很大的限制。react 的解决的方案是在服务器上预渲染应用然后发送到服务端，但是爬虫是依赖的服务端的响应而不是 web 的执行。
* 目标是 UI。
* 本身是一个 MVC 中的 V。

---

## Angular 为表单内置了 4 种 css 样式

* ng-valid 校验合法状态
* ng-invalid 校验非法状态
* ng-pristine 如果要使用原生的 form，需要设置这个值
* ng-dirty 表单处于脏数据状态

---

## @Component

* @Component 是 Angular 提供的装饰函数，用来描述 Component 的元数据
* selector 指这个组件在 HTML 模板中的标签是什么
* template 是嵌入（inline ）的 HTML 模板，如果使用单独文件可用 templateUrl。
* styles 是嵌入（inline ）的 CSS 样式，如果使用单独文件可用 styleUrls。
* providers 列出会在此模块中 “ 注入 ” 的服务 (service)- 依赖注入
* bootstrap 指明哪个组件为引导组件 ( 比如 AppComponent), 当 angular 引导应用时，它会在 Dom 中渲染这个引导性组件，并把结果放进 index.html 的该组件的标签中。

## @NgModule

@NgModule 装饰器用来为模块定义元数据。declarations 列出了应用中的顶层组件，在 module 里面声明的组件在 module 范围内都可以直接使用，也就是说在同一 module 里面的任何 Component 都可以在其模板文件中直接使用声明的组件，就想我们在 AppComponent 的模板末尾加上 <app-login></app-login> 一样。

```javascript
import { HttpModule } from '@angular/http'

import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component'

@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [BrowserModule, FormsModule, HttpModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

NgModule 装饰器用来为模块定义元数据。

* declarations 列出了应用中的顶层组件。
* BrowerModule 提供了运行在浏览器中的应用所需要的关键服务 (service) 和指令 (Directive), 这个模块所在需要在浏览器中跑的应用都应用引用。
* FormsModule 提供了表单处理和双向绑定等服务和指令。
* HttpModule 提供 Htpp 请求和响应的服务。
* providers 列出会在此模版中 “ 注入 ” 的服务（service ）。
* bootstrap 指明哪个组件为引导性组件，并把结果放到 index.html 的该组件的元素标签中。
* 静态引导 AppModuleNgFactory platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);

---

## 依赖注入

如果不使用依赖注入，则需要 // 声明成员变量，其类型为 service 里面自定义的方法

    ```javascript
    //第一种：
    service:AuthService;

    constructor(){
        this.service = new AuthService();//在构造中初始化service
    }
    //第二种：

    providers: [
    {provide: 'auth',  useClass: AuthService}
    ]
    ```

* 第一种：由于实例化是在组件中进行的，意味着我们如果更改 service 的构造函数的话，组件也需要更改。如果使用依赖注入的话，就不需要显示声明成员变量 service。当 import 相关的服务后，这是 import 将类型引入进来，而 provider 里面会配置这个类型的实例。
* provider 是一个数组，这里配置将要注入到其他组件中的服务配置。provide 定义了这个服务的名称，有需要注入这个服务的就引用这个名称就好。useClass 指明这个名称对应的服务是一个类。这样定义之后就能在任意组件中注入这个依赖了。

```javascript
       onstructor(@Inject('auth') private service) {
   }
```

* @inject('auth'), 这个修饰符的意思是请到系统配置中找到名称为 auth 的那个依赖注入到我修饰的变量中。

## 双向数据绑定

* [(ngModel)]="username" ,[] 的作用是将等号后面当成表达式来解析而不是当成字符串，如果去掉 [] 就是将 ngModel 赋值成 username 这个字符串。[] 的含义是单向绑定，就是将组件中给 model 赋的值会设置到 HTML 的 input 控件中。[()]是双向绑定。ngModel 是 FormModule 中提供的指令，它负责从 Domain Model 中创建一个 FormControl 的实例，并将这个实例和表单控件绑定 .
* @Input() 是输入型绑定的修饰符，用于从数据从父组件传到子组件。

---

## 表单验证

```html
    <div>
        <input required type="text"
            [(ngModel)]="username"
            #usernameRef="ngModel"
            />
            {{usernameRef.valid}}
        <input required type="password"
            [(ngModel)]="password"
            #passwordRef="ngModel"
            />
            {{passwordRef.valid}}
        <button (click)="onClick()">Login</button>
        </div>
        <div>
        <input #usernameRef type="text">
        <button (click)="onClick(usernameRef.value)">Login</button>
        </div>
```

1. 通过 #usernameRef = 'ngModel' 重新加入了引用，这个引用指向了 ngModel, 这个引用是要在模板中使用的所以加入这个引用。
2. 在输入框中加入 #usernameRef，这个叫引用，引用的是 input 对象，如果想要传递 input 的值，可以用 usernameRef.value.

```html
    <div>
        <input type="text"
            [(ngModel)]="username"
            #usernameRef="ngModel"
            required
            minlength="3"
            />
            {{ usernameRef.errors | json }}
            <div *ngIf="usernameRef.errors?.required">this is required</div>
            <div *ngIf="usernameRef.errors?.minlength">should be at least 3 charactors</div>
        <input required type="password"
            [(ngModel)]="password"
            #passwordRef="ngModel"
            />
            <div *ngIf="passwordRef.errors?.required">this is required</div>
        <button (click)="onClick()">Login</button>
    </div>
```

\*ngIf = "usernameRef.error?.required" 的意思是当 usernameRef.error.required 为 true 的时候显示 div 标签

```html
    <div>
        <form #formRef="ngForm" (ngSubmit)="onSubmit(formRef.value)">
        <fieldset ngModelGroup="login">
            <input type="text"
            name="username"
            [(ngModel)]="username"
            #usernameRef="ngModel"
            required
            minlength="3"
            />
            <div *ngIf="usernameRef.errors?.required">this is required</div>
            <div *ngIf="usernameRef.errors?.minlength">should be at least 3 charactors</div>
            <input type="password"
            name="password"
            [(ngModel)]="password"
            #passwordRef="ngModel"
            required
            />
            <div *ngIf="passwordRef.errors?.required">this is required</div>
            <button (click)="onClick()">Login</button>
            <button type="submit">Submit</button>
            </fieldset>
        </form>
        </div>
```

* ngModel 会注册成 Form 的子控件，注册控件需要 name ，这个要求我们显示的指定对应控件的 name ，因此需要为 input 增加 name 属性，在 formREF.value 中包含了表单所有填写项的值

* 有时在表单相中表单项过多时，就使用 HTML 中的 fieldset 标签用来处理。<fieldset ngModelGroup="login"> 意味着我们对于 fieldset 之内的数据都分组到了 login 对象中。

---

## 路由

路径配置的顺序是非常重要的，angular2 使用 “ 先匹配优先 ” 的原则。

* redirectTo 重定向
  ## service

```javascript
    //post /todos
    addTodo(desc:string):Promise<Todo>{
        let todo={
            id:UUID.UUID(),
            desc:desc,
            completed:false
        };
        return this.http
            .post(this.api_url,JSON.stringfy(todo),{header:this.headers})
            .toPromise()
            .then(res=>res.json().data as Todo)
            .catch(this.handleError);
    }
```

---

````javascript
    inputValue: string = '';
    @Input() placeholder: string = 'What needs to be done?';
    @Input() delay: number = 300;

    //detect the input value and output this to parent
    @Output() textChanges = new EventEmitter<string>();
    //detect the enter keyup event and output this to parent
    @Output() onEnterUp = new EventEmitter<boolean>();
    ```
- placeholder和delay作为2个输入型变量，这样在引入标签中就可以设置这两个属性了。
- 由@Output修饰的onTextChanges 和 onEnterUp，这两个变量都定义了EventEmitter(事件发射器)。
- export const routing = RouterModule.forChild(routes);，用的是forChild而不是forRoot,因为forRoot只能用于根目录，所有非跟模块的其他模块都只能用forChild.


--------------------------
## 验证用户帐户的流程
- UserService:用于通过用户名查找用户并返回用户
- AuthService:用于认证用户，其中需要利用UserService 的方法。
- AuthGuard:路由拦截器，用于拦截到路由后通过Authservice来知道此用户是否有权限访问路由。根据结果导航到不同路径。
- @SkipSelf装饰器意味着在当前注入器的所有祖先注入器中寻找，如果注入器找不到想要的提供商时就会抛出一个错误。但是@Optional装饰器表示找不到该服务则会返回null,
parentModule参数也就被赋值为空。

----------------
## 路由守卫
应用场景如下:
该用户可能无权导航到目标组件。导航前需要用户先登录。

路由器支持多种守卫：

- 用CanActivate来处理导航到某路由的情况。
- 用CanActivateChild处理导航到子路由的情况。
- 用CanDeactivate来处理从当前路由离开的情况。
- 用Resolve在路由激活之前获取路由数据。
- 用CanLoad来处理异步导航到某特性模块的情况。

----------------------
## 模块优化
 各个模块定义，发现我们不断地重复引入了CommonModule、FormsModule、MdlModule,这些组件常用，就可以建立一个ShareModule(src\app\shared\shared.module.ts)

```javascript
    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { FormsModule } from '@angular/forms';
    import { MdlModule } from 'angular2-mdl';

    @NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MdlModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        MdlModule
    ]
    })
    export class SharedModule { }
````

这个模块的作用是将常用的模块打包起来，将常用的模块导入又导出，这样在其他模块中值需引入这个模块即可
