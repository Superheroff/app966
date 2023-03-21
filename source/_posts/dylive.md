---
title: 抖音直播弹幕捕获【转载 + 修改】
tags:
  - python
categories:
  - python
keywords: 抖音直播弹幕
cover: /temp/img/Maite_Positive.jpg
abbrlink: 175a7cfe
date: 2022-07-30 07:27:53
---

# 前言

1. 无意在精易论坛看到了[这个帖子](https://bbs.125.la/thread-14739135-1-2.html)
{% image /temp/img/dylive_1.png, alt= %}
2. 简单浏览了下这个源码的逻辑就是运行`webDriver.py`把弹幕下载下来并且存放在`douyinLiveFile`文件夹中
3. 然后运行`webChat.py`去读`douyinLiveFile`文件夹中下载好的弹幕并解析
4. 是通过`playwright`检测网页响应状态，对于爬虫来说就是自动抓取指定的内容，不需要任何算法，反爬将毫无意义，这让我想起了另一款神器`selenium`
5. 这里很有必要去了解一下[Playwright是什么](https://segmentfault.com/a/1190000038697288)
6. 补充：这个方法比wss连接的要好，物理外挂最为致命，并且playwright是`支持异步`的，也就是可以`执行多个`直播间的任务，具体转到[playwright官方文档](https://playwright.dev/python/docs/intro)查阅
7. 简单的加密已经不能防范这个方式的爬虫了，只要浏览器可以看的它都可以获取
8. 此源码需要有python基础，不太适合新手，因为这个只是做了个获取演示，你需要再去修改处理获取后的内容，要更方便的使用最好部署在服务器中
9. 我博客很多内容都是一个结果而没有分析过程导致好像是搬运而来的一样，我只是不太喜欢写教程以及过程这样太麻烦了，后面会慢慢改正

# 代码
**注意事项**
- 只能使用网页版直播链接
- 我这里只放`修改`处
- [点击此处下载](/temp/抖音弹幕捕获.zip)完整版

```python
# -*- coding: utf-8 -*-
import os
import time
import requests
import shutil
from google.protobuf.json_format import MessageToDict
import json
from messages.message_pb2 import *
import base64
import asyncio

def getScriptDir():
    return os.path.split(os.path.realpath(__file__))[0]

class Watcher():
    def __init__(self):
        self.monitoringFile = f'{getScriptDir()}\\douyinLiveFile'

    async def startWatcher(self):
            files = os.listdir(self.monitoringFile)
            if files:
                for _ in files:
                    filepath = self.monitoringFile + '\\' + _
                    with open(filepath, 'rb') as f:
                        datas = {}
                        messages = []
                        danmu_resp = Response()
                        danmu_resp.ParseFromString(f.read())
                        f.close()
                        obj = MessageToDict(danmu_resp, preserving_proto_field_name=True)
                        if obj:
                            if obj.get('messages'):
                                datas.update({'now': obj.get('now')})
                                for message in obj["messages"]:
                                    method = message["method"]
                                    payload = bytes(base64.b64decode(message["payload"].encode()))
                                    if method == "WebcastMemberMessage":
                                        menber_message = MemberMessage()
                                        menber_message.ParseFromString(payload)
                                        obj1 = MessageToDict(menber_message, preserving_proto_field_name=True)
                                        obj1 = {'method': method, 'msgId': message['msgId'], 'payload': obj1}
                                        messages.append(obj1)
                                    if method == "WebcastChatMessage":
                                        menber_message5 = ChatMessage()
                                        menber_message5.ParseFromString(payload)
                                        obj2 = MessageToDict(menber_message5, preserving_proto_field_name=True)
                                        obj2 = {'method': method, 'msgId': message['msgId'], 'payload': obj2}
                                        messages.append(obj2)

                                datas.update({'data': messages})
                                ret = json.dumps(datas)
                                with open('./userImages/' + str(int(time.time())) + '.json', 'w') as file:
                                    file.write(ret)
                                    file.close()

                        else:
                            ret = {'msg': '请先运行webdriver获取弹幕文件'}

            print(ret)
            return ret

if __name__ == '__main__':
    if not os.path.isdir(getScriptDir()+"\\douyinLiveFile"):# 这里存放未解析的弹幕文件
        os.makedirs(getScriptDir()+"\\douyinLiveFile")
    if not os.path.isdir(getScriptDir()+"\\userImages"):# 这里存放解析好的json数据文件
        os.makedirs(getScriptDir()+"\\userImages")
    while True:
            time.sleep(1)
            asyncio.run(Watcher().startWatcher())
```

# 结束

{% checkbox green checked, 本源码仅限学习交流 %}
{% checkbox times red checked, 请勿用于非法途径 %}
{% image /img/dylive.png, alt= %}



