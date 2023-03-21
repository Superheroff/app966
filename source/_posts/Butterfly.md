---
title: 使用Hexo框架搭建Butterfly博客笔记
tags: Butterfly
categories: Butterfly
keywords: 使用Hexo搭建博客
cover: /temp/img/James-Gilleard-Folio-Illustration-CIty-Cars-Traffic.jpg
sticky: 1
abbrlink: 198b0f49
date: 2022-06-23 03:10:33
---

# Hexo常用命令

`Hexo init` 初始化
`Hexo new post 标题` 创建一篇文章
`Hexo new page 标题` 创建一个页面
`Hexo clean` 清理缓存
`Hexo g` 生成静态文件
`Hexo d` 部署博客
`hexo server` 启动本地服务
`hexo render` 渲染文件
`hexo -p 端口号` 修改端口 默认4000
`hexo algolia` 使用algolia搜索时向后端传输搜索数据
`hexo clean && hexo g && hexo s` hexo三连

# 行内文本样式 text

{% tabs 行内文本样式 %}
<!-- tab 标签语法 -->

```markdown
{% u 文本内容 %}
{% emp 文本内容 %}
{% wavy 文本内容 %}
{% del 文本内容 %}
{% kbd 文本内容 %}
{% psw 文本内容 %}
```
<!-- endtab -->

<!-- tab 样式预览 -->
1. 带 {% u 下划线 %} 的文本
2. 带 {% emp 着重号 %} 的文本
3. 带 {% wavy 波浪线 %} 的文本
4. 带 {% del 删除线 %} 的文本
5. 键盘样式的文本 {% kbd command %} + {% kbd D %}
6. 密码样式的文本：{% psw 这里没有验证码 %}
<!-- endtab -->

<!-- tab 示例源码 -->

```markdown
1. 带 {% u 下划线 %} 的文本
2. 带 {% emp 着重号 %} 的文本
3. 带 {% wavy 波浪线 %} 的文本
4. 带 {% del 删除线 %} 的文本
5. 键盘样式的文本 {% kbd command %} + {% kbd D %}
6. 密码样式的文本：{% psw 这里没有验证码 %}
```
<!-- endtab -->
{% endtabs %}

# 行内文本 span

{% tabs 行内文本 %}
<!-- tab 标签语法 -->

```markdown
{% span 样式参数(参数以空格划分), 文本内容 %}
```
<!-- endtab -->

<!-- tab 配置参数 -->

1. 字体: logo, code
2. 颜色: {% span red, 红色 %}、{% span yellow, 黄色 %}、{% span green, 绿色 %}、{% span cyan, 青色 %}、{% span blue, 蓝色 %}、{% span gray, 灰色 %}
3. 大小: small, h4, h3, h2, h1, large, huge, ultra
4. 对齐方向: left, center, right

<!-- endtab -->

<!-- tab 样式预览 -->
- 彩色文字
在一段话中方便插入各种颜色的标签，包括：{% span red, 红色 %}、{% span yellow, 黄色 %}、{% span green, 绿色 %}、{% span cyan, 青色 %}、{% span blue, 蓝色 %}、{% span gray, 灰色 %}。
- 超大号文字
文档「开始」页面中的标题部分就是超大号文字。
{% span center logo large, Volantis %}
{% span center small, A Wonderful Theme for Hexo %}
<!-- endtab -->

<!-- tab 示例源码 -->

```markdown
- 彩色文字
在一段话中方便插入各种颜色的标签，包括：{% span red, 红色 %}、{% span yellow, 黄色 %}、{% span green, 绿色 %}、{% span cyan, 青色 %}、{% span blue, 蓝色 %}、{% span gray, 灰色 %}。
- 超大号文字
文档「开始」页面中的标题部分就是超大号文字。
{% span center logo large, Volantis %}
{% span center small, A Wonderful Theme for Hexo %}
```
<!-- endtab -->
{% endtabs %}

# 段落文本 p

{% tabs 段落文本 %}
<!-- tab 标签语法 -->

```markdown
{% p 样式参数(参数以空格划分), 文本内容 %}
```
<!-- endtab -->

<!-- tab 配置参数 -->

1. 字体: logo, code
2. 颜色: {% span red, 红色 %}、{% span yellow, 黄色 %}、{% span green, 绿色 %}、{% span cyan, 青色 %}、{% span blue, 蓝色 %}、{% span gray, 灰色 %}
3. 大小: small, h4, h3, h2, h1, large, huge, ultra
4. 对齐方向: left, center, right

<!-- endtab -->

<!-- tab 样式预览 -->
- 彩色文字
在一段话中方便插入各种颜色的标签，包括：{% p red, 红色 %}、{% p yellow, 黄色 %}、{% p green, 绿色 %}、{% p cyan, 青色 %}、{% p blue, 蓝色 %}、{% p gray, 灰色 %}。
- 超大号文字
文档「开始」页面中的标题部分就是超大号文字。
{% p center logo large, Volantis %}
{% p center small, A Wonderful Theme for Hexo %}
<!-- endtab -->

<!-- tab 示例源码 -->

```markdown
- 彩色文字
在一段话中方便插入各种颜色的标签，包括：{% p red, 红色 %}、{% p yellow, 黄色 %}、{% p green, 绿色 %}、{% p cyan, 青色 %}、{% p blue, 蓝色 %}、{% p gray, 灰色 %}。
- 超大号文字
文档「开始」页面中的标题部分就是超大号文字。
{% p center logo large, Volantis %}
{% p center small, A Wonderful Theme for Hexo %}
```
<!-- endtab -->
{% endtabs %}

# 引用 note

{% tabs note %}
<!-- tab 通用配置 -->

```markdown
note:
  # Note tag style values:
  #  - simple    bs-callout old alert style. Default.
  #  - modern    bs-callout new (v2-v3) alert style.
  #  - flat      flat callout style with background, like on Mozilla or StackOverflow.
  #  - disabled  disable all CSS styles import of note tag.
  style: simple
  icons: false
  border_radius: 3
  # Offset lighter of background in % for modern and flat styles (modern: -12 | 12; flat: -18 | 6).
  # Offset also applied to label tag variables. This option can work with disabled note tag.
  light_bg_offset: 0
```
<!-- endtab -->

<!-- tab 语法格式 -->

{% folding 方法一 %}

```markdown
{% note [class] [no-icon] [style] %}
Any content (support inline tags too.io).
{% endnote %}
```
{% endfolding %}

{% folding 方法二 %}

```markdown
{% note [color] [icon] [style] %}
Any content (support inline tags too.io).
{% endnote %}
```
{% endfolding %}

<!-- endtab -->

<!-- tab 配置参数 -->

{% folding 方法一 %}

参数|用法
---|---
class|【可选】标识，不同的标识有不同的配色（ default / primary / success / info / warning / danger ）
no-icon|【可选】不显示 icon
style|【可选】可以覆盖配置中的 style（simple/modern/flat/disabled）
{% endfolding %}
{% folding 方法二 %}
参数|用法
---|---
class|【可选】标识，不同的标识有不同的配色（ default / primary / success / info / warning / danger ）
no-icon|【可选】可配置自定义 icon (只支持 fontawesome 图标, 也可以配置 no-icon )
style|【可选】可以覆盖配置中的 style（simple/modern/flat/disabled）
{% endfolding %}
<!-- endtab -->

