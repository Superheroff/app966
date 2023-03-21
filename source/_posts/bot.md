---
title: python + go-cqhttp + nonebot搭建企鹅机器人相关教程
tags:
  - python
  - go-cqhttp
  - onebot
  - 教程
categories:
  - python
keywords: 企鹅机器人相关教程
cover: >-
  /temp/img/James-Gilleard-Folio-Illustration-Building-Construction-Quarry-Digital.jpg
abbrlink: 38eaae15
date: 2022-07-08 19:51:11
---

# 前言
{% tip warning faa-horizontal animated %}最好是有python基础否则安装以及开发插件会有点问题{% endtip %}

{% checkbox green checked, 支持自己开发插件 %}
{% checkbox green checked, 支持多个机器人账号负载均衡 %}
{% checkbox green checked, 此源码是本人开发完善过的没有特殊要求可以直接使用 %}
{% checkbox times red checked, 请勿用于非法途径 %}


# 运行环境
{% tabs 运行环境 %}
<!-- endtab -->
<!-- tab v1 -->

```
python == 3.7.3
go-cqhttp == v1.0.0-rc3
nonebot == v1.9.1
```
<!-- endtab -->
<!-- tab v2 -->

```
python == 3.8
go-cqhttp == v1.0.0-rc3
nonebot == v2.0.0-beta.4
```

```
aiodns==3.0.0
aiofile==3.7.4
aiofiles==0.8.0
aiohttp==3.8.1
aiosignal==1.2.0
anyio==3.6.1
appdirs==1.4.4
APScheduler==3.9.1
arrow==1.2.2
asgiref==3.5.2
async-timeout==4.0.2
asyncio-dgram==2.1.2
attrs==21.4.0
backports.zoneinfo==0.2.1
beautifulsoup4==4.11.1
binaryornot==0.4.4
Brotli==1.0.9
brotlipy==0.7.0
cachetools==5.2.0
caio==0.9.6
cchardet==2.1.7
certifi==2021.10.8
cffi @ file:///C:/ci_310/cffi_1642682485096/work
chardet==5.0.0
charset-normalizer @ file:///tmp/build/80754af9/charset-normalizer_1630003229654/work
click==8.1.3
cn2an==0.5.17
colorama @ file:///tmp/build/80754af9/colorama_1607707115595/work
conda==4.12.0
conda-content-trust @ file:///tmp/build/80754af9/conda-content-trust_1617045594566/work
conda-package-handling @ file:///C:/ci/conda-package-handling_1649105961774/work
cookiecutter==1.7.3
cryptography @ file:///C:/ci/cryptography_1639472366776/work
dateparser==1.1.1
Django==4.0.6
dnspython==2.2.1
fastapi==0.78.0
frozenlist==1.3.0
fuzzyfinder==2.1.0
h11==0.12.0
h2==4.1.0
hpack==4.0.0
httpcore==0.15.0
httptools==0.4.0
httpx==0.23.0
hyperframe==6.0.1
idna @ file:///tmp/build/80754af9/idna_1637925883363/work
image==1.5.33
importlib-metadata==4.12.0
jieba==0.42.1
Jinja2==3.1.2
jinja2-time==0.2.0
loguru==0.6.0
logzero==1.7.0
lxml==4.9.1
MarkupSafe==2.1.1
mcstatus==9.2.0
menuinst @ file:///C:/ci/menuinst_1631733428175/work
msgpack==1.0.4
multidict==6.0.2
nb-cli==0.6.7
nonebot-adapter-cqhttp==2.0.0b1
nonebot-adapter-onebot==2.0.0b1
nonebot-plugin-admin==0.3.21
nonebot-plugin-apscheduler==0.1.2
nonebot-plugin-gamedraw==0.3.8
nonebot-plugin-help==0.3.1
nonebot-plugin-status==0.4.0
nonebot2==2.0.0b4
Pillow==9.2.0
poyo==0.5.0
proces==0.1.2
prompt-toolkit==3.0.30
psutil==5.9.1
pycares==4.2.1
pycosat==0.6.3
pycparser @ file:///tmp/build/80754af9/pycparser_1636541352034/work
pycryptodome==3.15.0
pydantic==1.9.1
pyee==8.2.2
PyExecJS==1.5.1
pyfiglet==0.8.post1
pygtrie==2.4.2
pyncm==1.6.6.6
pyOpenSSL @ file:///opt/conda/conda-bld/pyopenssl_1643788558760/work
pypinyin==0.42.1
pyppeteer==1.0.2
PySocks @ file:///C:/ci/pysocks_1605287845585/work
python-dateutil==2.8.2
python-dotenv==0.20.0
python-slugify==6.1.2
pytz==2022.1
pytz-deprecation-shim==0.1.0.post0
pywin32==302
PyYAML==6.0
qrcode==7.3.1
regex==2022.3.2
requests==2.28.1
rfc3986==1.5.0
ruamel-yaml-conda @ file:///C:/ci/ruamel_yaml_1616016967756/work
ruamel.yaml==0.17.21
ruamel.yaml.clib==0.2.6
six @ file:///tmp/build/80754af9/six_1644875935023/work
sniffio==1.2.0
soupsieve==2.3.2.post1
sqlparse==0.4.2
starlette==0.19.1
tencentcloud-sdk-python==3.0.673
text-unidecode==1.3
tinydb==4.7.0
tomlkit==0.10.2
tqdm @ file:///opt/conda/conda-bld/tqdm_1647339053476/work
typing_extensions==4.3.0
tzdata==2022.1
tzlocal==4.2
ujson==5.4.0
urllib3 @ file:///opt/conda/conda-bld/urllib3_1643638302206/work
uvicorn==0.17.6
watchgod==0.8.2
wcwidth==0.2.5
websockets==10.3
win-inet-pton @ file:///C:/ci/win_inet_pton_1605306167264/work
win32-setctime==1.1.0
wincertstore==0.2
yarl==1.7.2
zhconv==1.4.3
zipp==3.8.0
```

