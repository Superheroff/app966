---
title: "\U0001F3AD playwright 相关笔记"
tags: playwright
categories: playwright
keywords: playwright
cover: >-
  /temp/img/Maite-franchi-folio-art-food-illustration-Barilla_Basilic-Pistachio-pesto-pasta.jpg
abbrlink: 1dcad1c5
date: 2022-08-03 13:10:53
---

# 什么是Playwright？
{% ghcard microsoft/playwright %}
- [Playwright](https://playwright.bootcss.com/)是微软在`2020年初`开源的新一代自动化测试工具，它的功能类似于`Selenium、Pyppeteer`等，都可以驱动浏览器进行各种自动化操作。它的功能也非常强大，对市面上的主流浏览器都提供了支持，API 功能简洁又强大。虽然诞生比较晚，但是现在发展得非常火热。
- 因为Playwright是一个类似[Selenium](https://python-selenium-zh.readthedocs.io/zh_CN/latest/)一样可以支持网页页面渲染的工具，再加上其强大又简洁的API，Playwright同时也可以作为网络爬虫的一个爬取利器。
- Playwright是`支持异步`的，异步`并非多线程`。例如：程序a2秒执行完，程序b5秒执行完，非异步的话全部执行完要`7`秒，异步的话只要`5`秒，异步需要了解`asyncio`

# 安装

```python
pip install playwright
python -m playwright install
```

# 基本参数

## Playwright基本参数

```
--headed：在有头模式下运行测试（默认：无头）。
--browser：在不同的浏览器中运行测试chromium，firefox或webkit。可以多次指定（默认：所有浏览器）。
--browser-channel 要使用的浏览器频道。
--slowmo以慢动作运行测试。
--device 要模拟的设备。
--output测试产生的工件目录（默认值：）test-results。
--tracing是否为每个测试记录跟踪。on, off, 或retain-on-failure（默认值：off）。
--video是否为每次测试录制视频。on, off, 或retain-on-failure（默认值：off）。
--screenshot每次测试后是否自动截屏。on, off, 或only-on-failure（默认值：off）。
```

## Selenium基本参数
[查看更多](https://peter.sh/experiments/chromium-command-line-switches/)

```
# options.add_argument('--headless')                     # 开启无界面模式
# options.add_argument("--disable-gpu")                  # 禁用gpu
# options.add_argument('--user-agent=Mozilla/5.0 HAHA')  # 配置对象添加替换User-Agent的命令
# options.add_argument('--window-size=1366,768')         # 设置浏览器分辨率（窗口大小）
# options.add_argument('--start-maximized')              # 最大化运行（全屏窗口）,不设置，取元素会报错
# options.add_argument('--disable-infobars')             # 禁用浏览器正在被自动化程序控制的提示
# options.add_argument('--incognito')                    # 隐身模式（无痕模式）
# options.add_argument('--disable-javascript')           # 禁用javascript
# options.add_argument('--disable-plugins') # 禁止加载所有插件
# options.add_argument('--blink-settings=imagesEnabled=false') # 禁止加载图片
# options.add_argument('--user-agent=xx')  # 配置对象添加替换User-Agent的命令
```



# 基本使用

## 获取谷歌统计示例
- 获取谷歌的统计信息

{% tabs 基本使用 %}
<!-- tab playwright同步 -->

```python
import re
from playwright.sync_api import sync_playwright

def cancel_request(route, request):
    route.abort()

def google(p, link):
    url = 'https://www.google.com/search?q=site%3A' + link
    proxy = {
        'server': 'http://127.0.0.1:7890'
    }
    browser = p.webkit.launch(headless=False, proxy=proxy)
    context = browser.new_context()
    page.route(re.compile(r"(\.png)|(\.jpg)|(\.css)"), cancel_request)
    page = context.new_page()
    page.goto(url)
    res = page.query_selector('xpath=//*[@id="result-stats"]')
    res_info = res.text_content()
    browser.close()
    if not res_info:
        res_info = '未收录'
    return res_info

def main():
    with sync_playwright() as playwright:
        ret = google(playwright, 'app966.cn')
        print(ret)
        
main()
```
<!-- endtab -->
<!-- tab playwright异步 -->
- 注意异步引入的是`playwright.async_api`，这里我就踩坑了，导致一直报错

```python
import asyncio
import re
from playwright.async_api import async_playwright

async def cancel_request(route, request):
    await route.abort()

async def google(p, link):
    url = 'https://www.google.com/search?q=site%3A' + link
    proxy = {
        'server': 'http://127.0.0.1:7890'
    }
    browser = await p.webkit.launch(headless=False, proxy=proxy)
    context = await browser.new_context()
    page = await context.new_page()
    await page.route(re.compile(r"(\.png)|(\.jpg)|(\.css)"), cancel_request)
    await page.goto(url)
    res = await page.query_selector('xpath=//*[@id="result-stats"]')
    res_info = res.text_content()
    await browser.close()
    if not res_info:
        res_info = '未收录'
    return res_info

async def main():
    async with async_playwright() as playwright:
        ret = await google(playwright, 'app966.cn')
        print(ret)

asyncio.run(main())
```
<!-- endtab -->
<!-- tab selenium -->
- Selenium的相同操作代码我也放下吧，这里是`Selenium 4.3.0`版本，旧版不适用

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
def google(link):
    url = 'https://www.google.com/search?q=site%3A' + link
    prefs = {"profile.managed_default_content_settings.images": 2, 'permissions.default.stylesheet': 2}
    options = ChromeOptions()
    options.add_experimental_option("prefs", prefs)
    options.add_argument("--headless")
    options.add_argument('--incognito')
    options.add_argument('--blink-settings=imagesEnabled=false')
    browser = webdriver.Chrome(executable_path=r'C:\Program Files (x86)\Google\Chrome\Application\chromedriver.exe', options=options)
    browser.get(url)
    res = browser.find_element(By.XPATH, '//*[@id="result-stats"]').text
    browser.close()
    if not res:
        res = '未收录'
    return res
```
<!-- endtab -->
{% endtabs %}

## 禁用css、图片以提升访问速度

{% tabs 禁用 %}
<!-- tab playwright -->
- 使用`route.abort`中止请求

```python
import re
await page.route(re.compile(r"(\.png)|(\.jpg)|(\.css)"), route.abort())
```
<!-- endtab -->
<!-- tab selenium -->
- 设置基本参数

```python
from selenium import webdriver
from selenium.webdriver import ChromeOptions
options = ChromeOptions()
prefs = {"profile.managed_default_content_settings.images": 2,'permissions.default.stylesheet':2}
options.add_experimental_option("prefs", prefs)
browser = webdriver.Chrome(executable_path='xxx\chromedriver.exe', options=options)
```
<!-- endtab -->
{% endtabs %}


# Playwright与其它主流测试框架对比

能力|Playwright|Puppeteer|Selenium
---|---|---|---
速度|快|快|慢
归档能力|优秀|优秀|普通
开发体验|好|比较好|普通
支持的语言|JavaScript、Python、C#和Java|JavaScript|Java、Python、C#、Ruby、JavaScript和Kotlin
支持方|微软|谷歌|社区和赞助商
社区|小而活跃|大而活跃|大而活跃
浏览器支持|Chromium、Firefox和WebKit|Chromium|Chrome、Firefox、IE、Edge、Opera和Safari等

# 未完待续

- Playwright我也是刚学不久，有更多优秀的操作案例我会持续更新的


