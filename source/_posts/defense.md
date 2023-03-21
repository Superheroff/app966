---
title: 浅谈一下如何应对ddos攻击和软件破解
tags:
  - 软件安全
categories:
  - 软件安全
keywords: 如何应对ddos攻击和软件破解
cover: /temp/img/Peter-Henderson.jpg
abbrlink: e3a0a7a2
date: 2022-08-13 16:34:21
---

# 前言

1. ddos攻击和软件破解我经历了太多了
2. 近期闲下来想了很多，如果想彻底解决被破解的烦恼不能只从前端去解决，因为这样是治标不治本的，`Adobe、Jetbrains`这种大公司的软件都能被破解还解不了你吗？

# 解决思路

## 后端防破解
- **下面是我的后端处理思路**
1. 我们的软件分为前端和后端，前端是`用户接触和操作`的部分，后端是给前端`提供服务`的部分，我们要严格区分前后端的功能，不能把实际功能写在前端，而是通过调用后端来返回
2. 前端`只负责展示`内容和用户登录注册，其它的事一律不做
3. 然后用户登录后我们把他的id返回给后端告诉后端这个人已经登录了，现在我们开始对他进行校验，他每次点击前端的某个重要功能都从后端获取一次他的是否到期的`状态`，后端每60秒（或者其他时间根据实际情况来）校验一次他的到期时间并把是否到期的结果存入redis中，做一个接口从redis返回这个结果给到前端，这样解决频繁调用的问题，后端要做计划任务，60秒或者多少秒根据你的实际需求来，可以一直做计划任务，因为你不可能就一个用户这个用户下线另一个用户还在呢；如何校验？用redis的集合呗，`只校验到期的那个集合里是否有他就行了`，有他那我们后端直接给前端返回空，等于直接`罢工`了，反之正常运行。
4. 我这到期时间只是一种例子，你可以根据实际情况来，比如用`cookie、token`校验登录状态，破解者肯定是破解掉你的登录，用户名也是随便输入的你数据库可能都`没有这个用户`，`登录状态不在线的情况下我们就罢工`，你的接口也要去`校验时间戳`，数据传输最好做个`加密`，以免破解者发送`旧包`蒙混过关

## 前端防破解
- **下面是我的前端处理思路**
1. 检验启动文件的`md5 crc32 以及文件体积`
2. 检测`od`等调试工具
3. 关键代码处不要有任何`信息提示`，不要有如果和判断，用`循环`，循环次数无所谓啊，你反正在执行完代码的尾处直接写个`跳出`就行
4. `时间`检测，检测初始化代码的运行时间，如果`时间太长`肯定有问题，我们直接给他结束
5. 设置`暗桩`，比如你明检测到被破解了，但是你不说，等到运行主程序的时候某些功能无法使用啊或者少内容等，注意：全程`不要输出任何提示`，让某些功能失效时直接就失效，不要有提示，不要信息框，不要打印输出
6. 使用`多种不同的语言`写代码，比如我时间检测用java，检测od用易语言，检测md5用python等
7. 混淆代码。易语言可以在`工具`-`系统配置`-`安全`-`设置花指令`-`设置指令打乱`

# 防ddos攻击
- **首先这是个费钱的活，你肯定得增加服务器**
1. 流量小用nginx做个简单的`负载均衡`即可解决
2. 一定`要用CDN`，为什么呢？把自己的`真实IP隐藏`起来才是真的，这样我把子域名一改嘿嘿我又活了
3. 拉黑一些`恶意IP`，禁止`境外IP`访问，因为ddos大部分都是境外的IP攻击
4. 流量大最好是用nacos + spring cloud alibaba【涉及到的知识有java、docker、spring cloud、linux】
5. 如何区分流量大小，每秒`1W以上`并发进来的算是比较大了
6. 实在抗不住把你`挂掉的机器`也加入到集群中，这样总不至于整个垮掉，起到一个`雪崩保护`的作用

# 结尾

- 有更好的思路可以留言`一起探讨`
- 以上是我的`全部解决思路`，希望对你有所帮助吧