<!-- endtab -->
{% endtabs %}


# 目录结构

{% tabs 目录结构 %}
<!-- endtab -->
<!-- tab v1 -->

```
awesome-bot
├── awesome
│   └── plugins
│       └── ai_chat.py # 腾讯NLP插件 用于智能回答 https://cloud.tencent.com/product/nlp
│       └── bing.py # 必应壁纸插件
│       └── getping.py # tcping插件
│       └── group_admin.py # QQ群相关插件
│       └── history.py # 历史的今天插件
│       └── time.py # 时间插件
│       └── usage.py # 帮助中心
│       └── weather.py # 天气插件
│       └── weibohot.py # 微博热搜插件
│       └── wyy.py # 网易云音乐插件
├── bot.py # 机器人运行
└── config.py # 机器人配置
```
<!-- endtab -->
<!-- tab v2 -->

```
📦 AweSome-Bot
├── 📂 awesome_bot         # 或是 src
│   └── 📜 plugins         # 插件目录
├── 📜 .env                # config选择
├── 📜 .env.dev            # 可选的[可作为调试环境]
├── 📜 .env.prod           # 可选的[生产环境]
├── 📜 .gitignore
├── 📜 bot.py
├── 📜 docker-compose.yml
├── 📜 Dockerfile
├── 📜 pyproject.toml
└── 📜 README.md
```
<!-- endtab -->
{% endtabs %}
**下载 [bot_v1.zip](/file/awesome-bot.zip)**
{% tip cogs %}bot_v1.zip是包含插件的源码，安装配置python、go-cqhttp可简单使用{% endtip %}

# 安装

{% tabs 安装 %}
<!-- endtab -->
<!-- tab v1 -->
- 安装nonebot

