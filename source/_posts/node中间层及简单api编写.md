---
title: node中间层及简单api编写
date: 2021-04-20 14:49:27
categories: Node
---

Node.js 对前端来说无疑具有里程碑意义，尤其是在越来越流行的今天，掌握 Node.js 技术已经不仅仅是加分项，而是前端攻城师们需要去掌握的一项技能。

<!--more-->

## Node.js 是什么

简单的说 Node.js 就是一个 javascript 运行环境。它让 javascript 可以开发后端程序，实现几乎其他后端语言实现的所有功能，可以与 PHP、Java、Python、.NET、Ruby 等后端语言一较高下。

Node.js 是一个基于 Chrome JavaScript 运行时建立的一个平台。

Node.js 是一个事件驱动 I/O 服务端 JavaScript 环境，基于 Google 的 V8 引擎，V8 引擎执行 Javascript 的速度非常快，性能非常好。
`Node.js = Runtime Environment + JavaScript Library`

## Node.js 优势

- **Nodejs 语法完全是 js 语法**
  只要你懂 js 基础就可以学会 Nodejs 后端开发，对前端开发者友好。
- **NodeJs 超强的高并发能力**
  放弃了“为每一个用户连接创建一个新线程”的思想，通过非阻塞 I/O、事件驱动机制，让 Node.js 程序宏观上也是并行的。
- **实现高性能服务器**
  严格地说，Node.js 是一个用于开发各种 web 服务器的开发工具。在 Node.js 服务器中，运行的是高性能 V8 JavaScript 脚本语言，该语言是一种可以运行在服务器端的脚本语言。

  Node.js 自身哲学，是话最小的硬件成本，追求更高的并发，更高的处理性能。

## Node.js 特点

异步事件驱动、非堵塞 I/O

- **Node.js 使用事件驱动模型，当 web server 接收到请求，就把它关闭然后进行处理，然后去服务下一个 web 请求。**
  当这个请求完成，它被放回处理队列，当到达队列开头，这个结果被返回给用户。
  这个模型非常高效可扩展性非常强，因为 webserver 一直接受请求而不等待任何读写操作。这个模型非常高效可扩展性非常强，因为 webserver 一直接受请求而不等待任何读写操作。（这也被称之为非阻塞式 IO 或者事件驱动 IO）

  在事件驱动模型中，会生成一个主循环来监听事件，当检测到事件时触发回调函数

- **单线程**

  Nodejs 跟 Nginx 一样都是单线程为基础的，这里的单线程指主线程为单线程，所有的阻塞的全部放入一个线程池中，然后主线程通过队列的方式跟线程池来协作。我们写 js 部分不需要关心线程的问题，简单了解就可以了，主要由一堆 callback 回调构成的，然后主线程在循环过在适当场合调用。

- **性能出众**

  底层选择用 c++和 v8 来实现的，上面第一点讲到过，nodejs 的事件驱动机制，这意味着面对大规模的 http 请求，nodejs 是凭借事件驱动来完成的，性能部分是不用担心的，并且很出色。

## Node.js 应用实例

```javascript
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
```

## Express 简介

Express 是一个简洁而灵活的 node.js Web 应用框架, 提供了一系列强大特性帮助你创建各种 Web 应用，和丰富的 HTTP 工具。

使用 Express 可以快速地搭建一个完整功能的网站。

Express 框架核心特性：

- 可以设置中间件来响应 HTTP 请求。
- 定义了路由表用于执行不同的 HTTP 请求动作。
- 可以通过向模板传递参数来动态渲染 HTML 页面。
- 介绍就先告一段落了，接下来通过一个项目实例来进行 node 搭建服务的讲解

## Node 简单的 api 编写

### 前言

此章节采用项目实例直接演示如何实现简单 API 的编写。前端项目采用的技术栈是基于 Vue + Antdv，用 vue-cli 构建前端界面，后端项目采用的技术栈是基于 Node.js + Express + MySQL，用 Express 搭建的后端服务器。

### 前端部分

使用 Vue + antdv，用 vue-cli 构建前端项目

#### 目录结构

