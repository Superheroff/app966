---
title: 酷狗signature值计算
tags: 易语言
categories: 易语言
keywords: 酷狗signature
cover: /temp/img/Maite-Franchi-Folio-Illustration-You-Magazine-Fibroids.jpg
abbrlink: b64a97e4
date: 2022-07-29 01:40:03
---

# 前言

- 无聊的一天
1. 想下载一个高清的MV，下载完了顺带[分享一下](/video/)吧
2. 这次是用易语言写的代码
- 过程
1. url去除“?”左边的然后按a-z排序
2. 排序完并拼接上前后各加上“OIlwieks28dk2k092lksi2UIkp”然后md5
3. 这个方式让我想起了角落里的快手，不能说毫不相干，只能说一模一样

# 开始

```
.版本 2
.支持库 spec

.程序集 程序集1

.子程序 _启动子程序, 整数型, , 请在本子程序中放置动态链接库初始化代码

' kg_ (“说爱你”, 2)
kg_mv (“DA546EF394077B690902C58F858CAAE1”)
返回 (0)  ' 返回值被忽略。




.子程序 kg_mvhash, 文本型, , 获取高清MV
.参数 mvid, 文本型
.局部变量 http, 类_POST数据类
.局部变量 ret, 文本型
.局部变量 URL, 文本型
.局部变量 data, 文本型
.局部变量 signature, 文本型

URL ＝ “https://gateway.kugou.com/openapi/kmr/v1/mv?srcappid=2919&clientver=20000&clienttime=” ＋ 时间_取现行时间戳 () ＋ “&mid=b8d5700894e7d861d6859c2513d20808&uuid=b8d5700894e7d861d6859c2513d20808&dfid=4XSSn60jHVzu4IUffL0uxRKB&appid=1014&token=&userid=0”
signature ＝ kg_signature (URL, 真)
URL ＝ URL ＋ “&signature=” ＋ signature
http.添加 (“User-Agent”, “Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36”)
http.添加 (“Host”, “gateway.kugou.com”)
http.添加 (“KG-TID”, “317”)
data ＝ “{” ＋ #引号 ＋ “fields” ＋ #引号 ＋ “:” ＋ #引号 ＋ “base,h264” ＋ #引号 ＋ “,” ＋ #引号 ＋ “data” ＋ #引号 ＋ “:[{” ＋ #引号 ＋ “entity_id” ＋ #引号 ＋ “:” ＋ #引号 ＋ “224394” ＋ #引号 ＋ “}]}”
ret ＝ 编码_Utf8到Ansi (网页_访问_对象 (URL, 1, data, , , http.获取协议头数据 ()))
调试输出 (ret)
返回 (ret)

.子程序 kg_mv
.参数 hash, 文本型
.局部变量 http, 类_POST数据类
.局部变量 ret, 文本型
.局部变量 URL, 文本型

URL ＝ “http://trackermvretry.kugou.com/interface/index?cmd=104&pid=2&ext=mp4&hash=” ＋ 到小写 (hash) ＋ “&jump=0&key=&backupdomain=1”
http.添加 (“User-Agent”, “Android9-AndroidPhone-11239-18-0-SearchAll-wifi”)
http.添加 (“Host”, “trackermvretry.kugou.com”)
ret ＝ 编码_Utf8到Ansi (网页_访问_对象 (URL, , , , , http.获取协议头数据 ()))
调试输出 (ret)

.子程序 kg_, , , 搜索
.参数 music_name, 文本型
.参数 type, 整数型, 可空, 搜索类型0=综合，1=歌曲，2=MV，默认0
.局部变量 url, 文本型
.局部变量 time, 文本型
.局部变量 signature, 文本型
.局部变量 http, 类_POST数据类
.局部变量 ret, 文本型

time ＝ 时间_取现行时间戳 (真)
.判断开始 (type ＝ 0)
    url ＝ “http://complexsearchretry.kugou.com/v8/search/complex?osversion=9&userid=0&area_code=1&appid=1005&phonemodel=MI%206X&cursor=1&token=&requestid=925ba516f22071755f5394f23820d25e_5&clienttime=” ＋ time ＋ “&iscorrection=1&uuid=d74ecbf808b72947c91d7b134823a705&apiver=20&keyword=” ＋ 编码_URL编码 (music_name, 真, 真) ＋ “&mid=” ＋ 文本_取随机数字 (38) ＋ “&dfid=-&clientver=11239&platform=AndroidFilter&tag=em”
.判断 (type ＝ 1)
    url ＝ “http://complexsearchretry.kugou.com/v2/search/song?userid=0&area_code=1&appid=1005&dopicfull=1&page=1&token=&privilegefilter=0&requestid=925ba516f22071755f5394f23820d25e_1&pagesize=30&clienttime=” ＋ time ＋ “&sec_aggre=1&iscorrection=1&uuid=d74ecbf808b72947c91d7b134823a705&keyword=” ＋ 编码_URL编码 (music_name, 真, 真) ＋ “&mid=” ＋ 文本_取随机数字 (38) ＋ “&dfid=-&clientver=11239&platform=AndroidFilter&tag=em”
.默认
    url ＝ “http://complexsearchretry.kugou.com/v1/search/mv?sorttype=0&userid=0&tagtype=%E5%85%A8%E9%83%A8&appid=1005&dopicfull=1&page=1&token=&requestid=925ba516f22071755f5394f23820d25e_1&pagesize=20&clienttime=” ＋ time ＋ “&iscorrection=1&uuid=d74ecbf808b72947c91d7b134823a705&keyword=” ＋ 编码_URL编码 (music_name, 真, 真) ＋ “&mid=” ＋ 文本_取随机数字 (38) ＋ “&dfid=-&tagaggr=1&clientver=11239&platform=AndroidFilter&tag=em”
.判断结束
signature ＝ kg_signature (url)
url ＝ url ＋ “&signature=” ＋ signature
http.添加 (“User-Agent”, “Android9-AndroidPhone-11239-18-0-SearchAll-wifi”)
http.添加 (“Host”, “complexsearchretry.kugou.com”)
ret ＝ 编码_Utf8到Ansi (网页_访问_对象 (url, , , , , http.获取协议头数据 ()))
调试输出 (ret)
置剪辑板文本 (ret)

.子程序 kg_signature, 文本型
.参数 url, 文本型
.参数 web, 逻辑型, 可空, 默认app
.局部变量 text, 文本型
.局部变量 a, 整数型
.局部变量 arr, 文本型, , "0"
.局部变量 i, 整数型
.局部变量 ret, 文本型
.局部变量 res, 文本型
.局部变量 js, 类_脚本组件

text ＝ 文本_取右边 (url, “?”)
a ＝ 文本_分割文本 (text, “&”, , arr)
.如果真 (a ＝ 0)
    返回 (“0”)
.如果真结束
数组_排序 (arr)
ret ＝ “”
.计次循环首 (a, i)
    ret ＝ ret ＋ arr [i]
.计次循环尾 ()

.判断开始 (web ＝ 假)
    res ＝ 校验_取md5_文本 (“OIlwieks28dk2k092lksi2UIkp” ＋ 编码_URL解码 (ret, 真) ＋ “OIlwieks28dk2k092lksi2UIkp”, 真)
.默认

    调试输出 (js.执行 (#js))
    res ＝ “NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt” ＋ ret ＋ “NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt”
    res ＝ js.运行 (“get_md5”, res)
.判断结束
调试输出 (res)
返回 (res)
```
# 结束

{% image /img/kg.png, alt= %}