```python
pip install nonebot
```
- 安装[go-cqhttp](https://github.com/Mrs4s/go-cqhttp/releases)
- 配置go-cqhttp
1. 双击`go-cqhttp_windows.exe`会生成一个`.bat`文件
2. 运行.bat文件`选择反向Websocket通信`
3. 修改`config.yml`配置文件

```yml
# 输入自己的账号密码
account: # 账号相关
  uin: 1233456 # QQ账号
  password: '' # 密码为空时使用扫码登录

# 输入python 服务的地址
servers:
  - ws-reverse:
      universal: ws://127.0.0.1:8080/ws/
```
- 运行
1. 运行go-cqhttp.bat和bot.py
<!-- endtab -->
<!-- tab v2 -->
- 安装nonebot

```
pip uninstall nonebot # 先卸载v1
pip install nb-cli

nb driver install httpx # 安装驱动
nb driver install aiohttp # 安装驱动

nb adapter install nonebot-adapter-onebot # 安装适配器

nb create # 创建项目 选择“src”-选中(空格选中)“echo”-选中(空格选中)“OneBot V11”
```
- 安装[go-cqhttp](https://github.com/Mrs4s/go-cqhttp/releases)
- 配置go-cqhttp
1. 双击`go-cqhttp_windows.exe`会生成一个`.bat`文件
2. 运行.bat文件`选择反向Websocket通信`
3. 修改`config.yml`配置文件

```yml
# 输入自己的账号密码
account: # 账号相关
  uin: 1233456 # QQ账号
  password: '' # 密码为空时使用扫码登录

# 输入python 服务的地址
servers:
  - ws-reverse:
      universal: ws://127.0.0.1:8080/onebot/v11/ws/
```
- 运行
1. 运行go-cqhttp.bat
2. nb run
<!-- endtab -->
{% endtabs %}

# 遇到的问题

```
报错ValueError: invalid literal for int() with base 10: b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
把FASTAPI_RELOAD=false即可解决

不行就运行netsh winsock reset

nb create创建项目时空格选中目标
```

- 结束
1. 完成以上配置基本就能用了更多插件需要自己开发了
2. [nonebot文档](https://docs.nonebot.dev/)
3. [go-cqhttp](https://github.com/Mrs4s/go-cqhttp)

# 插件相关

```
# 加载别人的插件
nonebot.load_plugin("path.to.your.plugin")

# 加载自己开发的插件
nonebot.load_plugins("src/plugins", "path/to/your/plugins")
```
## 开发天气插件示例
{% tabs 开发插件 %}
<!-- endtab -->
<!-- tab v1 -->

```python
from nonebot import on_command, CommandSession
from nonebot import on_natural_language, NLPSession, IntentCommand
import requests
from jieba import posseg
__plugin_name__ = '天气查询 示例/天气 北京'
__plugin_usage__ = r"""
示例 /天气[城市名]
"""
def get_tianqi(city):
    url = 'http://autodev.openspeech.cn/csp/api/v2.1/weather?openId=aiuicus&clientType=android&sign=android&city=' + city + '&needMoreData=true&pageNo=1&pageSize=1'
    ret = requests.get(url).json()
    if ret.get('msg', '') == '操作成功':
        title = ''
        if ret['data']['list'][0]['moreData'].get('alert', None) is not None:
            title = '\n' + '预警信息：' + ret['data']['list'][0]['moreData']['alert'][0]['title']
        txt = f'{city}当前的温度是'+str(ret['data']['list'][0]['temp'])+'度，'+ret['data']['list'][0]['weather']+'，空气'+ret['data']['list'][0]['airQuality']+'，PM2.5：'+str(ret['data']['list'][0]['pm25'])+title

    else:
        txt = 'null'
    # print(txt)
    return txt
# on_command 装饰器将函数声明为一个命令处理器
# 这里 weather 为命令的名字，同时允许使用别名「天气」「天气预报」「查天气」
@on_command('weather', aliases=('天气', '天气预报', '查天气'))
async def _(session: CommandSession):
    # 取得消息的内容，并且去掉首尾的空白符
    city = session.current_arg_text.strip()
    # 如果除了命令的名字之外用户还提供了别的内容，即用户直接将城市名跟在命令名后面，
    # 则此时 city 不为空。例如用户可能发送了："天气 南京"，则此时 city == '南京'
    # 否则这代表用户仅发送了："天气" 二字，机器人将会向其发送一条消息并且等待其回复
    if not city:
        city = (await session.aget(prompt='你想查询哪个城市的天气呢？')).strip()
        # 如果用户只发送空白符，则继续询问
        while not city:
            city = (await session.aget(prompt='要查询的城市名称不能为空呢，请重新输入')).strip()
    # 获取城市的天气预报
    weather_report = get_tianqi(city)
    # 向用户发送天气预报
    await session.send(weather_report)

@on_natural_language(keywords={'天气'})
async def _(session: NLPSession):
    # 去掉消息首尾的空白符
    stripped_msg = session.msg_text.strip()
    # 对消息进行分词和词性标注
    words = posseg.lcut(stripped_msg)

    city = None
    # 遍历 posseg.lcut 返回的列表
    for word in words:
        # 每个元素是一个 pair 对象，包含 word 和 flag 两个属性，分别表示词和词性
        if word.flag == 'ns':
            # ns 词性表示地名
            city = word.word
            break

    # 返回意图命令，前两个参数必填，分别表示置信度和意图命令名
    return IntentCommand(90.0, 'weather', current_arg=city or '')
```
<!-- endtab -->
<!-- tab v2 -->

```python
from nonebot import on_command
from nonebot.matcher import Matcher
from nonebot.adapters import Message
from nonebot.params import Arg, CommandArg, ArgPlainText
import requests

import nonebot.plugin

__plugin_meta__ = nonebot.plugin.PluginMetadata(
    name='获取天气信息',
    description='按城市获取天气信息',
    usage='''命令/天气 北京<参数：城市>''',
    extra={'version': '1.0'}
)
__help_version__ = '1.0'
weather = on_command("weather", aliases={"天气", "天气预报"}, priority=5)


@weather.handle()
async def handle_first_receive(matcher: Matcher, args: Message = CommandArg()):
    plain_text = args.extract_plain_text()  # 首次发送命令时跟随的参数，例：/天气 上海，则args为上海
    if plain_text:
        matcher.set_arg("city", args)  # 如果用户发送了参数则直接赋值


@weather.got("city", prompt="你想查询哪个城市的天气呢？")
async def handle_city(city: Message = Arg(), city_name: str = ArgPlainText("city")):
    if not city_name:  # 如果参数不符合要求，则提示用户重新输入
        # 可以使用平台的 Message 类直接构造模板消息
        await weather.reject(city.template("要查询的城市名称不能为空呢，请重新输入"))

    city_weather = await get_weather(city_name)
    await weather.finish(city_weather)


async def get_weather(city: str) -> str:
    url = 'http://autodev.openspeech.cn/csp/api/v2.1/weather?openId=aiuicus&clientType=android&sign=android&city=' + city + '&needMoreData=true&pageNo=1&pageSize=1'
    ret = requests.get(url).json()
    if ret.get('msg', '') == '操作成功':
        title = ''
        if ret['data']['list'][0]['moreData'].get('alert', None) is not None:
            title = '\n' + '预警信息：' + ret['data']['list'][0]['moreData']['alert'][0]['title']
        txt = f'{city}当前的温度是'+str(ret['data']['list'][0]['temp'])+'度，'+ret['data']['list'][0]['weather']+'，空气'+ret['data']['list'][0]['airQuality']+'，PM2.5：'+str(ret['data']['list'][0]['pm25'])+title

    else:
        txt = 'null'
    # print(txt)
    return txt
```
<!-- endtab -->
{% endtabs %}

# 已支持的功能及命令
{% tip cogs %}除被动功能所有命令都需要加“/”触发{% endtip %}

{% checkbox green checked, 必应壁纸 示例/bing 1[表示获取1天前的] %}
{% checkbox green checked, 历史上的今天 示例/历史 %}
{% checkbox green checked, /help 示例/help 网易云音乐 %}
{% checkbox green checked, 抽卡游戏 示例/原神角色2抽 %}
{% checkbox green checked, 微博热搜榜 示例/热搜 10[条数默认10，>15将逐条获取] %}
{% checkbox green checked, ping域名 示例/ping www.app966.com %}
{% checkbox green checked, 天气查询 示例/天气 北京 %}
{% checkbox green checked, 网易点歌 示例/点歌 歌曲名 %}
{% checkbox green checked, 网易下载 示例/wyys 歌曲名 %}
{% checkbox green checked, 酷我点歌 示例/kwplay 歌曲名 %}
{% checkbox green checked, 酷我下载 示例/kwdow 歌曲名 %}
{% checkbox green checked, 历史上的今天 示例/历史 %}
{% checkbox green checked, 人生重开模拟器 示例/remake %}
{% checkbox green checked, 网易新闻 示例/news [条数默认10，>10将逐条获取] %}
{% checkbox green checked, 抖音视频解析 示例/抖音 视频链接 %}
{% checkbox green checked, 抖音添加喜欢的播主 示例/抖音添加 主页链接 %}
{% checkbox green checked, 抖音随机取添加的播主视频，每个群设置不同互相隔离 示例/dyget %}
{% checkbox green checked, 防疫政策查询 示例/yiq 上海 %}
{% checkbox green checked, 群管系统 %}
{% checkbox green checked, 每日早间微语 被动功能，每日7:10自动发送 %}
{% checkbox green checked, 随机语录 示例/骚话/舔话 %}
{% checkbox green checked, 被动功能支持开关控制 示例/开关 %}
{% checkbox green checked, 淘宝商品优惠查询 打开手淘app-分享想查询的商品链接-复制到群内 %}
{% checkbox green checked, 收录查询 示例/record app966.cn,all %}
{% checkbox green checked, 新增openai（chatgpt） 示例/AI 上课迟到了帮我写份500字的检讨 %}

## 群管系统命令
1. 添加违禁词 命令/添加违禁词 待添加的违禁词【仅限管理】
2. 加群处理 后台设置自动同意或拒绝，需回答正确的答案等，可实现自动同意或拒绝入群【需管理权限】
3. 防撤回 命令/开关 防撤回【仅限管理】
4. 禁言 命令/禁 @待禁言的人 禁言时间可不填【需管理权限】
5. 解禁 命令/解 @待解除禁言的人【需管理权限】
6. 踢人 命令/踢 @待踢出群聊的人【需管理权限】
7. 拉黑并踢除 命令/黑 @待拉黑并踢出群聊的人【需管理权限】
8. 撤回群成员消息 命令/撤回 @待撤回消息的人 撤回消息数量默认5【需管理权限】
9. 双击机器人头像可以召唤他
{% image /temp/img/群管_1.png, alt= %}
{% image /temp/img/群管_2.png, alt= %}

## openai（chatgpt）命令
命令|命令示例|参数释义
---|---|---
命令1：/ai|/ai 以鲁迅的口吻写一盘散文 或 /ai 用java写一个访问百度的例子|1个参数，想用ai做什么，必填
命令2：/img|/img 老虎,2,1|有3个参数：老虎=图片类型，必填；2=生成图片数量，选填默认1；1=图片大小，选填默认256*256
命令3："""内容"""|"""1. Create a list of first names2. Create a list of last names3. Combine them randomly into a list of 100 full names"""|注意格式即可，"""开头"""结尾


## 相关命令
{% span h4 , 帮助命令 %}
1. help
2. help list （展示已加载插件列表）
3. help <plugin_name> （调取目标插件帮助信息，示例/help wyy）

{% span h4 , 抽卡游戏命令 %}

**原神**
- 原神N抽 （常驻池）
- 原神角色N抽 （角色UP池）
- 原神武器N抽 （武器UP池）

**赛马娘**
- 赛马娘N抽 （抽马）
- 赛马娘卡N抽 （抽卡）

**坎公骑冠剑**
- 坎公骑冠剑N抽 （抽角色）
- 坎公骑冠剑武器N抽 （抽武器）

**碧蓝航线**
- 碧蓝轻型N抽 （轻型池）
- 碧蓝重型N抽 （重型池）
- 碧蓝特型N抽 （特型池）
- 碧蓝活动N抽 （活动池）

**其他命令**
- 重置原神抽卡（重置保底）
- 重载原神卡池
- 重载方舟卡池
- 重载赛马娘卡池
- 重载坎公骑冠剑卡池

**更新命令**
- 更新明日方舟信息
- 更新原神信息
- 更新赛马娘信息
- 更新坎公骑冠剑信息
- 更新pcr信息
- 更新碧蓝航线信息
- 更新fgo信息
- 更新阴阳师信息


# 如何使用本机器人
1. 根据本教程自己搭建并使用我开源的[插件](/post/2134719b.html)
2. 加入群聊`582392380`，回答内容需超过`8个字`或者回答`app966.cn`
3. 购买，购买后整个机器人都归你所有并可添加个性化功能定制

# 更多功能
{% checkbox green checked, 可付费定制更多功能 %}
{% checkbox green checked, 付费版可解锁更多强大的插件 %}

# 结尾

- 企鹅机器人相对还是比较简单的
- 百分之98以上插件是本人写的，有需要可以[下载](/post/2134719b.html)
- 免费版插件不会再更新了，没有那么多精力去搞
- 有其他需求付费定制的可以私聊我

