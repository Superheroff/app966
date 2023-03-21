---
title: Butterfly友链检查、友链朋友圈开发
tags:
  - python
  - Butterfly
  - redis
categories:
  - Butterfly
keywords: Butterfly友链检查、友链朋友圈
cover: /temp/img/James-Gilleard-Folio-Illustration-Scientist-Research.jpg
abbrlink: ef63b2d7
date: 2022-08-11 15:13:53
---

# 前言

- Q: 已经有成熟可用的[相关项目](https://fcircle-doc.js.cool/)了为啥还要做一个呢？
- A：一切都是为了摸鱼。主要为了打发时间加练练手，另外他的源码我也看了，是不错的；我不在他的上面做继承，我只做Butterfly主题的适配；
- A：整个项目大致逻辑通过每日计划任务[x,x1,x2]时获取朋友的一篇最新文章并存入redis中间件中以供前端调用，第二天自动清除，不保存历史数据。
- Q：为啥要使用redis这个项目的场景调用量并不多？
- A：主要是因为我想熟悉下redis好久没有使用了，而且redis确实适合这种场景下，轻便速度也快，最主要没有存数据的需求，随取随丢。

# 当前进度
{% timeline 2022,green %}
<!-- timeline 08-20 -->
1. 已完善友链检查
2. 新增获取友链的最新/随机文章为后面的友链朋友圈做铺垫
<!-- endtimeline -->
<!-- timeline 08-10 -->
- 完成了友链检查雏形
<!-- endtimeline -->
{% endtimeline %}

# 代码

{% folding cyan open, 主文件代码 %}
- 由于某些原因，例如没有匹配到头像等问题，已经做了异常处理，再次获取头像等待下次更新

```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/8/8 11:04
@Author  : superhero
@Email   : 838210720@qq.com
@File    : get_friends.py
@IDE: PyCharm
"""

import asyncio
from playwright.async_api import async_playwright
import re
import json
from urllib import parse
import requests
from config import plugin_config
import feedparser
import random
import socket

link_path = plugin_config.link_path

"""
检查友链的博客主题必须是Butterfly主题，友链的博客是什么主题就无所谓了
"""
class friend_qu:
    def __init__(self, url):
        """
        :param url: 你的友链链接，必须Butterfly主题
        """
        self.link = url
        self.data = dict()


    async def cancel_request(self, route, request):
        await route.abort()

    async def get_friends(self) -> dict:
        """
        获取你的所有友链信息
        :return:
        """

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            response = await page.goto(self.link)
            if response.status != 200 and response.status != 503:  # 503是防止糖果屋这种类型的博客
                exit(1)
            await page.route(re.compile(r"(\.png)|(\.jpg)|(\.css)|(\.webp)|(\.js)"), self.cancel_request)
            # await page.mouse.wheel(0, 3000)
            await page.click('xpath=//*[@id="article-container"]/div')
            # elements = await page.locator('xpath=//*[@id="article-container"]//div/a').all_inner_texts()
            res = await page.query_selector_all('xpath=//*[@id="article-container"]//div/a')

            x = 0
            # x1 = 0
            kk = []
            title = ''
            datas = {}
            k = []
            for element in res:
                # x1 += 1
                text = await element.text_content()
                if text:
                    x += 1
                # if x1 >= 5:
                #     if x1 == x:
                #         break


            # 这里计算出每个人有多少图片 包含头像缩略图等
            x1 = len(res) / x

            x = 0
            x2 = 0
            for element in res:
                x += 1
                href = await element.get_attribute("href")
                text = await element.text_content()
                print('获取友链进度：' + str(round(x / len(res) * 100, 1)) + '%')
                # print(x, href, text)
                k.append(href)
                x2 += 1
                if text:
                    title = text

                if x1 - x2 <= 0:
                    # 把图片和链接都拼接起来
                    k = sorted(k, key=len)
                    kk += [{'desc': title, 'url': k}]
                    k = []
                    x2 = 0


            # datas.update({'data': kk})
            self.data.update({'data': kk})
            print(self.data)
            await page.close()
            await browser.close()
            return datas


    async def friend_post(self, ran=False):
        """
        进入你友链的主页获取一篇他的文章
        :param ran: 是否随机取一篇文章，默认否，取最新文章
        :return:
        """
        kk = []
        x = 0
        data_json = dict()

        for urls in self.data['data']:
            x += 1
            print('获取文章进度：' + str(round(x / len(self.data['data']) * 100, 1)) + '%')
            url = urls['url'][0]
            url = url + 'atom.xml' if url[-1] == '/' else url + '/atom.xml'
            # print(url)
            avatar = '' if len(urls['url']) == 1 else urls['url'][len(urls['url']) - 1]
            try:
                ret = feedparser.parse(url)
                socket.setdefaulttimeout(5)
                if ret['status'] == 200:
                    num = 0 if ran is False else random.randint(0, len(ret.entries) - 1)
                    kk += [{'title': ret['entries'][num]['title'],  # 文章标题
                            'num': len(ret.entries),  # 文章总数
                            'url': ret['entries'][num]['link'],  # 文章链接
                            'date': ret['entries'][num]['published'],  # 文章发表时间
                            'avatar': avatar,  # 头像
                            'author': urls['desc']  # 作者
                            }]
                else:
                    print('未开启rss')
            except:
                print('未开启rss')

        data_json.update({'data': kk})
        print(json.dumps(data_json))
        """
        返回字段释义
        {"data": [{"title": "\u81ea\u5b9a\u7fa9\u5074\u908a\u6b04", "num": 17, "url": "https://butterfly.js.org/posts/ea33ab97/", "date": "2020-12-30T13:48:10.000Z", "avatar": "https://butterfly.js.org/img/avatar.png"}]}
        title： 文章标题
        num： 文章总数
        url： 文章链接
        date： 文章发表时间 非更新时间
        avatar： 头像
        
        下次更新适配未开启rss的博客
        """
        return data_json

    async def friend_query(self):
        """
        进入你友链的主页获取对方是否添加了你
        :return:
        """
        k = []
        kk = {}
        datas = {}
        x1 = 0
        session = requests.Session()
        for i in self.data['data']:
            x1 += 1
            # print('desc', i['desc'])
            link = i['url'][0]
            host = parse.urlparse(self.link).netloc
            print('查询友链进度：' + str(round(x1 / len(self.data['data']) * 100, 1)) + '%')
            if host not in link:
                data = i
                for links in link_path:
                    friend_link = link + links + '/' if link[-1] == '/' else (link + '/%s/' % links)
                    print(friend_link)
                    try:
                        response = session.get(friend_link, timeout=5)
                        if response.status_code == 200:
                            html = response.text
                            # print('host', host)
                            if host in html:
                                kk = {'add': True}
                            else:
                                kk = {'add': False}
                            break
                        else:
                            kk = {'msg': '请求失败'}
                    except Exception as e:
                        kk = {'msg': '请求失败'}
                        print(e)
                data.update(kk)
                k.append(data)
                # print(data)
        datas.update({'data': k})
        print(json.dumps(datas))
        """
        [{"desc": "\u5f20\u6d2aHeo \u5206\u4eab\u8bbe\u8ba1\u4e0e\u79d1\u6280\u751f\u6d3b", "url": ["https://blog.zhheo.com/"], "add": true}]
        返回字段释义：desc=昵称加个性签名
        url:博客地址
        add:是否添加了你
        msg:一般是请求失败了，他的友链路径非“/link”
        """
        return datas



async def main():
    url = 'https://akilar.top/link/'
    res = friend_qu(url)
    # 获取友链详情
    await res.get_friends()
    # 查询友链是否添加了你
    await res.friend_query()
    # 获取友链主页的最新文章或随机文章
    await res.friend_post(False)


if __name__ == '__main__':
    asyncio.run(main())
```
{% endfolding %}

{% folding cyan, 配置文件代码 %}

```python
# -*- coding: utf-8 -*-
"""
@Time    : 2022/8/20 17:58
@Author  : superhero
@Email   : 838210720@qq.com
@File    : config.py
@IDE: PyCharm
"""
from pydantic import BaseModel

class Config(BaseModel):
    # 设置友链路径
    link_path: list = ['link', 'friend', 'friends']

plugin_config = Config.parse_obj({})
```

{% endfolding %}

# 未完待续

- 下次更新适配未开启rss的博客