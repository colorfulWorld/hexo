---
title: Jenkins对前端应用做自动化构建
date: 2019-12-03 16:58:31
tags:
---
---

---

# Jenkins是什么
Jenkins是一个开源软件项目，是基于Java开发的一种持续集成工具，用于监控持续重复的工作，旨在提供一个开放易用的软件平台，使软件的持续集成变成可能，最初的创建者川口清子（Kohsuke Kawaguchi）。他独自写了大部分代码

![clipboard](https://user-images.githubusercontent.com/16111288/68524077-01e52f80-02fd-11ea-9531-d039a4c77113.png)

![clipbo123ard](https://user-images.githubusercontent.com/16111288/68523536-9c417500-02f5-11ea-9862-dd7bc23ae9ec.png)

# 概要

今天分享的主要内容有
- Docker简单介绍
- Jenkins的简介与安装
- Jenkins对接Github 项目做持续集成
- Jenkins构建项目的几种方式
- Jenkins上传前端包到文件服务器
- 云服务器简单使用介绍


涉及到的资源和工具
- 一台阿里云Linux服务器（默认安装Centos）。
- Xshell：一个Windows软件，脚本的方式来操作服务器。
- XFTP：是Xshell的一个插件，能图形化看到服务器的文件。
- Nginx：展示前端页面
- Docker：一个运行Jenkins的容器
- Jenkins
- Git

# 现状
如今我们已经到前后端分离开发的模式。通常情况下，前端只需要把HTML，CSS，JS打包好之后，发给后端部署即可。最能体现这个场景比如使用vue来开发前端项目的时候，利用vue-cli脚手架来帮我们打包npm run build。 最终会生成一个dist目录，我们只需提供这个dist包给后端开发人员即可。

如果只发一个版本，这种方式完全OK，但是如果需要频繁的更新版本，就会有如下图的操作，各个人员在频发互传代码包，容易出问题。这对于前后端来说，都是一个很低效的事情。

![12313](https://user-images.githubusercontent.com/16111288/68523471-c6466780-02f4-11ea-8700-e6c5e0bef519.png)

因此我们需要将低效的手动式部署，升级为更加先进的工程化，流水线式的持续部署。Jenkins就很好的可以做这样的事情，而且我们公司的持续集成也是使用这个工具。

# CI/CD
## 持续集成Continuous Integration（CI）
持续集成强调开发人员提交了新代码之后，立刻自动的进行构建、（单元）测试。根据测试结果，我们可以确定新代码和原有代码能否正确地集成在一起。
持续集成过程中很重视自动化测试验证结果，对可能出现的一些问题进行预警，以保障最终合并的代码没有问题。

## 持续交付Continuous Delivery（CD）
持续交付在持续集成的基础上，将集成后的代码部署到更贴近真实运行环境的「类生产环境」（production-like environments）中。交付给质量团队或者用户，以供评审。如果评审通过，代码就进入生产阶段。
持续交付并不是指软件每一个改动都要尽快部署到产品环境中，它指的是任何的代码修改都可以在任何时候实施部署。
这里强调的是

- 手动部署
- 有部署的能力，但不一定部署

## 持续部署（Continuous Deployment)
持续部署是指当交付的代码通过评审之后，自动部署到生产环境中。持续部署是持续交付的最高阶段。
这里强调

- 持续部署是自动的
- 持续部署是持续交付的最高阶段

## 总结
「持续集成（Continuous Integration）」、「持续交付（Continuous Delivery）」和「持续部署（Continuous Deployment）」提供了一个优秀的 DevOps 环境，对于整个团队来说，好处与挑战并行。无论如何，频繁部署、快速交付以及开发测试流程自动化都将成为未来软件工程的重要组成部分。

# Docker

## docker简介

Docker是一种Linux容器技术，容器有效的将由单个操作系统挂管理的资源划分到孤立的组中，以便更好的在组之间平衡有冲突的资源使用需求。可简单理解为一种沙盒 。每个容器内运行一个应用，不同的容器之间相互隔离，容器之间也可以建立通信机制。容器的创建和停止都十分快速，资源需求远远低于虚拟机。

## docker与虚拟机对比
| 特性       | docker容器           | 虚拟机               |
| ---------- | -------------------- | -------------------- |
| 启动速度   | 秒级                 | 分钟级               |
| 硬盘使用   | 一般为MB             | 一般为GB             |
| 性能       | 接近原生             | 弱于原生             |
| 系统支持量 | 单台机支持上千个容器 | 单台机支持几十个容器 |
| 隔离性     | 安全隔离             | 安全隔离             |

## Docker容器

 类似linux系统环境，运行和隔离应用。容器从镜像启动的时候，docker会在镜像的最上一层创建一个可写层，镜像本身是只读的，保持不变。

## Docker镜像

Docker镜像是一个Docker的可执行文件，其中包含了运行应用程序所需要的代码、依赖库、环境变量、配置文件等等。

## Dockerfile

如果你想要从一个基础镜像开始建立一个自定义镜像，可以选择一步一步进行构建，也可以选择写一个配置文件，然后一条命令（docker build）完成构建，显然配置文件的方式可以更好地应对需求的变更，这个配置文件就是Dockerfile。
学习Dockerfile的最好方式就是阅读别人写的Dockerfile，遇到不会的指令就查一查Dockerfile的文档

## 注意
关机后，docker容器会停止运行，镜像会保留在硬盘上，就想关机了，软件就关闭了，但可以再次打开。

# Jenkins

## Jenkins安装
建议直接在Linux上安装，首页的插件选择默认的安装。

## Jenkins页面简介

​		jenkins系统的介绍

## Jenkins插件安装

作为CI/CD的调度中心，Jenkins具有十八般武艺，目前已有1500多个插件，功能非常强大，比如说我们用到的，node插件，npm插件，Github插件，ssh上传文件插件，还有很多插件，比较多人用的，导出测试报告，sonar代码扫描等等。如果再jenkins里面没有搜到想用的插件，去官网搜，下载后在回来安装需要额外安装的有：
- Github plugin：把代码从Github上拉下来
- Nodejs：运行前端项目，npm install，npm run build 
- Pubish Over SSH：把构建好的文件 上传到nginx
- Email Extended  Template : 发送邮件通知

### 在github配置钩子
	Jenkins需要一个对项目有读写权限的账户，所以要在github生成一个token给jenkins使用，这个token，在后面需要用到。
> 	进入github --> setting --> Personal Access Token --> Generate new token

![image](https://user-images.githubusercontent.com/16111288/68523844-aebdad80-02f9-11ea-9294-828868dfdf69.png)

![image](https://user-images.githubusercontent.com/16111288/68523993-9e0e3700-02fb-11ea-9a0b-f07e19b9cc7f.png)

拿到这个token之后先保存好，等会到jenkins中需要配置凭证
我们有一个token可以访问到github了，但是还要对其中的项目设置钩子
> 	进入GitHub上指定的项目 --> setting --> WebHooks&Services --> add webhook --> 输入刚刚部署jenkins的服务器的IP

![image](https://user-images.githubusercontent.com/16111288/68524015-04935500-02fc-11ea-9a12-9cfd5bfc7695.png)

## 在Jenkins和github钩子

### 安装github plugin
> 系统管理-->插件管理-->可选插件
### 配置github plugin
> 系统管理-->github plugin

API URL 输入 `https://api.github.com`，Credentials点击Add添加，Kind选择Secret Text,具体如下图所示。

![image](https://user-images.githubusercontent.com/16111288/68524053-c64a6580-02fc-11ea-9f2d-db3a71b304d3.png)

![image](https://user-images.githubusercontent.com/16111288/68524112-9485ce80-02fd-11ea-9047-d73780d20b48.png)

设置完成后，点击`TestConnection`,提示`Credentials verified for user UUserName, rate limit: xxx`,则表明有效。

## 构建配置

## 构建方式

- 手动构建：自己上Jenkins点击。
- 自动构建：提交代码到git仓库之后，自动构建。
- 定时构建：每隔一段时间构建一次，比如设置每天固定某个时间段构建。

### 编写shell脚本

Shell 是一个用 C 语言编写的程序，它是用户使用 Linux 的桥梁。Shell 既是一种命令语言，又是一种程序设计语言。

`node -v`
`npm -v`
`npm --registry https://registry.npm.taobao.org install`
`npm run test:unit`
`npm run build`

### 参数化构建
选择参数化构建，配置参数，在工程的首页就会多一个构建入口，参数化构建使得构建变得更加灵活。

![image](https://user-images.githubusercontent.com/16111288/68524161-5d63ed00-02fe-11ea-9874-1f4672d47891.png)

![image](https://user-images.githubusercontent.com/16111288/68524197-a0be5b80-02fe-11ea-8765-a5505bc42420.png)

### 上传构建包

使用nginx做为文件服务器
在机器上安装nginx
在nginx上配置为文件资源服务器

`location / {
        root   /usr/share/nginx/html/static;
        autoindex on;
        autoindex_exact_size off;
        autoindex_localtime on;
    }`
![微信截图_20191109145520](https://user-images.githubusercontent.com/16111288/68524366-0b709680-0301-11ea-8892-a7e1e50f4cfa.png)

## Jenkins系统配置SSH账号

安装Publish Over SSH插件用于SSH连接远程的服务器。

登录 jenkins 管理系统首页，打开“系统管理”--“管理插件”  搜索 Publish Over SSH 然后勾选安装
配置远程服务器的连接

打开“系统管理”--“系统设置”  找到 “Publish over SSH” 项 ，我这里远程服务器用的是ssh登录，通过ppk密钥进行连接，所以我的配置如图，如果是帐号密码登录的Passphrase填写密码Username填写用户名，path to key 为空就可以了。

![微信截图_20191109145522](https://user-images.githubusercontent.com/16111288/68524390-5094c880-0301-11ea-8559-ad729ff4f671.png)

点击 Test Configuration 按钮测试连接是否成功

![image](https://user-images.githubusercontent.com/16111288/68524400-6bffd380-0301-11ea-840d-96bc52a4257b.png)

### JOB添加构建后上传

> “构建后操作步骤”---“Send build artifacts over SSH” 

Name：第三步创建的远程服务器名称

Source files：本地需要传输过去的文件路径

Remove prefix：过滤掉的目录名

Remote directory：远程服务器的保存路径

Exec command：传输完成后在远程服务器执行的sh命令

![微信截图_20191109150211](https://user-images.githubusercontent.com/16111288/68524450-03652680-0302-11ea-9bce-f7b42ddf589d.png)

## 构建后邮件通知
构建成功之后，可以进行邮件通知。
第一步，先到插件管理安装插件，Email Extension Plugin，我只搜到了Email EXtension Template，所以就安装了它


如果是QQ邮箱，先去获取一个独立密码

![image](https://user-images.githubusercontent.com/16111288/68524622-02cd8f80-0304-11ea-949b-ec148ea39d08.png)

> 系统管理-->系统设置--> Extended E-mail Notification

![image](https://user-images.githubusercontent.com/16111288/68524633-1a0c7d00-0304-11ea-8bdb-3c94222fcfb8.png)

![image](https://user-images.githubusercontent.com/16111288/68524636-21338b00-0304-11ea-8ac7-0e8aa0f07aab.png)

## 配置邮件报错

![image](https://user-images.githubusercontent.com/16111288/68524653-593ace00-0304-11ea-9b60-d4f4227f020c.png)

邮件配置的过程出错，是因为管理的邮箱没有配置，到用户设置去设置

![image](https://user-images.githubusercontent.com/16111288/68524659-6952ad80-0304-11ea-846b-fb1dc721ab56.png)

### 构建后选择接收人

![image](https://user-images.githubusercontent.com/16111288/68524667-7f606e00-0304-11ea-8425-84fbd475e9af.png)


## 注意

 对于新手来说，Jenkin最好直接安装在机器上，安装在docker上的话，Jenkins无法访问到宿主机器的环境变量，比如我在机器上安装Yarn，但docker上的Jenkins无法访问得到Yarn，只能老老实实的使用npm。



## 遇到的问题

- 学习Jenkins，Docker这种工具，最好租一个服务器，不需要买域名，按月租就够了。
- 境外服务器的比境内便宜，但境外的经常连不上去，每天总有几个小时连不上去。
- 构建过程中npm install总是失败，服务器从1G内存扩容到2G 之后又成功了。
- Docker安装的jenkins无法访问到本机的环境变量，例如无法在构建脚本中写Yarn命令。


# 阿里云简介

轻量应用型服务器，便宜，适合学习。
买好之后，在点击进入自己的机器

![image](https://user-images.githubusercontent.com/16111288/68524467-30193e00-0302-11ea-8266-0114201443ba.png)

服务器默认只开发 80,443，22端口是可以通过外网进行访问的，如果自己的应用是8080,8088这个端口，需要在阿里云防火墙里面添加规则，并重启机器

![image](https://user-images.githubusercontent.com/16111288/68524471-3c050000-0302-11ea-8d61-54e8fc0000fb.png)

## 通过xshell进入服务器

![image](https://user-images.githubusercontent.com/16111288/68524476-4c1cdf80-0302-11ea-825b-aa3ce6144c22.png)

# 访问github慢

github的CDN被某墙屏了，由于网络代理商的原因，所以访问下载很慢。ping github.com 时，速度只有300多ms。
绕过dns解析，在本地直接绑定host，该方法也可加速其他因为CDN被屏蔽导致访问慢的网站。
windows系统的hosts文件的位置如下：C:\Windows\System32\drivers\etc\hosts
mac/linux系统的hosts文件的位置如下：/etc/hosts

修改windows里的hosts文件，添加如下内容

`# Github
151.101.44.249 github.global.ssl.fastly.net 
192.30.253.113 github.com 
103.245.222.133 assets-cdn.github.com 
23.235.47.133 assets-cdn.github.com 
203.208.39.104 assets-cdn.github.com 
204.232.175.78 documentcloud.github.com 
204.232.175.94 gist.github.com 
107.21.116.220 help.github.com 
207.97.227.252 nodeload.github.com 
199.27.76.130 raw.github.com 
107.22.3.110 status.github.com 
204.232.175.78 training.github.com 
207.97.227.243 www.github.com 
185.31.16.184 github.global.ssl.fastly.net 
185.31.18.133 avatars0.githubusercontent.com 
185.31.19.133 avatars1.githubusercontent.com
192.30.253.120 codeload.github.com`