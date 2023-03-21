---
title: 多多配音
tags: 软件设计
categories: 软件设计
keywords: 配音工具
description: 主要是解决自媒体视频配音的问题，集成了多种风格和不同的人物状态发音，模拟真实的人声。
cover: >-
  /temp/img/Maite-Franchi-Folio-Illustration-T-Brand-NYT-SAS_Barilla_Pasta-Data.jpg
sticky: 10
abbrlink: 7c2ce35f
date: 2022-06-15 19:52:10
---

# 更新记录
{% folding cyan open, 2023 %}
{% timeline 2023,green %}
<!-- timeline 03-19 -->
- 版本v7.0  [下载软件](/temp/多多配音V7.0.zip)
1. 恢复微软、阿里合成服务
2. 取消阿里长文本合成
3. 由于被大量使用导致服务欠费，故而不再提供无偿服务
4. 收费标准：10元/月，100元/年
5. [哈勃分析报告](https://habo.qq.com/file/showdetail?pk=ADcGb11oB2UIP1s9U2U%3D)
<!-- endtimeline -->
<!-- timeline 02-10 -->
- 版本v6.0
1. 解决微软首次加载提示失败的问题
2. 新增音频格式选择
3. 阿里云支持长文本
4. [哈勃分析报告](https://habo.qq.com/file/showdetail?pk=ADcGb11uB2EIMVs%2BU2Y%3D)
<!-- endtimeline -->
{% endtimeline %}
{% endfolding %}

{% folding, 2022 %}
{% timeline 2022,blue %}
<!-- timeline 10-26 -->
- 版本v5.0
1. 修复已知的问题
2. 新增添加背景音乐
3. 优化语气显示（显示中文）
4. [哈勃分析报告](https://habo.qq.com/file/showdetail?pk=ADcGbl1lB2AIPVs4U2I%3D)
<!-- endtimeline -->
<!-- timeline 10-22 -->
- 版本v4.0
1. 恢复微软语音合成
2. 修复播放卡死等问题
3. 生成smml新增连续生成开关
<!-- endtimeline -->
<!-- timeline 10-16 -->
- 版本v3.0
1. 微软语音合成暂不可用
<!-- endtimeline -->
<!-- timeline 06-27 -->
- 版本v2.0
1. 新增阿里云平台合成
2. 修改ssml生成方式
<!-- endtimeline -->
<!-- timeline 06-15 -->
- 版本v1.0
<!-- endtimeline -->
{% endtimeline %}
{% endfolding %}
# 语音合成功能介绍

{% tabs 功能介绍 %}
<!-- tab 功能简介 -->
```text
主要是解决自媒体视频配音的问题，集成了多种风格和不同的人物状态发音，模拟真实的人声。
支持SSML语言（语音合成标记语言），傻瓜式操作不需要懂SSML也可以操作。
适用人群：为动画、电影解说、搞笑动漫、电子书阅读等配音。
软件优势：可以快速合成多情感的有声书，集合了多种场景的角色配音，有直播带货、悬疑解说、客服等，操作方便，界面简介无广告。
配音来源于微软azure以及阿里云语音tts
```
<!-- endtab -->
<!-- tab 音频试听 -->
**带货场景**

- 阿里云-发音人：laomei

{% audio /temp/ali_daihuo.mp3 %}

- 微软-发音人：Xiaoyan

{% audio /temp/azure_daihuo.mp3 %}

**含背景音乐**

- 微软-发音人：Xiaoxiao-温和、礼貌的语气

{% audio /temp/azure_backg.wav %}

**长篇文本**

- 阿里云-单发音人：猫小美

{% audio https://qcloud.app966.cn/file/1676023161.wav %}

- 微软-多发音人：Xiaohan、Yunxi、Yunye等

{% audio /temp/azure_滕王阁序.wav %}

<!-- endtab -->
<!-- tab 界面截图 -->
{% image https://qcloud.app966.cn/img/duoduo.png, alt= %}
{% image /img/duoduo_2.png, alt= %}
<!-- endtab -->
<!-- tab 常见问题 -->

- Q：登录后提示“初始化失败，请点击切换平台重试？”
- A：点击`平台选择`再次`点击微软`即可解决。

<!-- endtab -->
{% endtabs %}

# 阿里云_SSML语言文档
[/document_detail/101645.html](https://help.aliyun.com/document_detail/101645.html)
# 阿里云_接口文档
[/document_detail/84435.html](https://help.aliyun.com/document_detail/84435.html)


# 微软azure_SSML语言文档
[/azure/cognitive-services/speech-service/speech-synthesis-markup](https://docs.microsoft.com/zh-cn/azure/cognitive-services/speech-service/speech-synthesis-markup)
# 微软azure_接口文档
[/azure/cognitive-services/speech-service/language-support](https://docs.microsoft.com/zh-cn/azure/cognitive-services/speech-service/language-support#text-to-speech)

# 微软azure_语音文档

**仅统计部分`更多查阅接口文档`**

{% tabs azure语音文档 %}
<!-- tab 发音的人 -->
1. 发音的人-`女`
```text
XiaochenNeural
XiaohanNeural
XiaomoNeural
XiaoqiuNeural
XiaoruiNeural
XiaoshuangNeural
XiaoxiaoNeural
XiaoxuanNeural
XiaoyanNeural
XiaoyouNeural
XiaobeiNeural - 晓北辽宁话版
```
2. 发音的人-`男`
```text
YunxiNeural
YunyangNeural
YunyeNeural
YunfengNeural
YunhaoNeural
YunjianNeural
YunxiSichuanNeural - 云希四川话版
```
<!-- endtab -->

<!-- tab 讲话风格 -->
1. 同一人`不同的语气`说话
```text
advertisement_upbeat - 用兴奋和精力充沛的语气推广产品或服务。
affectionate - 表达温暖而亲切的语气
angry - 表达生气和厌恶的语气。
assistant - 以热情而轻松的语气对数字助理讲话。
calm - 以沉着冷静的态度说话。
chat - 表达轻松随意的语气。
cheerful - 表达积极愉快的语气。
customerservice - 以友好热情的语气为客户提供支持。
depressed - 调低音调和音量来表达忧郁、沮丧的语气。
disgruntled - 表达轻蔑和抱怨的语气。
embarrassed - 在说话者感到不舒适时表达不确定、犹豫的语气。
empathetic - 表达关心和理解。
envious - 当你渴望别人拥有的东西时，表达一种钦佩的语气。
excited - 表达乐观和充满希望的语气。
fearful - 以较高的音调、较高的音量和较快的语速来表达恐惧、紧张的语气。
friendly - 礼貌和愉快的语气。
hopeful - 表达一种温暖且渴望的语气。
lyrical - 以优美又带感伤的方式表达情感。
narration-professional - 以专业、客观的语气朗读内容。
narration-relaxed - 为内容阅读表达一种舒缓而悦耳的语气。
newscast - 以正式专业的语气叙述新闻。
newscast-casual - 以通用、随意的语气发布一般新闻。
newscast-formal - 以正式、自信和权威的语气发布新闻。
poetry-reading - 在读诗时表达出带情感和节奏的语气。
sad - 表达悲伤语气。
serious - 表达严肃和命令的语气。
shouting - 就像从遥远的地方说话或在外面说话。
sports_commentary - 用轻松有趣的语气播报体育赛事。
sports_commentary_excited - 用快速且充满活力的语气播报体育赛事精彩瞬间。
whispering - 说话非常柔和，发出的声音小且温柔。
terrified - 表达一种非常害怕的语气，语速快且声音颤抖。
unfriendly - 表达一种冷淡无情的语气。
documentary-narration - 适合配音纪录片、专家评论和类似内容。
```
<!-- endtab -->

<!-- tab 角色扮演 -->
1. 同一人扮演`不同的角色`
```text
Girl - 该语音模拟女孩。
Boy - 该语音模拟男孩。
YoungAdultFemale - 该语音模拟年轻成年女性。
YoungAdultMale - 该语音模拟年轻成年男性。
OlderAdultFemale - 该语音模拟年长的成年女性。
OlderAdultMale - 该语音模拟年长的成年男性。
SeniorFemale - 该语音模拟老年女性。
SeniorMale - 该语音模拟老年男性。
```
<!-- endtab -->
{% endtabs %}

# 文本处理功能介绍
```text
支持文本插入、去重、替换、合并等，支持G级文本去重复。
```

# 快速上手
{% tabs duoduo %}
<!-- tab 简介 -->
```text
可以快速合成多情感的有声书，集合了多种场景的角色配音，有直播带货、悬疑解说、客服等，操作方便，界面简介无广告，
平台尽量选择微软，阿里不适用于长文本合成
```
<!-- endtab -->
<!-- tab 重大改变 -->
```diff
- 删除快捷生成ssml符号："【】"
+ 新增快捷生成ssml符号："{{}}"
+ 新增"{{停顿}}"
+ 新增"{{背景音乐}}"


注意快捷短语一定要加在待合成的语音前面，
其中多个内容可用‘|’间隔开，
例如："{{音调=10|语速=-9|音高升降曲线=(80%,-20%) (100%,+80%)|风格强度=0}}"，
"{{停顿}}"默认为停顿500毫秒生成后可以修改数值，
新增"{{背景音乐}}"只支持线上音频，暂不支持自定义上传，在设置可设置背景音乐。

总结：如果要合成多情感的音频使用微软的版本（使用ssml的建议用微软azure，阿里云ssml只能一句话一句话合成以及只有少量的4个发音人支持），
如果只生成一句话不需要太复杂的调整使用阿里云微软都可以。
```
<!-- endtab -->
<!-- tab 视频教程 -->
<div style="position: relative; padding: 30% 45%;">
<iframe style="position: absolute; width: 100%; height: 100%; left: 0; top: 0;" src="//player.bilibili.com/player.html?aid=769814199&bvid=BV1ur4y1V725&cid=740680180&page=1&as_wide=1&high_quality=1&danmaku=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
<!-- endtab -->
{% endtabs %}