<!-- tab 样式预览 -->
{% folding 方法一 %}

1. `simple`样式

{% note simple %}默认 提示块标签{% endnote %}

{% note default simple %}default 提示块标签{% endnote %}

{% note primary simple %}primary 提示块标签{% endnote %}

{% note success simple %}success 提示块标签{% endnote %}

{% note info simple %}info 提示块标签{% endnote %}

{% note warning simple %}warning 提示块标签{% endnote %}

{% note danger simple %}danger 提示块标签{% endnote %} 

2. `modern`样式

{% note modern %}默认 提示块标签{% endnote %}

{% note default modern %}default 提示块标签{% endnote %}

{% note primary modern %}primary 提示块标签{% endnote %}

{% note success modern %}success 提示块标签{% endnote %}

{% note info modern %}info 提示块标签{% endnote %}

{% note warning modern %}warning 提示块标签{% endnote %}

{% note danger modern %}danger 提示块标签{% endnote %} 

3. `flat`样式

{% note flat %}默认 提示块标签{% endnote %}

{% note default flat %}default 提示块标签{% endnote %}

{% note primary flat %}primary 提示块标签{% endnote %}

{% note success flat %}success 提示块标签{% endnote %}

{% note info flat %}info 提示块标签{% endnote %}

{% note warning flat %}warning 提示块标签{% endnote %}

{% note danger flat %}danger 提示块标签{% endnote %} 

4. `disabled`样式

{% note disabled %}默认 提示块标签{% endnote %}

{% note default disabled %}default 提示块标签{% endnote %}

{% note primary disabled %}primary 提示块标签{% endnote %}

{% note success disabled %}success 提示块标签{% endnote %}

{% note info disabled %}info 提示块标签{% endnote %}

{% note warning disabled %}warning 提示块标签{% endnote %}

{% note danger disabled %}danger 提示块标签{% endnote %}

5. `no-icon`样式

{% note no-icon %}默认 提示块标签{% endnote %}

{% note default no-icon %}default 提示块标签{% endnote %}

{% note primary no-icon %}primary 提示块标签{% endnote %}

{% note success no-icon %}success 提示块标签{% endnote %}

{% note info no-icon %}info 提示块标签{% endnote %}

{% note warning no-icon %}warning 提示块标签{% endnote %}

{% note danger no-icon %}danger 提示块标签{% endnote %}

{% endfolding %}

{% folding 方法二 %}

1. `simple`样式

{% note 'fab fa-cc-visa' simple %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue 'fas fa-bullhorn' simple %}2021年快到了....{% endnote %}

{% note pink 'fas fa-car-crash' simple %}小心开车 安全至上{% endnote %}

{% note red 'fas fa-fan' simple%}这是三片呢？还是四片？{% endnote %}

{% note orange 'fas fa-battery-half' simple %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple 'far fa-hand-scissors' simple %}剪刀石头布{% endnote %}

{% note green 'fab fa-internet-explorer' simple %}前端最讨厌的浏览器{% endnote %} 

2. `modern`样式

{% note 'fab fa-cc-visa' modern %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue 'fas fa-bullhorn' modern %}2021年快到了....{% endnote %}

{% note pink 'fas fa-car-crash' modern %}小心开车 安全至上{% endnote %}

{% note red 'fas fa-fan' modern%}这是三片呢？还是四片？{% endnote %}

{% note orange 'fas fa-battery-half' modern %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple 'far fa-hand-scissors' modern %}剪刀石头布{% endnote %}

{% note green 'fab fa-internet-explorer' modern %}前端最讨厌的浏览器{% endnote %}

3. `flat`样式

{% note 'fab fa-cc-visa' flat %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue 'fas fa-bullhorn' flat %}2021年快到了....{% endnote %}

{% note pink 'fas fa-car-crash' flat %}小心开车 安全至上{% endnote %}

{% note red 'fas fa-fan' flat%}这是三片呢？还是四片？{% endnote %}

{% note orange 'fas fa-battery-half' flat %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple 'far fa-hand-scissors' flat %}剪刀石头布{% endnote %}

{% note green 'fab fa-internet-explorer' flat %}前端最讨厌的浏览器{% endnote %}

4. `disabled`样式

{% note 'fab fa-cc-visa' disabled %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue 'fas fa-bullhorn' disabled %}2021年快到了....{% endnote %}

{% note pink 'fas fa-car-crash' disabled %}小心开车 安全至上{% endnote %}

{% note red 'fas fa-fan' disabled %}这是三片呢？还是四片？{% endnote %}

{% note orange 'fas fa-battery-half' disabled %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple 'far fa-hand-scissors' disabled %}剪刀石头布{% endnote %}

{% note green 'fab fa-internet-explorer' disabled %}前端最讨厌的浏览器{% endnote %}

5. `no-icon`样式

{% note no-icon %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue no-icon %}2021年快到了....{% endnote %}

{% note pink no-icon %}小心开车 安全至上{% endnote %}

{% note red no-icon %}这是三片呢？还是四片？{% endnote %}

{% note orange no-icon %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple no-icon %}剪刀石头布{% endnote %}

{% note green no-icon %}前端最讨厌的浏览器{% endnote %}

{% endfolding %}
<!-- endtab -->

<!-- tab 示例源码 -->
{% folding 方法一 %}
1. simple样式

```markdown
{% note simple %}默认 提示块标签{% endnote %}

{% note default simple %}default 提示块标签{% endnote %}

{% note primary simple %}primary 提示块标签{% endnote %}

{% note success simple %}success 提示块标签{% endnote %}

{% note info simple %}info 提示块标签{% endnote %}

{% note warning simple %}warning 提示块标签{% endnote %}

{% note danger simple %}danger 提示块标签{% endnote %} 
```
2. modern样式

```markdown
{% note modern %}默认 提示块标签{% endnote %}

{% note default modern %}default 提示块标签{% endnote %}

{% note primary modern %}primary 提示块标签{% endnote %}

{% note success modern %}success 提示块标签{% endnote %}

{% note info modern %}info 提示块标签{% endnote %}

{% note warning modern %}warning 提示块标签{% endnote %}

{% note danger modern %}danger 提示块标签{% endnote %} 
```
3. flat样式

```markdown
{% note flat %}默认 提示块标签{% endnote %}

{% note default flat %}default 提示块标签{% endnote %}

{% note primary flat %}primary 提示块标签{% endnote %}

{% note success flat %}success 提示块标签{% endnote %}

{% note info flat %}info 提示块标签{% endnote %}

{% note warning flat %}warning 提示块标签{% endnote %}

{% note danger flat %}danger 提示块标签{% endnote %} 
```
4. disabled样式

```markdown
{% note disabled %}默认 提示块标签{% endnote %}

{% note default disabled %}default 提示块标签{% endnote %}

{% note primary disabled %}primary 提示块标签{% endnote %}

{% note success disabled %}success 提示块标签{% endnote %}

{% note info disabled %}info 提示块标签{% endnote %}

{% note warning disabled %}warning 提示块标签{% endnote %}

{% note danger disabled %}danger 提示块标签{% endnote %}
```
5. no-icon样式