```m
│ package.json // npm 包管理所需模块及配置信息
│ vue.config.js // webpack 配置
├─public
│ favicon.ico // 图标
│ index.html // 入口 html 文件
└─src
│ App.vue // 根组件
│ main.js // 程序入口文件
│ permission.js // 权限拦截
│ globla.less // 全局样式
├─api
│ task.js // 任务模块接口
│ user.js // 用户模块接口
├─assets // 存放公共图片文件夹
├─components
│ ProLayout // Pro 布局组建
├─layouts
│ index.js // 布局整合
│ UserLayout.vue // 用户布局
│ BasicLayout.vue // 基本布局
├─core
│ lazy_use.js // 懒加载使用的 antd 等
├─router
│ index.js // 单页面路由注册组件
├─store
│ │ index.js // 状态管理仓库入口文件
│ │ getters.js // getter
│ │ mutation-types.js // store 使用的常量
│ └─modules
│ user.js // 用户模块状态管理文件
├─utils
│ axios.js // 安装 axios 插件
│ domUtils.js // 操作页签 title
│ request.js // axios 封装与拦截器配置
└─views
user // 用户模块页面
task // 任务模块页面
404.vue // 404 页面
```

### MySQL 与 Navicat

MySQL 是最流行的关系型数据库管理系统，在 WEB 应用方面 MySQL 是最好的 RDBMS(Relational Database Management System：关系数据库管理系统)应用软件之一。

Navicat premium 是一款数据库管理工具,是一个可多重连线资料库的管理工具，它可以让你以单一程式同时连线到 MySQL、SQLite、Oracle 及 PostgreSQL 资料库，让管理不同类型的资料库更加的方便。

#### 数据库设计部分

使用 MYSQL，创建数据库 todo，创建 sys_user 用户表及创建 sys_task 任务表

-创建数据库--

`CREATE DATABASE `todo` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;`
--创建用户表--

```javascript
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
`id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
`username` VARCHAR(50) NOT NULL COMMENT '登录帐号',
`password` VARCHAR(64) NOT NULL  COMMENT '登录密码',
`nickname` VARCHAR(50) NULL DEFAULT '' COMMENT '昵称',
`avator` VARCHAR(50) NULL DEFAULT '' COMMENT '用户头像',
`sex` int(3) NULL DEFAULT 0 COMMENT '性别：0:未知, 1:男, 2:女',
`gmt_create` BIGINT(13) NOT NULL COMMENT '创建时间',
`gmt_modify` BIGINT(13) NOT NULL COMMENT '修改时间',
 PRIMARY KEY (`id`) USING BTREE,
 UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='用户表';
