---
title: 快手did注册
tags:
  - 易语言
categories:
  - 易语言
keywords: 快手did注册
cover: /temp/img/Michael.jpg
abbrlink: 5f69c3c3
date: 2022-08-20 22:57:10
---

# 前言

- 2022-8-20测试可用
- 网页版did
- 仅限用于学习交流
- 滥用导致的后果与作者无关

# 代码

- **代码是易语言**
- **思路**
1. 访问快手官网获取返回的did
2. 通过`/rest/wd/common/log/collect/misc2`注册
3. 注册完需要访问一次用户主页才算成功

```
.版本 2
.支持库 spec

.程序集 程序集1
.程序集变量 cookie, 文本型
.程序集变量 http, 类_POST数据类
.程序集变量 ua, 文本型
.程序集变量 did, 文本型

.子程序 _启动子程序, 整数型, , 请在本子程序中放置动态链接库初始化代码


_临时子程序 ()  ' 在初始化代码执行完毕后调用测试代码
返回 (0)  ' 返回值被忽略。

.子程序 _临时子程序

' 本名称子程序用作测试程序用，仅在开发及调试环境中有效，编译发布程序前将被系统自动清空，请将所有用作测试的临时代码放在本子程序中。 ***注意不要修改本子程序的名称、参数及返回值类型。
ua ＝ “Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36”
http.添加 (“content-type”, “application/json”)
http.添加 (“User-Agent”, ua)

获取did ()
获取用户作品 ()

.子程序 获取did, 逻辑型
.局部变量 url, 文本型
.局部变量 ret, 文本型
.局部变量 data, 文本型
.局部变量 json, 类_json
.局部变量 re, 正则表达式类
.局部变量 uid, 文本型
.局部变量 name, 文本型

url ＝ “https://live.kuaishou.com/cate/ZH/1000020”
ret ＝ 编码_Utf8到Ansi (网页_访问_对象 (url, , , , cookie, “User-Agent: ” ＋ ua))
re.创建 (#常量4, ret, , 真, 真)
uid ＝ 文本_取左边 (re.取匹配文本 (1), “,” ＋ #引号 ＋ “LiveInfo:”)
json.解析 (uid)
uid ＝ 文本_取右边 (json.取通用属性 (“user.id”), “User:”)
re.创建 (#常量5, ret, , 真, 真)
name ＝ 文本_取出中间文本 (re.取匹配文本 (1), #引号 ＋ “name” ＋ #引号 ＋ “:” ＋ #引号, #引号)
did ＝ 网页_取单条Cookie (cookie, “did”, 真)
调试输出 (did, uid, name)
url ＝ “https://log-sdk.ksapisrv.com/rest/wd/common/log/collect/misc2?v=3.9.49&kpn=KS_GAME_LIVE_PC”
data ＝ 子文本替换 (#常量2, “[did]”, did, , , 真)
data ＝ 子文本替换 (data, “[ts]”, 时间_取现行时间戳 (), , , 真)
data ＝ 子文本替换 (data, “[tss]”, 文本_取随机范围数字 (1000, 9999), , , 真)
ret ＝ 编码_Utf8到Ansi (网页_访问_对象 (url, 1, data, cookie, , http.获取协议头数据 ()))
json.解析 (ret)

.如果真 (uid ＝ “” 或 name ＝ “”)
    返回 (假)
.如果真结束
.判断开始 (json.取通用属性 (“result”) ＝ “1”)
    url ＝ “https://live.kuaishou.com/u/” ＋ uid
    ret ＝ 编码_Utf8到Ansi (网页_访问_对象 (url, , , cookie, , http.获取协议头数据 ()))
    .判断开始 (寻找文本 (ret, name, , 假) ≠ -1)
        返回 (真)
    .默认
        返回 (假)
    .判断结束

.默认
    返回 (假)
.判断结束


.子程序 获取用户作品
.参数 uid, 文本型, 可空
.局部变量 url, 文本型
.局部变量 ret, 文本型
.局部变量 data, 文本型

.如果真 (uid ＝ “”)
    uid ＝ “3x9d8g28wd78xs2”
.如果真结束

url ＝ “https://www.kuaishou.com/graphql”
http.添加 (“Referer”, “https://www.kuaishou.com/profile/” ＋ uid)
http.添加 (“Origin”, “https://www.kuaishou.com”)
http.添加 (“Host”, “www.kuaishou.com”)
http.添加 (“sec-ch-ua”, #常量6)
http.添加 (“sec-ch-ua-mobile”, “?0”)
http.添加 (“sec-ch-ua-platform”, #引号 ＋ “Windows” ＋ #引号)
http.添加 (“Sec-Fetch-Dest”, “empty”)
http.添加 (“Sec-Fetch-Mode”, “cors”)
http.添加 (“Sec-Fetch-Site”, “same-origin”)
data ＝ 子文本替换 (#常量3, “[uid]”, uid, , , 真)
ret ＝ 编码_Utf8到Ansi (网页_访问_对象 (url, 1, data, “Cookie: kpf=PC_WEB; kpn=KUAISHOU_VISION; ksliveShowClipTip=true; clientid=3; did=” ＋ did ＋ “; client_key=65890b29”, , http.获取协议头数据 ()))
调试输出 (ret)
置剪辑板文本 (ret)

```

# 下载e源码

- [kuaishou.e](/temp/kuaishou.e)