```markdown
{% note no-icon %}默认 提示块标签{% endnote %}

{% note default no-icon %}default 提示块标签{% endnote %}

{% note primary no-icon %}primary 提示块标签{% endnote %}

{% note success no-icon %}success 提示块标签{% endnote %}

{% note info no-icon %}info 提示块标签{% endnote %}

{% note warning no-icon %}warning 提示块标签{% endnote %}

{% note danger no-icon %}danger 提示块标签{% endnote %}
```
{% endfolding %}

{% folding 方法二 %}
1. simple样式

```markdown
{% note 'fab fa-cc-visa' simple %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue 'fas fa-bullhorn' simple %}2021年快到了....{% endnote %}

{% note pink 'fas fa-car-crash' simple %}小心开车 安全至上{% endnote %}

{% note red 'fas fa-fan' simple%}这是三片呢？还是四片？{% endnote %}

{% note orange 'fas fa-battery-half' simple %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple 'far fa-hand-scissors' simple %}剪刀石头布{% endnote %}

{% note green 'fab fa-internet-explorer' simple %}前端最讨厌的浏览器{% endnote %} 
```
2. modern样式

```markdown
{% note 'fab fa-cc-visa' modern %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue 'fas fa-bullhorn' modern %}2021年快到了....{% endnote %}

{% note pink 'fas fa-car-crash' modern %}小心开车 安全至上{% endnote %}

{% note red 'fas fa-fan' modern%}这是三片呢？还是四片？{% endnote %}

{% note orange 'fas fa-battery-half' modern %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple 'far fa-hand-scissors' modern %}剪刀石头布{% endnote %}

{% note green 'fab fa-internet-explorer' modern %}前端最讨厌的浏览器{% endnote %}
```
3. flat样式

```markdown
{% note 'fab fa-cc-visa' flat %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue 'fas fa-bullhorn' flat %}2021年快到了....{% endnote %}

{% note pink 'fas fa-car-crash' flat %}小心开车 安全至上{% endnote %}

{% note red 'fas fa-fan' flat%}这是三片呢？还是四片？{% endnote %}

{% note orange 'fas fa-battery-half' flat %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple 'far fa-hand-scissors' flat %}剪刀石头布{% endnote %}

{% note green 'fab fa-internet-explorer' flat %}前端最讨厌的浏览器{% endnote %}
```
4. disabled样式

```markdown
{% note 'fab fa-cc-visa' disabled %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue 'fas fa-bullhorn' disabled %}2021年快到了....{% endnote %}

{% note pink 'fas fa-car-crash' disabled %}小心开车 安全至上{% endnote %}

{% note red 'fas fa-fan' disabled %}这是三片呢？还是四片？{% endnote %}

{% note orange 'fas fa-battery-half' disabled %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple 'far fa-hand-scissors' disabled %}剪刀石头布{% endnote %}

{% note green 'fab fa-internet-explorer' disabled %}前端最讨厌的浏览器{% endnote %}
```
5. no-icon样式

```markdown
{% note no-icon %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note blue no-icon %}2021年快到了....{% endnote %}

{% note pink no-icon %}小心开车 安全至上{% endnote %}

{% note red no-icon %}这是三片呢？还是四片？{% endnote %}

{% note orange no-icon %}你是刷 Visa 还是 UnionPay{% endnote %}

{% note purple no-icon %}剪刀石头布{% endnote %}

{% note green no-icon %}前端最讨厌的浏览器{% endnote %}
```
{% endfolding %}
<!-- endtab -->
{% endtabs %}

# 上标标签 tip

{% tabs 上标标签 %}
<!-- tab 标签语法 -->

```markdown
{% tip [参数，可选] %}文本内容{% endtip %}
```
<!-- endtab -->

<!-- tab 配置参数 -->

1. 样式: success,error,warning,bolt,ban,home,sync,cogs,key,bell
2. 自定义图标: 支持fontawesome

<!-- endtab -->

<!-- tab 样式预览 -->
{% tip %}默认情况{% endtip %}
{% tip success %}success{% endtip %}
{% tip error %}error{% endtip %}
{% tip warning %}warning{% endtip %}
{% tip bolt %}bolt{% endtip %}
{% tip ban %}ban{% endtip %}
{% tip home %}home{% endtip %}
{% tip sync %}sync{% endtip %}
{% tip cogs %}cogs{% endtip %}
{% tip key %}key{% endtip %}
{% tip bell %}bell{% endtip %}
{% tip fa-atom %}自定义font awesome图标{% endtip %}
<!-- endtab -->

<!-- tab 示例源码 -->

```markdown
{% tip %}默认情况{% endtip %}
{% tip success %}success{% endtip %}
{% tip error %}error{% endtip %}
{% tip warning %}warning{% endtip %}
{% tip bolt %}bolt{% endtip %}
{% tip ban %}ban{% endtip %}
{% tip home %}home{% endtip %}
{% tip sync %}sync{% endtip %}
{% tip cogs %}cogs{% endtip %}
{% tip key %}key{% endtip %}
{% tip bell %}bell{% endtip %}
{% tip fa-atom %}自定义font awesome图标{% endtip %}
```
<!-- endtab -->
{% endtabs %}

# 动态标签 anima

{% tabs 动态标签 %}
<!-- tab 标签语法 -->

```markdown
{% tip [参数，可选] %}文本内容{% endtip %}
```
<!-- endtab -->

