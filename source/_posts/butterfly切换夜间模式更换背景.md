---
title: butterfly切换夜间模式更换背景
tags:
  - Butterfly
  - 教程
categories:
  - Butterfly
keywords: butterfly主题切换夜间模式更换背景
cover: 'https://qcloud.app966.cn/img/cover/clouds-g9c2046d48_640.png'
abbrlink: 26fa8bad
date: 2022-12-01 12:14:30
---

# 前言
1. 非常简单只需自定义css即可
2. 本博客使用的是`butterfly4.2.2`版本

# 过程
1. 在`/themes/butterfly/_config.yml`文件中设置一个默认背景
2. 这里等于是白色背景，因为要设置黑夜背景切换默认背景图片如果不改成`url('')`后面设置的图片将不成功，具体原因没有研究
```yml
background: url('')
```
3. 在`/themes/butterfly/source/css/app966.css`文件中自定义css文件
```css
/* 这里是设置一个全局透明度，不然不太协调，可以根据自己的喜好修改 */
:root {
    --card-bg: rgba(255, 255, 255, 0.3);
}

[data-theme='dark'] #web_bg {
  background: url('https://qcloud.app966.cn/img/wallpaper/pc/background.jpg');
  background-size: cover;
}

/* 适配手机模式 */

@media (max-width: 768px) {
[data-theme='dark'] #web_bg {
    background: url('https://qcloud.app966.cn/img/wallpaper/mobile/background_phone.jpg');
    background-size: cover;
  }
}

```
4. css中的图片链接可以修改成你们自己的哈，也可以在[我的相册](/picture/)下载电脑和手机版的图片
5. 最后要在头部引入你自定义的css，在`/themes/butterfly/_config.yml`文件中添加如下代码
```yml
inject:
  head:
    - <link rel="stylesheet" href="/css/app966.css">
```
# 结尾
- 到这里就结束啦，非常的简单非常的好看