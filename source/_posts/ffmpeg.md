---
title: ffmpeg学习笔记
tags: ffmpeg
categories: ffmpeg
keywords: ffmpeg笔记
cover: /temp/img/Maite_Opinel-scaled.jpg
abbrlink: 6025c827
date: 2022-06-27 21:10:49
---

# 前言

**官网地址：**[进入官网](https://ffmpeg.org/)

**github地址：**[github](https://github.com/FFmpeg/FFmpeg)


```
因为最近做的配音软件就有了要处理音视频的需求，
于是开始学习下这方面的内容就了解到了ffmpeg这个东西，
这个东西是什么呢看看github的介绍：FFmpeg 是一个库和工具的集合，用于处理音频、视频、字幕和相关元数据等多媒体内容。
理论知识不用看，简单来说就是处理音视频的，比如从视频里提取音频、视频里添加音频、转换视频格式、图片转视频、视频剪辑等。
```

# ffmpeg的下载

1. [进入官网下载页](https://ffmpeg.org/download.html)

2. 使用git命令
```
git clone https://git.ffmpeg.org/ffmpeg.git ffmpeg
```
3. 添加环境变量，也可以不加，在`ffmpeg\bin`目录下操作
4. 测试是否安装成功，打开cmd，输入`ffmpeg –version`出现下图内容就成功了
![成功示例](/img/ffmpeg_1.png)

# ffmpeg常用命令

- `ffmpeg`是一个命令行工具箱，用于操作、转换和流式传输多媒体内容。
- `ffplay`是一个简约的多媒体播放器。
- `ffprobe`是一个简单的分析工具来检查多媒体内容。

## 往视频里添加音频

```
ffmpeg -i 视频路径 -i 音频路径 -c copy 保存路径
```
## 剪辑视频
* -i 表示源视频文件
* -y 表示输出文件，如果已存在则覆盖
* -ss 表示从哪个时间点开始截取
* -to 表示从哪个时间点结束截取
* -vcodec copy 使用跟原视频相同的视频编解码器
* -acodec copy 使用跟原视频相同的音频编解码器

```
ffmpeg  -i 视频路径 -vcodec copy -acodec copy -ss 00:00:09 -to 00:00:59 "保存路径" -y
```
## 转格式

```
ffmpeg -i 待转格式路径 -vcodec copy -acodec copy 目标格式路径
```
## PCM转WAV

```
ffmpeg -f s16be -ar 8000 -ac 2 -acodec pcm_s16be -i input.raw output.wav
ffplay  -f s16le -ar 8000 -ac 2 -acodec pcm_s16be tt5.wav
```
## 合并视频
* 首先创建一个inputs.txt文件，文件内容如下：

```
file '1.flv'
file '2.flv'
file '3.flv'
```
* 然后执行下面的命令：

```
ffmpeg -f concat -i inputs.txt -c copy output.flv
```
## 视频图片互转
* 视频转JPEG

```
ffmpeg -i test.flv -r 1 -f image2 image-%3d.jpeg
```
* 视频转GIF

```
ffmpeg -i out.mp4 -ss 00:00:00 -t 10 out.gif
```
* 图片转视频

```
ffmpeg  -f image2 -i image-%3d.jpeg images.mp4
```
## 直播相关
* 直播推流

```
ffmpeg -re -i out.mp4 -c copy -f flv rtmp://server/live/streamName
```
* 拉流保存

```
ffmpeg -i rtmp://server/live/streamName -c copy dump.flv
```
* 转流

```
ffmpeg -i rtmp://server/live/originalStream -c:a copy -c:v copy -f flv rtmp://server/live/h264Stream
```
* 实时推流

```
ffmpeg -framerate 15 -f avfoundation -i "1" -s 1280x720 -c:v libx264  -f  flv rtmp://localhost:1935/live/room
```

# 更多命令

- 命令不需要记，需要时打开文档查阅即可
- [ffmpeg文档](https://ffmpeg.org/ffmpeg.html)

# 结尾

{% note red 'fas fa-fan' flat%}很多东西其实不需要每个都记住，要用时知道在哪里找到它就行了。 {% endnote %}