<!-- tab 配置参数 -->
更多详情请参看[font-awesome-animation文档](http://l-lin.github.io/font-awesome-animation/)
1. 将所需的CSS类添加到图标（或DOM中的任何元素）。
2. 对于父级悬停样式，需要给目标元素添加指定CSS类，同时还要给目标元素的父级元素添加`CSS`类`faa-parent animated-hover`。（详情见示例及示例源码）You can regulate the speed of the animation by adding the CSS class or . faa-fastfaa-slow
3. 可以通过给目标元素添加`CSS`类`faa-fast`或`faa-slow`来控制动画快慢。
<!-- endtab -->

<!-- tab 样式预览 -->
1. On DOM load（当页面加载时显示动画）
{% tip warning faa-horizontal animated %}warning{% endtip %}
{% tip ban faa-flash animated %}ban{% endtip %}

2. 调整动画速度
{% tip warning faa-horizontal animated faa-fast %}warning{% endtip %}
{% tip ban faa-flash animated faa-slow %}ban{% endtip %}

3. On hover（当鼠标悬停时显示动画）
{% tip warning faa-horizontal animated-hover %}warning{% endtip %}
{% tip ban faa-flash animated-hover %}ban{% endtip %}

4. On parent hover（当鼠标悬停在父级元素时显示动画）
{% tip warning faa-parent animated-hover %}<p class="faa-horizontal">warning</p>{% endtip %}
{% tip ban faa-parent animated-hover %}<p class="faa-flash">ban</p>{% endtip %}

<!-- endtab -->

<!-- tab 示例源码 -->
1. On DOM load（当页面加载时显示动画）

```markdown
{% tip warning faa-horizontal animated %}warning{% endtip %}
{% tip ban faa-flash animated %}ban{% endtip %}
```
2. 调整动画速度

```markdown
{% tip warning faa-horizontal animated faa-fast %}warning{% endtip %}
{% tip ban faa-flash animated faa-slow %}ban{% endtip %}
```
3. On hover（当鼠标悬停时显示动画）

```markdown
{% tip warning faa-horizontal animated-hover %}warning{% endtip %}
{% tip ban faa-flash animated-hover %}ban{% endtip %}
```
4. On parent hover（当鼠标悬停在父级元素时显示动画）

```markdown
{% tip warning faa-parent animated-hover %}<p class="faa-horizontal">warning</p>{% endtip %}
{% tip ban faa-parent animated-hover %}<p class="faa-flash">ban</p>{% endtip %}
```
<!-- endtab -->
{% endtabs %}

# 复选列表 checkbox

{% tabs 复选列表 %}
<!-- tab 标签语法 -->

```markdown
{% checkbox 样式参数（可选）, 文本（支持简单md） %}
```
<!-- endtab -->

<!-- tab 配置参数 -->
1. 样式: plus, minus, times
2. 颜色:{% span red, red %},{% span yellow, yellow %},{% span green, green %},{% span cyan, cyan %},{% span blue, blue %},{% span gray, gray %}
3. 选中状态: checked
<!-- endtab -->

<!-- tab 样式预览 -->
{% checkbox 纯文本测试 %}
{% checkbox checked, 支持简单的 [markdown](https://guides.github.com/features/mastering-markdown/) 语法 %}
{% checkbox red, 支持自定义颜色 %}
{% checkbox green checked, 绿色 + 默认选中 %}
{% checkbox yellow checked, 黄色 + 默认选中 %}
{% checkbox cyan checked, 青色 + 默认选中 %}
{% checkbox blue checked, 蓝色 + 默认选中 %}
{% checkbox plus green checked, 增加 %}
{% checkbox minus yellow checked, 减少 %}
{% checkbox times red checked, 叉 %}

<!-- endtab -->

<!-- tab 示例源码 -->

```markdown
{% checkbox 纯文本测试 %}
{% checkbox checked, 支持简单的 [markdown](https://guides.github.com/features/mastering-markdown/) 语法 %}
{% checkbox red, 支持自定义颜色 %}
{% checkbox green checked, 绿色 + 默认选中 %}
{% checkbox yellow checked, 黄色 + 默认选中 %}
{% checkbox cyan checked, 青色 + 默认选中 %}
{% checkbox blue checked, 蓝色 + 默认选中 %}
{% checkbox plus green checked, 增加 %}
{% checkbox minus yellow checked, 减少 %}
{% checkbox times red checked, 叉 %}
```
<!-- endtab -->
{% endtabs %}

# 单选列表 radio

{% tabs 单选列表 %}
<!-- tab 标签语法 -->

```markdown
{% radio 样式参数（可选）, 文本（支持简单md） %}
```
<!-- endtab -->

<!-- tab 配置参数 -->
1. 颜色:{% span red, red %},{% span yellow, yellow %},{% span green, green %},{% span cyan, cyan %},{% span blue, blue %},{% span gray, gray %}
2. 选中状态: checked
<!-- endtab -->

<!-- tab 样式预览 -->
{% radio 纯文本测试 %}
{% radio checked, 支持简单的 [markdown](https://guides.github.com/features/mastering-markdown/) 语法 %}
{% radio red, 支持自定义颜色 %}
{% radio green, 绿色 %}
{% radio yellow, 黄色 %}
{% radio cyan, 青色 %}
{% radio blue, 蓝色 %}

<!-- endtab -->

<!-- tab 示例源码 -->

```markdown
{% radio 纯文本测试 %}
{% radio checked, 支持简单的 [markdown](https://guides.github.com/features/mastering-markdown/) 语法 %}
{% radio red, 支持自定义颜色 %}
{% radio green, 绿色 %}
{% radio yellow, 黄色 %}
{% radio cyan, 青色 %}
{% radio blue, 蓝色 %}
```
<!-- endtab -->
{% endtabs %}


# 时间轴 timeline

{% tabs 时间轴 %}
<!-- tab 标签语法 -->

```markdown
{% timeline title,color %}
<!-- timeline title -->
xxxxx
<!-- endtimeline -->
<!-- timeline title -->
xxxxx
<!-- endtimeline -->
{% endtimeline %}
```
<!-- endtab -->

<!-- tab 样式预览 -->
{% timeline 2022 %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}

{% timeline 2022,blue %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}

{% timeline 2022,pink %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}

{% timeline 2022,red %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}

{% timeline 2022,purple %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}

{% timeline 2022,orange %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}

{% timeline 2022,green %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}

<!-- endtab -->

<!-- tab 示例源码 -->

```markdown
{% timeline 2022 %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}

{% timeline 2022,blue %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}

{% timeline 2022,pink %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}

{% timeline 2022,red %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}

{% timeline 2022,purple %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}

{% timeline 2022,orange %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}

{% timeline 2022,green %}
<!-- timeline 01-02 -->
这是测试页面
<!-- endtimeline -->
{% endtimeline %}
```
<!-- endtab -->
{% endtabs %}

# 链接卡片 link

{% tabs 链接卡片 %}
<!-- tab 标签语法 -->

```markdown
{% link 标题, 链接, 图片链接（可选） %}
```
<!-- endtab -->

<!-- tab 样式预览 -->
{% link 索尼中国, https://app966.cn , https://s2.loli.net/2022/07/14/jMY1OAfinEqyxSB.png %}
<!-- endtab -->

<!-- tab 示例源码 -->

```markdown
{% link 索尼中国, https://www.douyin.com/user/MS4wLjABAAAA67f0nhhRAUosOYwptIDkpNHlU0Zo2-EimRxWxH77a64 , https://s2.loli.net/2022/07/14/jMY1OAfinEqyxSB.png %}
```
<!-- endtab -->
{% endtabs %}

# github卡片

{% tabs github卡片 %}
<!-- tab 标签语法 -->

```markdown
{% ghcard 用户名, 其它参数（可选） %}
{% ghcard 用户名/仓库, 其它参数（可选） %}
```
<!-- endtab -->

<!-- tab 配置参数 -->
{% ghcard anuraghazra/github-readme-stats %}

使用","分割各个参数，写法为：`参数名=参数值`
以下只写几个常用参数值。

参数名|取值|释义
---|---|---
hide|stars,commits,prs,issues,contribs|隐藏指定统计
count_private|true|将私人项目贡献添加到总提交计数中
show_icons|true|显示图标
theme|请查阅Available Themes|主题

<!-- endtab -->

<!-- tab 样式预览 -->
1. 用户信息卡片

| {% ghcard xaoxuu %}                | {% ghcard xaoxuu, theme=vue %}             |
| ---------------------------------- | ------------------------------------------ |
| {% ghcard xaoxuu, theme=buefy %}   | {% ghcard xaoxuu, theme=solarized-light %} |
| {% ghcard xaoxuu, theme=onedark %} | {% ghcard xaoxuu, theme=solarized-dark %}  |
| {% ghcard xaoxuu, theme=algolia %} | {% ghcard xaoxuu, theme=calm %}            |

2. 仓库信息卡片

| {% ghcard xaoxuu %}                | {% ghcard xaoxuu, theme=vue %}             |
| ---------------------------------- | ------------------------------------------ |
| {% ghcard xaoxuu, theme=buefy %}   | {% ghcard xaoxuu, theme=solarized-light %} |
| {% ghcard xaoxuu, theme=onedark %} | {% ghcard xaoxuu, theme=solarized-dark %}  |
| {% ghcard xaoxuu, theme=algolia %} | {% ghcard xaoxuu, theme=calm %}            |

<!-- endtab -->

<!-- tab 示例源码 -->

1. 用户信息卡片

```markdown
| {% ghcard xaoxuu %}                | {% ghcard xaoxuu, theme=vue %}             |
| ---------------------------------- | ------------------------------------------ |
| {% ghcard xaoxuu, theme=buefy %}   | {% ghcard xaoxuu, theme=solarized-light %} |
| {% ghcard xaoxuu, theme=onedark %} | {% ghcard xaoxuu, theme=solarized-dark %}  |
| {% ghcard xaoxuu, theme=algolia %} | {% ghcard xaoxuu, theme=calm %}            |
```

2. 仓库信息卡片

```markdown
| {% ghcard volantis-x/hexo-theme-volantis %}                | {% ghcard volantis-x/hexo-theme-volantis, theme=vue %}             |
| ---------------------------------------------------------- | ------------------------------------------------------------------ |
| {% ghcard volantis-x/hexo-theme-volantis, theme=buefy %}   | {% ghcard volantis-x/hexo-theme-volantis, theme=solarized-light %} |
| {% ghcard volantis-x/hexo-theme-volantis, theme=onedark %} | {% ghcard volantis-x/hexo-theme-volantis, theme=solarized-dark %}  |
| {% ghcard volantis-x/hexo-theme-volantis, theme=algolia %} | {% ghcard volantis-x/hexo-theme-volantis, theme=calm %}            |
```
<!-- endtab -->
{% endtabs %}

# github徽标

{% tabs github徽标 %}
<!-- tab 标签语法 -->

```markdown
{% bdage [right],[left],[logo]||[color],[link],[title]||[option] %}
```
<!-- endtab -->

<!-- tab 配置参数 -->
1. left：徽标左边的信息，必选参数。
2. right: 徽标右边的信息，必选参数，
3. logo：徽标图标，图标名称详见[simpleicons](https://simpleicons.org/)，可选参数。
4. color：徽标右边的颜色，可选参数。
5. link：指向的链接，可选参数。
6. title：徽标的额外信息，可选参数。主要用于优化 SEO，但 object 标签不会像 a 标签一样在鼠标悬停显示 title 信息。
7. option：自定义参数，支持[shields.io](https://shields.io/)的全部API参数支持，具体参数可以参看上文中的拓展写法示例。形式为 name1=value2&name2=value2。

<!-- endtab -->

<!-- tab 样式预览 -->
1. 基本参数,定义徽标左右文字和图标
{% bdage Theme,Butterfly %}
{% bdage Frame,Hexo,hexo %}

2. 信息参数，定义徽标右侧内容背景色，指向链接
{% bdage CDN,JsDelivr,jsDelivr||abcdef,https://metroui.org.ua/index.html,本站使用JsDelivr为静态资源提供CDN加速 %}
//如果是跨顺序省略可选参数，仍然需要写个逗号,用作分割
{% bdage Source,GitHub,GitHub||,https://github.com/ %}

3. 拓展参数，支持shields的API的全部参数内容
{% bdage Hosted,Vercel,Vercel||brightgreen,https://vercel.com/,本站采用双线部署，默认线路托管于Vercel||style=social&logoWidth=20 %}
//如果是跨顺序省略可选参数组，仍然需要写双竖线||用作分割
{% bdage Hosted,Vercel,Vercel||||style=social&logoWidth=20&logoColor=violet %}

<!-- endtab -->

<!-- tab 示例源码 -->

1. 基本参数,定义徽标左右文字和图标

```markdown
{% bdage Theme,Butterfly %}
{% bdage Frame,Hexo,hexo %}
```

2. 信息参数，定义徽标右侧内容背景色，指向链接

```markdown
{% bdage CDN,JsDelivr,jsDelivr||abcdef,https://metroui.org.ua/index.html,本站使用JsDelivr为静态资源提供CDN加速 %}
//如果是跨顺序省略可选参数，仍然需要写个逗号,用作分割
{% bdage Source,GitHub,GitHub||,https://github.com/ %}
```

3. 拓展参数，支持shields的API的全部参数内容

```markdown
{% bdage Hosted,Vercel,Vercel||brightgreen,https://vercel.com/,本站采用双线部署，默认线路托管于Vercel||style=social&logoWidth=20 %}
//如果是跨顺序省略可选参数组，仍然需要写双竖线||用作分割
{% bdage Hosted,Vercel,Vercel||||style=social&logoWidth=20&logoColor=violet %}
```
<!-- endtab -->
{% endtabs %}

# 网站卡片 sites

{% tabs 网站卡片 %}
<!-- tab 标签语法 -->

```markdown
{% sitegroup %}
{% site 标题, url=链接, screenshot=截图链接, avatar=头像链接（可选）, description=描述（可选） %}
{% site 标题, url=链接, screenshot=截图链接, avatar=头像链接（可选）, description=描述（可选） %}
{% endsitegroup %}
```
<!-- endtab -->

<!-- tab 样式预览 -->
{% sitegroup %}
{% site xaoxuu, url=https://xaoxuu.com, screenshot=https://i.loli.net/2020/08/21/VuSwWZ1xAeUHEBC.jpg, avatar=https://bu.dusays.com/2022/05/02/626f92e193879.jpg, description=简约风格 %}
{% site inkss, url=https://inkss.cn, screenshot=https://i.loli.net/2020/08/21/Vzbu3i8fXs6Nh5Y.jpg, avatar=https://inkss.cn/img/avatar.jpg, description=这是一段关于这个网站的描述文字 %}
{% site MHuiG, url=https://blog.mhuig.top, screenshot=https://i.loli.net/2020/08/22/d24zpPlhLYWX6D1.png, avatar=https://static.mhuig.top/npm/mhg@0.0.0/avatar/avatar.png, description=这是一段关于这个网站的描述文字 %}
{% site Colsrch, url=https://colsrch.top, screenshot=https://i.loli.net/2020/08/22/dFRWXm52OVu8qfK.png, avatar=https://avatars.githubusercontent.com/u/58458181?v=4, description=这是一段关于这个网站的描述文字 %}
{% site Linhk1606, url=https://linhk1606.github.io, screenshot=https://i.loli.net/2020/08/21/3PmGLCKicnfow1x.png, avatar=https://i.loli.net/2020/02/09/PN7I5RJfFtA93r2.png, description=这是一段关于这个网站的描述文字 %}
{% endsitegroup %}

<!-- endtab -->

<!-- tab 示例源码 -->

```markdown
{% sitegroup %}
{% site xaoxuu, url=https://xaoxuu.com, screenshot=https://i.loli.net/2020/08/21/VuSwWZ1xAeUHEBC.jpg, avatar=https://bu.dusays.com/2022/05/02/626f92e193879.jpg, description=简约风格 %}
{% site inkss, url=https://inkss.cn, screenshot=https://i.loli.net/2020/08/21/Vzbu3i8fXs6Nh5Y.jpg, avatar=https://inkss.cn/img/avatar.jpg, description=这是一段关于这个网站的描述文字 %}
{% site MHuiG, url=https://blog.mhuig.top, screenshot=https://i.loli.net/2020/08/22/d24zpPlhLYWX6D1.png, avatar=https://static.mhuig.top/npm/mhg@0.0.0/avatar/avatar.png, description=这是一段关于这个网站的描述文字 %}
{% site Colsrch, url=https://colsrch.top, screenshot=https://i.loli.net/2020/08/22/dFRWXm52OVu8qfK.png, avatar=https://avatars.githubusercontent.com/u/58458181?v=4, description=这是一段关于这个网站的描述文字 %}
{% site Linhk1606, url=https://linhk1606.github.io, screenshot=https://i.loli.net/2020/08/21/3PmGLCKicnfow1x.png, avatar=https://i.loli.net/2020/02/09/PN7I5RJfFtA93r2.png, description=这是一段关于这个网站的描述文字 %}
{% endsitegroup %}
```
<!-- endtab -->
{% endtabs %}

# 行内图片 inlineimage

{% tabs 行内图片 %}
<!-- tab 标签语法 -->

```markdown
{% inlineimage 图片链接, height=高度（可选） %}
```
<!-- endtab -->

<!-- tab 配置参数 -->
1. 高度：height=20px
<!-- endtab -->

<!-- tab 样式预览 -->
这是 {% inlineimage https://bu.dusays.com/2022/05/19/628532706842d.gif %} 一段话。

这又是 {% inlineimage https://bu.dusays.com/2022/05/19/6285328a83ca7.gif, height=40px %} 一段话。

<!-- endtab -->

<!-- tab 示例源码 -->

```markdown
这是 {% inlineimage https://bu.dusays.com/2022/05/19/628532706842d.gif %} 一段话。

这又是 {% inlineimage https://bu.dusays.com/2022/05/19/6285328a83ca7.gif, height=40px %} 一段话。
```
<!-- endtab -->
{% endtabs %}

# 单张图片 image

{% tabs 单张图片 %}
<!-- tab 标签语法 -->

```markdown
{% image 链接, width=宽度（可选）, height=高度（可选）, alt=描述（可选）, bg=占位颜色（可选） %}
```
<!-- endtab -->

<!-- tab 配置参数 -->
1. 图片宽度高度：width=300px, height=32px
2. 图片描述：alt=图片描述（butterfly需要在主题配置文件中开启图片描述）
3. 占位背景色：bg=#f2f2f2
<!-- endtab -->

<!-- tab 样式预览 -->
1. 添加描述
{% image https://bu.dusays.com/2022/05/19/6285306c996c4.jpg, alt=愿你成为自己的太阳，无需凭借谁的光芒。 %}
2. 指定宽度
{% image https://bu.dusays.com/2022/05/19/6285306c996c4.jpg, width=400px %}
3. 指定宽度并添加描述
{% image https://bu.dusays.com/2022/05/19/6285306c996c4.jpg, width=400px, alt=愿你成为自己的太阳，无需凭借谁的光芒。 %}
4. 设置占位背景色
{% image https://bu.dusays.com/2022/05/19/6285306c996c4.jpg, width=400px, bg=#1D0C04, alt=优化不同宽度浏览的观感 %}
<!-- endtab -->

<!-- tab 示例源码 -->
1. 添加描述

```markdown
{% image https://bu.dusays.com/2022/05/19/6285306c996c4.jpg, alt=愿你成为自己的太阳，无需凭借谁的光芒。 %}
```
2. 指定宽度

```markdown
{% image https://bu.dusays.com/2022/05/19/6285306c996c4.jpg, width=400px %}
```
3. 指定宽度并添加描述

```markdown
{% image https://bu.dusays.com/2022/05/19/6285306c996c4.jpg, width=400px, alt=愿你成为自己的太阳，无需凭借谁的光芒。 %}
```
4. 设置占位背景色

```markdown
{% image https://bu.dusays.com/2022/05/19/6285306c996c4.jpg, width=400px, bg=#1D0C04, alt=优化不同宽度浏览的观感 %}
```
<!-- endtab -->
{% endtabs %}

# 音频 audio

{% tabs 音频 %}
<!-- tab 标签语法 -->

```markdown
{% audio 音频链接 %}
```
<!-- endtab -->

<!-- tab 样式预览 -->
{% audio https://qcloud.app966.cn/music/%E6%9C%80%E4%BC%9F%E5%A4%A7%E7%9A%84%E4%BD%9C%E5%93%81.mp3 %}
<!-- endtab -->

<!-- tab 示例源码 -->

```markdown
{% audio https://qcloud.app966.cn/music/最伟大的作品.mp3 %}
```
<!-- endtab -->
{% endtabs %}

# 视频 video

{% tabs video %}
<!-- tab 标签语法 -->

```markdown
{% video 视频链接 %}
```
<!-- endtab -->

<!-- tab 配置参数 -->
1. 对其方向：left, center, right
2. 列数：逗号后面直接写列数，支持 1 ～ 4 列。
<!-- endtab -->

<!-- tab 样式预览 -->
1. 100%宽度
{% video /vid/dy_2.mp4 %}
2. 50%宽度
{% videos, 2 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% endvideos %}
3. 25%宽度
{% videos, 4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% endvideos %}
<!-- endtab -->

<!-- tab 示例源码 -->
1. 100%宽度

```markdown
{% video /vid/dy_2.mp4 %}
```
2. 50%宽度

```markdown
{% videos, 2 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% endvideos %}
```
3. 25%宽度

```markdown
{% videos, 4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% video /vid/dy_2.mp4 %}
{% endvideos %}
```
<!-- endtab -->
{% endtabs %}

# 相册 gallery
{% note blue 'fas fa-bullhorn' modern %}Butterfly自带gallery相册，而且会根据图片大小自动调整排版，效果比Volantis的gallery更好，故不再收录Volantis的gallery标签。{% endnote %}
{% note 'fas fa-bullhorn' modern %}以下为Butterfly自带的gallery标签写法。相册图库和相册配合使用。{% endnote %}

{% tabs 相册 %}
<!-- tab 标签语法 -->
1. gallerygroup 相册图库

```markdown
<div class="gallery-group-main">
{% galleryGroup name description link img-url %}
{% galleryGroup name description link img-url %}
{% galleryGroup name description link img-url %}
</div>
```
2. gallery 相册

```markdown
{% gallery %}
markdown 图片格式
{% endgallery %}
```
<!-- endtab -->

<!-- tab 配置参数 -->
- gallerygroup 相册图库

参数名|释义
---|---
name|图库名称
description|图库描述
link|链接到对应相册的地址
img-url|图库封面

- gallery 相册区别于旧版的Gallery相册,新的Gallery相册会自动根据图片长度进行排版，书写也更加方便，与markdown格式一样。可根据需要插入到相应的md。无需再自己配置长宽。建议在粘贴时故意使用长短、大小、横竖不一的图片，会有更好的效果。（尺寸完全相同的图片只会平铺输出，效果很糟糕）
<!-- endtab -->

<!-- tab 样式预览 -->
1. gallerygroup 相册图库

<div class="gallery-group-main">
{% galleryGroup '美女' '美女壁纸' '/picture/wallpaper/' /pic/皮草吊带美女51.jpg %}
{% galleryGroup '其它' '其它壁纸' '/picture/wallpaper2/' /pic/123244uA7An.jpg %}
{% galleryGroup '头像' '头像图片' '/picture/avatar/' /pic/优等生[7].jpg %}
</div>
2. gallery 相册

{% gallery %}
![](https://i.loli.net/2019/12/25/Fze9jchtnyJXMHN.jpg)
![](https://i.loli.net/2019/12/25/ryLVePaqkYm4TEK.jpg)
![](https://i.loli.net/2019/12/25/gEy5Zc1Ai6VuO4N.jpg)
![](https://i.loli.net/2019/12/25/d6QHbytlSYO4FBG.jpg)
![](https://i.loli.net/2019/12/25/6nepIJ1xTgufatZ.jpg)
![](https://i.loli.net/2019/12/25/E7Jvr4eIPwUNmzq.jpg)
![](https://i.loli.net/2019/12/25/mh19anwBSWIkGlH.jpg)
![](https://i.loli.net/2019/12/25/2tu9JC8ewpBFagv.jpg)
{% endgallery %}

<!-- endtab -->

<!-- tab 示例源码 -->
{% note blue 'fas fa-bullhorn' modern %}使用相册图库的话，可以在导航栏加一个gallery的page(使用指令hexo new page gallery添加)，里面放相册图库作为封面。然后在[Blogroot]/source/gallery/下面建立相应的文件夹，例如若按照这里的示例，若欲使用/gallery/DM1/路径访问MC相册，则需要新建[Blogroot]/source/gallery/MC/index.md，并在里面填入gallery相册内容。{% endnote %}
1. gallerygroup 相册图库

```markdown
<div class="gallery-group-main">
{% galleryGroup '美女' '美女壁纸' '/picture/wallpaper/' /pic/皮草吊带美女51.jpg %}
{% galleryGroup '其它' '其它壁纸' '/picture/wallpaper2/' /pic/123244uA7An.jpg %}
{% galleryGroup '头像' '头像图片' '/picture/avatar/' /pic/优等生[7].jpg %}
</div>
```
2. gallery 相册

```markdown
{% gallery %}
![](https://i.loli.net/2019/12/25/Fze9jchtnyJXMHN.jpg)
![](https://i.loli.net/2019/12/25/ryLVePaqkYm4TEK.jpg)
![](https://i.loli.net/2019/12/25/gEy5Zc1Ai6VuO4N.jpg)
![](https://i.loli.net/2019/12/25/d6QHbytlSYO4FBG.jpg)
![](https://i.loli.net/2019/12/25/6nepIJ1xTgufatZ.jpg)
![](https://i.loli.net/2019/12/25/E7Jvr4eIPwUNmzq.jpg)
![](https://i.loli.net/2019/12/25/mh19anwBSWIkGlH.jpg)
![](https://i.loli.net/2019/12/25/2tu9JC8ewpBFagv.jpg)
{% endgallery %}
```
<!-- endtab -->
{% endtabs %}

# 折叠框 folding

{% tabs 折叠框 %}
<!-- tab 标签语法 -->

```markdown
{% folding 参数（可选）, 标题 %}
![](https://bu.dusays.com/2022/05/19/628533399e7a1.jpg)
{% endfolding %}
```
<!-- endtab -->

<!-- tab 配置参数 -->
1. 颜色：blue, cyan, green, yellow, red
2. 状态：状态填写 open 代表默认打开。
<!-- endtab -->

<!-- tab 样式预览 -->
{% folding 查看图片测试 %}

![](https://bu.dusays.com/2022/05/19/628533399e7a1.jpg)

{% endfolding %}

{% folding cyan open, 查看默认打开的折叠框 %}

这是一个默认打开的折叠框。

{% endfolding %}

{% folding green, 查看代码测试 %}
假装这里有代码块（代码块没法嵌套代码块）
{% endfolding %}

{% folding yellow, 查看列表测试 %}

- haha
- hehe

{% endfolding %}

{% folding red, 查看嵌套测试 %}

{% folding blue, 查看嵌套测试2 %}

{% folding 查看嵌套测试3 %}

hahaha <span><img src='https://bu.dusays.com/2022/05/19/62853244cef33.png' style='height:24px'></span>

{% endfolding %}

{% endfolding %}

{% endfolding %}
<!-- endtab -->

<!-- tab 示例源码 -->

```markdown
{% folding 查看图片测试 %}

![](https://bu.dusays.com/2022/05/19/628533399e7a1.jpg)

{% endfolding %}

{% folding cyan open, 查看默认打开的折叠框 %}

这是一个默认打开的折叠框。

{% endfolding %}

{% folding green, 查看代码测试 %}
假装这里有代码块（代码块没法嵌套代码块）
{% endfolding %}

{% folding yellow, 查看列表测试 %}

- haha
- hehe

{% endfolding %}

{% folding red, 查看嵌套测试 %}

{% folding blue, 查看嵌套测试2 %}

{% folding 查看嵌套测试3 %}

hahaha <span><img src='https://bu.dusays.com/2022/05/19/62853244cef33.png' style='height:24px'></span>

{% endfolding %}

{% endfolding %}

{% endfolding %}
```
<!-- endtab -->
{% endtabs %}

# 分栏 tab

{% tabs 分栏 %}
<!-- tab 标签语法 -->

```markdown
{% tabs Unique name, [index] %}
<!-- tab [Tab caption] [@icon] -->
Any content (support inline tags too).
<!-- endtab -->
{% endtabs %}
```
<!-- endtab -->

<!-- tab 配置参数 -->
1. Unique name
- 选项卡块标签的唯一名称，不带逗号。
- 将在#id中用作每个标签及其索引号的前缀。
- 如果名称中包含空格，则对于生成#id，所有空格将由破折号代替。
- 仅当前帖子/页面的URL必须是唯一的

2. [index]
- 活动选项卡的索引号。
- 如果未指定，将选择第一个标签（1）。
- 如果index为-1，则不会选择任何选项卡。
- 可选参数。

3. [Tab caption]
- 当前选项卡的标题。
- 如果未指定标题，则带有制表符索引后缀的唯一名称将用作制表符的标题。
- 如果未指定标题，但指定了图标，则标题将为空。
- 可选参数。

4. [@icon]
- FontAwesome图标名称（全名，看起来像“ fas fa-font”）
- 可以指定带空格或不带空格
- 例如’Tab caption @icon’ 和 ‘Tab caption@icon’.
- 可选参数。



<!-- endtab -->

<!-- tab 样式预览 -->
{% note primary flat %}Demo 1 - 预设选择第一个【默认】{% endnote %}
{% tabs test1 %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->

<!-- tab -->
**This is Tab 2.**
<!-- endtab -->

<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}

{% note primary flat %}Demo 2 - 预设选择tabs{% endnote %}
{% tabs test2, 3 %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->

<!-- tab -->
**This is Tab 2.**
<!-- endtab -->

<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}

{% note primary flat %}Demo 3 - 没有预设值{% endnote %}
{% tabs test3, -1 %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->

<!-- tab -->
**This is Tab 2.**
<!-- endtab -->

<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}

{% note primary flat %}Demo 4 - 自定义Tab名 + 只有icon + icon和Tab名{% endnote %}
{% tabs test4 %}
<!-- tab 第一个Tab -->
**tab名字为第一个Tab**
<!-- endtab -->

<!-- tab @fab fa-apple-pay -->
**只有图标 没有Tab名字**
<!-- endtab -->

<!-- tab 炸弹@fas fa-bomb -->
**名字+icon**
<!-- endtab -->
{% endtabs %}
<!-- endtab -->

<!-- tab 示例源码 -->
{% note primary flat %}Demo 1 - 预设选择第一个【默认】{% endnote %}

```markdown
{% tabs test1 %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->

<!-- tab -->
**This is Tab 2.**
<!-- endtab -->

<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}
```
{% note primary flat %}Demo 2 - 预设选择tabs{% endnote %}

```markdown
{% tabs test2, 3 %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->

<!-- tab -->
**This is Tab 2.**
<!-- endtab -->

<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}
```
{% note primary flat %}Demo 3 - 没有预设值{% endnote %}

```markdown
{% tabs test3, -1 %}
<!-- tab -->
**This is Tab 1.**
<!-- endtab -->

<!-- tab -->
**This is Tab 2.**
<!-- endtab -->

<!-- tab -->
**This is Tab 3.**
<!-- endtab -->
{% endtabs %}
```
{% note primary flat %}Demo 4 - 自定义Tab名 + 只有icon + icon和Tab名{% endnote %}

```markdown
{% tabs test4 %}
<!-- tab 第一个Tab -->
**tab名字为第一个Tab**
<!-- endtab -->

<!-- tab @fab fa-apple-pay -->
**只有图标 没有Tab名字**
<!-- endtab -->

<!-- tab 炸弹@fas fa-bomb -->
**名字+icon**
<!-- endtab -->
{% endtabs %}
```
<!-- endtab -->
{% endtabs %}

# 友链 flink

{% tabs 友链 %}
<!-- tab 标签语法 -->

```markdown
{% flink %}
- class_name: 友情链接
  class_desc: 那些人，那些事
  link_list:
    - name: JerryC
      link: https://jerryc.me/
      avatar: https://jerryc.me/img/avatar.png
      descr: 今日事,今日毕
{% endflink %}
```
<!-- endtab -->

<!-- tab 样式预览 -->
{% flink %}
- class_name: 友情链接
  class_desc: 那些人，那些事
  link_list:
    - name: JerryC
      link: https://jerryc.me/
      avatar: https://jerryc.me/img/avatar.png
      descr: 今日事,今日毕
    - name: Hexo
      link: https://hexo.io/zh-tw/
      avatar: https://d33wubrfki0l68.cloudfront.net/6657ba50e702d84afb32fe846bed54fba1a77add/827ae/logo.svg
      descr: 快速、简单且强大的网誌框架

- class_name: 网站
  class_desc: 值得推荐的网站
  link_list:
    - name: Youtube
      link: https://www.youtube.com/
      avatar: https://i.loli.net/2020/05/14/9ZkGg8v3azHJfM1.png
      descr: 视频网站
    - name: Weibo
      link: https://www.weibo.com/
      avatar: https://i.loli.net/2020/05/14/TLJBum386vcnI1P.png
      descr: 中国最大社交分享平臺
    - name: Twitter
      link: https://twitter.com/
      avatar: https://i.loli.net/2020/05/14/5VyHPQqR6LWF39a.png
      descr: 社交分享平臺
{% endflink %}
<!-- endtab -->

<!-- tab 示例源码 -->

```markdown
{% flink %}
- class_name: 友情链接
  class_desc: 那些人，那些事
  link_list:
    - name: JerryC
      link: https://jerryc.me/
      avatar: https://jerryc.me/img/avatar.png
      descr: 今日事,今日毕
    - name: Hexo
      link: https://hexo.io/zh-tw/
      avatar: https://d33wubrfki0l68.cloudfront.net/6657ba50e702d84afb32fe846bed54fba1a77add/827ae/logo.svg
      descr: 快速、简单且强大的网誌框架

- class_name: 网站
  class_desc: 值得推荐的网站
  link_list:
    - name: Youtube
      link: https://www.youtube.com/
      avatar: https://i.loli.net/2020/05/14/9ZkGg8v3azHJfM1.png
      descr: 视频网站
    - name: Weibo
      link: https://www.weibo.com/
      avatar: https://i.loli.net/2020/05/14/TLJBum386vcnI1P.png
      descr: 中国最大社交分享平臺
    - name: Twitter
      link: https://twitter.com/
      avatar: https://i.loli.net/2020/05/14/5VyHPQqR6LWF39a.png
      descr: 社交分享平臺
{% endflink %}
```
<!-- endtab -->
{% endtabs %}

# 特效标签 wow

{% tabs 特效标签 %}
<!-- tab 标签语法 -->

```markdown
{% wow [animete],[duration],[delay],[offset],[iteration] %}
```
<!-- endtab -->

<!-- tab 配置参数 -->
1. animate: 动画样式，效果详见[animate.css](https://animate.style/)参考文档。
2. duration: 选填项，动画持续时间，单位可以是ms也可以是s。例如3s，700ms。
3. delay: 选填项，动画开始的延迟时间，单位可以是ms也可以是s。例如3s，700ms。
4. offset: 选填项，开始动画的距离（相对浏览器底部）。
5. iteration: 选填项，动画重复的次数。
<!-- endtab -->

<!-- tab 样式预览 -->
1. `flip`动画效果。

{% wow animate__flip %}
{% note green 'fas fa-fan' modern%}
flip动画效果。
{% endnote %}
{% endwow %}

2. `zoomIn`动画效果，持续5s，延时5s，离底部100距离时启动，重复10次。

{% wow animate__zoomIn,5s,5s,100,10 %}
{% note blue 'fas fa-bullhorn' modern%}
zoomIn动画效果，持续5s，延时5s，离底部100距离时启动，重复10次
{% endnote %}
{% endwow %}

3. `slideInRight`动画效果，持续5s，延时5s。

{% wow animate__slideInRight,5s,5s %}
{% note orange 'fas fa-car' modern%}
slideInRight动画效果，持续5s，延时5s。
{% endnote %}
{% endwow %}

4. `heartBeat`动画效果，延时5s，重复10次。

{% wow animate__heartBeat,,5s,,10 %}
{% note red 'fas fa-battery-half' modern%}
heartBeat动画效果，延时5s，重复10次。
{% endnote %}
{% endwow %}
<!-- endtab -->

<!-- tab 示例源码 -->

1. `flip`动画效果。

```markdown
{% wow animate__flip %}
{% note green 'fas fa-fan' modern%}
flip动画效果。
{% endnote %}
{% endwow %}
```
2. `zoomIn`动画效果，持续5s，延时5s，离底部100距离时启动，重复10次。

```markdown
{% wow animate__zoomIn,5s,5s,100,10 %}
{% note blue 'fas fa-bullhorn' modern%}
zoomIn动画效果，持续5s，延时5s，离底部100距离时启动，重复10次
{% endnote %}
{% endwow %}
```
3. `slideInRight`动画效果，持续5s，延时5s。

```markdown
{% wow animate__slideInRight,5s,5s %}
{% note orange 'fas fa-car' modern%}
slideInRight动画效果，持续5s，延时5s。
{% endnote %}
{% endwow %}
```
4. `heartBeat`动画效果，延时5s，重复10次。

```markdown
{% wow animate__heartBeat,,5s,,10 %}
{% note red 'fas fa-battery-half' modern%}
heartBeat动画效果，延时5s，重复10次。
{% endnote %}
{% endwow %}
```
<!-- endtab -->
{% endtabs %}