```

--创建任务表--

```javascript
DROP TABLE IF EXISTS `sys_task`;
CREATE TABLE `sys_task` (
`id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
`title` varchar(100) NOT NULL COMMENT '任务名称',
`description` varchar(255) NOT NULL COMMENT '任务内容',
`status` int(3) NULL DEFAULT 0 COMMENT '任务状态：0:待办 1:完成 2:删除',
`gmt_create` bigint(13) NOT NULL COMMENT '创建时间',
`gmt_expire` bigint(13) NOT NULL COMMENT '截止日期',
PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 COMMENT='任务表';
```

### 后端部分

使用 Node.js + Express + MySQL，搭建的后端服务器。

#### 目录结构

```m
│  app.js                             // 入口文件
│  package.json                       // npm包管理所需模块及配置信息
│  bin
│      www                            // start程序运行文件
│  config
│      db.js                          // mysql数据库基础配置
├─db
│      mysql.js                       // 封装连接mysql模块
├─routes
│      index.js                       // 初始化路由信息，引入auth中间件
│      tasks.js                       // 任务路由模块
│      users.js                       // 用户路由模块
├─controllers
│      index.js                 			 // 业务逻辑处理 - 入口
│      tasks.js                 			 // 业务逻辑处理 - 任务相关接口
│      users.js                 			 // 业务逻辑处理 - 用户相关接口
└─utils
        constant.js                   // 自定义常量
        crypto.js                     // 加密标准实现方法
        jwtAuth.js                    // jwt-token验证和解析函数
        resHandler.js                 // 包装统一返回格式
```

#### 技术栈

后端登录注册功能使用了 jwt-token 认证模式来实现。使用 express、express-validator、jsonwebtoken、express-jwt、mySQL 组件库来简化开发。

- express：提供了创建 Web 服务器的最简单但功能最强大的方法之一。
- express-validator：一个基于 Express 的数据验证中间件，可以方便的判断传入的表单数据是否合法。
- jsonwebtoken：基于 jwt 的概念实现安全的加密方案库，实现加密 token 和解析 token 的功能。
- express-jwt：express-jwt 是在 jsonwebtoken 的基础上做了上层封装，基于 Express 框架下认证 jwt 的中间件，来实现 jwt 的认证功能。
- http-errors：轻松创建 Express，Koa，Connect 等的 HTTP 错误。
- mysql：Node.js 连接 MySQL 数据库。
- nodemon：实现实时热更新，自动重启项目。

#### 功能模块

- 用户模块：登录、注册
- 任务模块：todoList 增删改查

#### 代码实现

- **安装全局依赖**

```javascript
npm install express -g or yarn global add express
npm install express-generator -g or yarn global express-generator
```

- **使用 express-generator 生成 todo_api 项目**

```javascript
mkdir todo_api
cd todo_api
express
npm install or yarn install
npm start or yarn start
```

然后访问 localhost:3000，最简单的服务器就 👌 了

- **添加自动重启服务**

  每次修改 js 文件，我们都需要重启服务器，这样修改的内容才会生效，但是每次重启比较麻烦，影响开发效果。所以我们在开发环境中引入 nodemon 插件，实现实时热更新，自动重启项目。

`yarn add nodemon -D`
修改 package.json 文件中配置的 start 命令：

```javascript
  "scripts": {
    "start": "nodemon ./bin/www"
  },
```

- **安装相关依赖库**
  `yarn add express-validator jsonwebtoken express-jwt mysql`
  ** 修改目录结构**

- **项目配置模块（Config）**
  在根目录下 config 文件夹，并新增 db.js 文件，用于 mysql 数据库基础配置

```javascript
// 配置
const MYSQL_CONF = {
  host: 'localhost',
  user: 'root',
  password: 'xzh123456',
  port: '3306',
  database: 'todo'
}

module.exports = {
  MYSQL_CONF
}
```

- **数据库模块（DB）**
  在根目录下创建 db 文件夹，并创建 mysql.js 文件，用于封装连接 mysql 模块

```javascript
const mysql = require('mysql')
const { MYSQL_CONF } = require('../config/db')

const connection = () => mysql.createConnection(MYSQL_CONF)

const querySql = (sql) => {
  const conn = connection()
  return new Promise((resolve, reject) => {
    try {
      conn.query(sql, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    } catch (e) {
      reject(e)
    } finally {
      // 释放连接
      conn.end()
    }
  })
}

module.exports = {
  querySql
}
```

- **工具模块（Utils）**
  在根目录下创建 utils 文件夹

创建 constant.js 文件，用于自定义常量

代码如下

```javascript
module.exports = {
  CODE_ERROR: "9999", // 请求响应失败code码
  CODE_SUCCESS: "0000", // 请求响应成功code码
  PRIVATE_KEY: "todo", // 自定义jwt加密的私钥
  JWT_EXPIRED: 60 * 60 * 24, // 过期时间24小时
};
创建crypto.js文件，用于加密标准实现方法
```

代码如下

```javascript
const crypto = require('crypto') // 引入crypto加密模块

const md5 = (v) => {
  return crypto
    .createHash('md5')
    .update('' + v)
    .digest('hex')
}

module.exports = {
  md5
}

const crypto = require('crypto') // 引入crypto加密模块

const md5 = (v) => {
  return crypto
    .createHash('md5')
    .update('' + v)
    .digest('hex')
}

module.exports = {
  md5
}
```

创建 jwtAuth.js 文件，用于 jwt-token 验证和解析函数
代码如下

```javascript
const expressJwt = require('express-jwt') // 引入express-jwt模块
const { PRIVATE_KEY } = require('./constant') // 引入自定义的jwt密钥

// 验证token是否过期
const jwtAuth = expressJwt({
  // 设置密钥
  secret: PRIVATE_KEY,
  // 设置为true表示校验，false表示不校验
  credentialsRequired: true,
  algorithms: ['HS256'],
  // 自定义获取token的函数
  getToken: (req) => {
    console.log(req.headers['access-token'])
    if (req.headers['access-token']) {
      return req.headers['access-token']
    } else if (req.query && req.query.token) {
      return req.query.token
    }
  }
  // 设置jwt认证白名单，比如/api/user/login登录接口不需要拦截
}).unless({
  path: ['/', '/api/user/login', '/api/user/register']
})

module.exports = {
  jwtAuth
}
```

- **路由控制层（Routes）**
  创建 index.js 文件，代码如下

```javascript
const express = require('express')
const router = express.Router()
const userRouter = require('./users')
const taskRouter = require('./tasks')

router.use('/api/user', userRouter)
router.use('/api/task', taskRouter)

module.exports = router
```

创建 users.js 文件，代码如下

```javascript
const express = require('express')
const router = express.Router()
const { userController } = require('../controllers')
const { checkSchema } = require('express-validator')

const rules = {
  loginValidator: checkSchema({
    username: {
      isLength: {
        errorMessage: 'username长度至少5位',
        options: { min: 5 }
      }
    },
    password: {
      isLength: {
        errorMessage: 'password长度至少5位',
        options: { min: 5 }
      }
    }
  })
}

// 登录
router.post('/login', rules.loginValidator, userController.login)

// 注册
router.post('/register', rules.loginValidator, userController.register)

module.exports = router
```

- **创建 tasks.js 文件，代码如下**

```javascript
const express = require('express')
const router = express.Router()
const { taskController } = require('../controllers')

// 任务列表
router.post('/list', taskController.getTaskList)

// 任务添加
router.post('/add', taskController.addTask)

// 任务编辑
router.post('/update', taskController.updateTask)

// 任务删除
router.get('/delete', taskController.deleteTask)

module.exports = router
```

- **业务逻辑层（Controllers）**
  在写业务逻辑层之前，我们先来看一下，sql 语句的一些返回值 数据库操作( CURD)

  在根目录下创建 controlles 文件夹

  创建 index.js 文件，代码如下

```javascript
const userController = require('./users')
const taskController = require('./tasks')

module.exports = {
  userController,
  taskController
}
```

创建 users.js 文件，代码如下

```javascript
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const { querySql } = require('../db/mysql')
const { md5 } = require('../utils/crypto')
const { PRIVATE_KEY, JWT_EXPIRED } = require('../utils/constant')
const { getErrorRes, getSuccessRes } = require('../utils/resHandler')

class UserController {
  async login(req, res, next) {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors
      res.json(getErrorRes({ message: msg }))
    } else {
      let { username, password } = req.body
      password = md5(password)
      const sql = `select * from sys_user where username='${username}' and password='${password}'`
      try {
        const findRes = await querySql(sql)
        console.log('--查询登录账号数据--', findRes)
        if (findRes.length === 0) {
          res.json(getErrorRes({ message: '用户名或密码错误' }))
        } else {
          // 登录成功，签发一个token并返回给前端
          const token = jwt.sign(
            // payload：签发的 token 里面要包含的一些数据。
            { username },
            // 私钥
            PRIVATE_KEY,
            { algorithm: 'HS256', expiresIn: JWT_EXPIRED }
          )
          let userData = {
            id: findRes[0].id,
            username: findRes[0].username,
            nickname: findRes[0].nickname
          }
          const result = getSuccessRes({
            message: '登录成功',
            data: {
              token,
              userData
            }
          })
          res.json(result)
        }
      } catch (error) {
        return next({ message: error })
      }
    }
  }

  async register(req, res, next) {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors
      res.json(getErrorRes({ message: msg }))
    } else {
      let { username, password } = req.body
      const sql = `select id, username from sys_user where username='${username}'`
      try {
        const findRes = await querySql(sql)
        console.log('--查询用户是否已存在--', findRes)
        if (findRes && findRes.length > 0) {
          res.json(getErrorRes({ message: '用户已存在' }))
        } else {
          password = md5(password)
          const sql = `insert into sys_user(username, password, gmt_create, gmt_modify) values('${username}', '${password}', '${new Date().getTime()}', '${new Date().getTime()}')`
          const insertRes = await querySql(sql)
          console.log('--注册用户--', insertRes)
          res.json(getSuccessRes({ message: '注册成功' }))
        }
      } catch (error) {
        return next({ message: error })
      }
    }
  }
}

module.exports = new UserController()
```

创建 tasks.js 文件，代码如下

```javascript
const { querySql } = require('../db/mysql')
const { validationResult } = require('express-validator')
const { getErrorRes, getSuccessRes } = require('../utils/resHandler')

class TaskController {
  async getTaskList(req, res, next) {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors
      res.json(getErrorRes({ message: msg }))
    } else {
      let { pageNum, pageSize = 10 } = req.body
      let query = `select d.id, d.title, d.description, d.status, d.gmt_create, d.gmt_expire from sys_task d where status != '2'`
      try {
        let findRes = await querySql(query)
        console.log('--查询任务列表--', findRes)
        let isLimit = findRes.length > pageSize
        let limitRes = []
        if (isLimit) {
          let n = (pageNum - 1) * pageSize
          limitRes = await querySql(query + ` limit ${n} , ${pageSize}`)
        }
        res.json(
          getSuccessRes({
            message: '查询数据成功',
            data: {
              total: findRes.length,
              list: isLimit ? limitRes : findRes,
              pageNum,
              pageSize
            }
          })
        )
      } catch (error) {
        return next({ message: error })
      }
    }
  }

  async addTask(req, res, next) {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors
      res.json(getErrorRes({ message: msg }))
    } else {
      let { title, description, gmt_expire } = req.body
      const sql = `select id, title from sys_task where title='${title}' and status != 2`
      try {
        let findRes = await querySql(sql)
        console.log('--addTask先查找同名任务--', findRes)
        if (findRes && findRes.length > 0) {
          res.json(getErrorRes({ message: '任务已存在' }))
        } else {
          const sql = `insert into sys_task(title, description, gmt_create, gmt_expire) values('${title}', '${description}', '${new Date().getTime()}', ${gmt_expire})`
          let insertRes = await querySql(sql)
          console.log('--添加task数据--', insertRes)
          res.json(getSuccessRes({ message: '添加数据成功' }))
        }
      } catch (error) {
        return next({ message: error })
      }
    }
  }

  async updateTask(req, res, next) {
    const err = validationResult(req)
    // 如果验证错误，empty不为空
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors
      res.json(getErrorRes({ message: msg }))
    } else {
      let { id, title, description, status, gmt_expire } = req.body
      const sql = `select id, title from sys_task where id != ${id} and title='${title}' and status != 2 `
      try {
        let findRes = await querySql(sql)
        console.log('--查询不等于当前id的任务是否存在--', findRes)
        if (findRes && findRes.length > 0) {
          res.json(getErrorRes({ message: '任务已存在' }))
        } else {
          const sql = `update sys_task set title='${title}', description='${description}',status='${status}', gmt_expire='${gmt_expire}' where id='${id}'`
          let updateRes = await querySql(sql)
          console.log(`--更新当前${id}的任务数据--`, updateRes)
          if (updateRes && updateRes.affectedRows > 0) {
            res.json(getSuccessRes({ message: '更新数据成功' }))
          } else {
            res.json(getErrorRes({ message: '更新数据失败' }))
          }
        }
      } catch (error) {
        return next({ message: error })
      }
    }
  }

  async deleteTask(req, res, next) {
    const err = validationResult(req)
    if (!err.isEmpty()) {
      const [{ msg }] = err.errors
      res.json(getErrorRes({ message: msg }))
    } else {
      let { id, status } = req.query
      const sql = `update sys_task set status='${status}' where id='${id}'`
      try {
        const deleteRes = await querySql(sql)
        console.log(`--删除${id}的任务数据--`, deleteRes)
        if (deleteRes && deleteRes.affectedRows > 0) {
          res.json(getSuccessRes({ message: '删除数据成功' }))
        } else {
          res.json(getErrorRes({ message: '删除数据失败' }))
        }
      } catch (error) {
        return next({ message: error })
      }
    }
  }
}

module.exports = new TaskController()
```

- **入口文件配置**
  在根目录 app.js 程序入口文件中，导入 Express 模块，再引入常用的中间件和自定义 routes 路由的中间件，代码如下：

```javascript
const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const { getErrorRes } = require('./utils/resHandler')

const routes = require('./routes/index')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', routes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  if (err.status == 401) {
    res.json(getErrorRes({ message: '用户未登录' }))
  } else {
    res.json(getErrorRes({ message: err.message || '服务器出错' }))
  }
})

module.exports = app
```

到此基于 Vue + antdv + Express + Node.js + MySQL 实现的前后端功能已基本完成，此章节暂告一段落。

## 什么是 BFF

BFF，即 Backends For Frontends（服务于前端的后端）。在 2015 年，Sam Newman 对此提出了，Pattern: Backends For Frontends ，国内也俗称为粘合层。

在 BFF 理念中，最重要的一点是： 服务自治，谁使用谁开发，即它应该由前端同学去维护。

- 服务自治减少了沟通成本，带来了灵活和高效。
- BFF 并不限制具体技术，团队根据自己的技术栈来选型： Java/Node/PHP/Python/Ruby...
  PS：Serverless For Frontend

### 为什么选择 Node 作为中间层

![network](/images/common/bff.png)

#### 业务驱动

Node 有个突出的优势，他的开发者可以是前端，都会倾向于选择生态更优，语法更熟悉的 Node.js。

前端对于页面所需要的数据有更好的理解，每个页面要用到哪些接口，每个接口要用到哪些字段前端是最清楚的。再加上实际业务开发中，前端页面需求经常会发生变化，需要修改字段或者数据结构，所以对接页面的这部分接口由前端直接开发非常合适，可以显著的减少沟通成本。

#### 架构需要

面向用户的接口由 Node 中间层负责以后，真正的服务端可以专注于提供基于领域模型的对内接口，做微服务。

比如可以基于 Goods 模型，提供所有商品相关的接口；基于 Users 模型，提供所有用户相关接口。当一个接口需要商品+用户信息时，由 Node 分别查询组装。从整体业务代码维护角度来说，变得更容易，不会因为业务发展使得每个接口都异常繁杂。

#### 性能满足

如果仅仅是架构层面的需求，需要有一个中间层来沉淀业务，那用 Java，PHP 也可以做到，为什么说 Node 更适合做呢？

因为 Node 天生异步！

众所周知，js 是一门单线程语言，所以 Node 在实现的时候，需要借助 libuv 来实现异步。libuv 为 Node 提供了线程池，事件池，异步 I/O 等能力。正是因为其中网络 I/O 的异步能力，可以让 Node 做接口聚合时，能够更高效的异步并发处理。

#### 成本较低

Node 使用 js 开发，只需要学习简单的 api，前端开发者就可以无障碍使用，学习成本很低。

而且，Node 具有活跃的社区和丰富的模块池，拥有很多现成的功能实现。框架方面，也有成熟的 koa，express 等基本框架和 egg 等二次封装框架，可根据需求选择上手也比较方便。

**中间层能为我们做些什么？**
![network](/images/common/bff-1.jpeg)

- 代理：在开发环境下，我们可以利用代理来，解决最常见的跨域问题；在线上环境下，我们可以利用代理，转发请求到多个服务端。
- 缓存：缓存其实是更靠近前端的需求，用户的动作触发数据的更新，node 中间层可以直接处理一部分缓存需求。
- 限流：node 中间层，可以针对接口或者路由做响应的限流。
- 日志：相比其他服务端语言，node 中间层的日志记录，能更方便快捷的定位问题（是在浏览器端还是服务端）。
- 监控：擅长高并发的请求处理，做监控也是合适的选项。
- 鉴权：有一个中间层去鉴权，也是一种单一职责的实现。
- 路由：前端更需要掌握页面路由的权限和逻辑。
- **服务端渲染：**node 中间层的解决方案更灵活，比如 SSR、模板直出、利用一些 JS 库做预渲染等等。
  更多的可能性

**中间层业务接口实践思路**
非标准，只是一种参考
![network](/images/common/bff-2.jpeg)
