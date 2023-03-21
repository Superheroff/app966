---
title: aplayer魔改
tags:
  - python
  - node
categories: python
keywords: aplayer魔改
cover: 'https://qcloud.app966.cn/img/cover/1.jpg'
abbrlink: a26d3af5
date: 2022-11-20 14:33:10
---

# 解决痛点
1. 越来越多想听的歌曲因为收费无法收听
2. 有些歌曲只在网易云，又有些只在企鹅系才有
3. 我的魔改是播放器功能扩充，并非美化

# 解决思路
1. 不管它套多少层我们只看官方怎么调用播放的
2. 然后自己添加歌曲进去播放
3. 歌曲是调自己的（下载后保存在oss），但是歌词啥的那肯定用现成了，所以这里要拼接内容
4. 实际也可以不自己下载，在点击播放的时候我们再去取音乐的源地址也行，但是这个有个弊端，首先这个取收费歌曲的接口肯定迟早被封，被封后你得拥有一个vip的账号并且保持在线，一旦掉线你的播放器肯定就废了，所以我建议自定义添加的收费歌曲最好自己下载保存。

# 部署步骤
- 首先创建一个歌单页面，使用`hexo new page 页面名`创建
- 在建好的页面中填入以下html代码
```html
<div class="aplayer-wrap">
    <div id="aplayer1"><button class="docute-button load" id="kg" onclick="aplayer1()">酷狗歌单</button></div>
    <div id="aplayer2"><button class="docute-button load" id="wyy" onclick="aplayer2()">网易云歌单</button></div>
    <div id="aplayer3"><button class="docute-button load" id="qq" onclick="aplayer3()">QQ歌单</button></div>
</div>

<hr>
<div id="aplayer4"><button style="display: block"></button></div>
```
- 在`/butterfly/source/css`下新建一个css文件，内容如下
```css
.docute-button:hover {
    color: #fff;
    background-color: #000;
}

.docute-button {
    border: 2px solid #000;
    background-color: #fff;
    color: #000;
    cursor: pointer;
    outline: none;
    border-radius: 33px;
    padding: 5px 18px;
    font-size: 13px;
    font-weight: 700;
    transition: background-color .3s ease;
}

/* 适配黑夜模式 */
[data-theme='dark'] .docute-button:hover{
    color: #000;
    background-color: #fff;
}

[data-theme='dark'] .docute-button {
    border: 2px solid #fff;
    background-color: #000;
    color: #fff
}

.aplayer-wrap {
	display: flex;
	justify-content: space-between;
}
```
- 在`/butterfly/source/js`下新建一个js文件，内容如下
```javascript
function aplayer1 () {
	var aplayer3 = document.getElementById('qq');
	aplayer3.disabled = false;
	var aplayer2 = document.getElementById('wyy');
	aplayer2.disabled = false;
	var aplayer1 = document.getElementById('kg');
	aplayer1.disabled = true;
	/* 如何获取酷狗歌单id？首先需要设置可见，然后打开抓包工具，随便添加一首歌曲到歌单
	 *  https://gateway.kugou.com/v4/add_song? 找到这个接口，在返回文本中找到specalidpgc即可
	*/
	/* 填写自己的id哦 */
	var old_data = get_music('kugou', '6222311');

    window.ap = new APlayer({
        container: document.getElementById('aplayer4'),
        mini: false,
        autoplay: false,
        loop: 'all',
        order: 'list',
        preload: 'none',
        volume: 1,
        mutex: true,
        listFolded: false,
        listMaxHeight: 600,
        lrcType: 3,
        audio: old_data
    });

}

function aplayer2 () {
	var aplayer3 = document.getElementById('qq');
	aplayer3.disabled = false;
	var aplayer2 = document.getElementById('wyy');
	aplayer2.disabled = true;
	var aplayer1 = document.getElementById('kg');
	aplayer1.disabled = false;
	/* 填写自己的id哦 */
	var old_data = get_music('netease', '7480897649');

    window.ap = new APlayer({
        container: document.getElementById('aplayer4'),
        mini: false,
        autoplay: false,
        loop: 'all',
        order: 'list',
        preload: 'none',
        volume: 1,
        mutex: true,
        listFolded: false,
        listMaxHeight: 600,
        lrcType: 3,
        audio: old_data
    });

}



function aplayer3 () {
    	var aplayer3 = document.getElementById('qq');
	aplayer3.disabled = true;
	var aplayer2 = document.getElementById('wyy');
	aplayer2.disabled = false;
	var aplayer1 = document.getElementById('kg');
	aplayer1.disabled = false;
	/* 填写自己的id哦 */
	var old_data = get_music('tencent', '8672698451');
	var new_data = get_music_json();
    var n_data = add_music(old_data, new_data);
    window.ap = new APlayer({
        container: document.getElementById('aplayer4'),
        mini: false,
        autoplay: false,
        loop: 'all',
        order: 'list',
        preload: 'none',
        volume: 1,
        mutex: true,
        listFolded: false,
        listMaxHeight: 600,
        lrcType: 3,
        audio: n_data
    });
}


function get_music_json() {
    /* 获取自定义音乐列表 */
    /* 这里url填写自己自定义的歌曲，格式可以参考add_music()里面的注释 */
    var url = 'https://qcloud.app966.cn/music_json/music_json.txt';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    var data = JSON.parse(xhr.responseText);
    return data;
}

function get_music(server, id) {
    /* 获取音乐列表，只支持列表 */
    var url = 'https://api.i-meto.com/meting/api?server=' + server + '&type=playlist&id=' + id;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    var obj = JSON.parse(xhr.responseText);
    var music_list = {};
    var data = [];
    for (var i = 0; i < obj.length; i++) {
        music_list = {
            'name': obj[i].title,
            'artist': obj[i].author,
            'url': obj[i].url,
            'cover': obj[i].pic,
            'lrc': obj[i].lrc,
            'theme': '#ad7a86'
        };
        data.push(music_list);
    }
    return data;
}


function add_music(old_data, new_data) {
    /* 自定义添加自己喜欢的音乐，如周杰伦的收费音乐 */
    /*    new_data =  [
            {
                "name": "最伟大的作品",
                "artist": "周杰伦",
                "url": "https://qcloud.app966.cn/music/最伟大的作品.mp3",
                "cover": "https://api.i-meto.com/meting/api?server=tencent&type=pic&id=0024bjiL2aocxT&auth=61e9f0faa8848fad7dcaf1896547cfc1d67530fe",
                "lrc": "https://api.i-meto.com/meting/api?server=tencent&type=lrc&id=003KtYhg4frNXC&auth=c25076612a8e246d85488dcfc4540cbef83d72b8",
                "theme": "#ad7a86"
            }
        ] */

    if (new_data.length > 0) {
        for (var i = 0; i < new_data.length; i++) {
            old_data.unshift(new_data[i]);
        };
    };
    return old_data;

}

function whenDOMReady() {
    if (location.pathname == "/music/" || location.pathname == "/music/index.html") {
        aplayer3();
    }
}
whenDOMReady();
```

# 注意事项
1. 以上都解决后基本就结束了，歌单列表替换成你们自己的就行了
2. 我的设置了防盗链，不修改成你们的是无法使用的
3. 如果报错就运行以下命令：
```javascript
npm install aplayer --save
```
4. 需要在`/butterfly/_config.yml`下引入你新建的css、js
```yml
inject:
  head:
    - <link rel="stylesheet" href="/css/自定义的css.css">
  bottom:
    - <script defer data-pjax src="/js/自定义的js.js"></script>
```
5. 如果设置`listMaxHeight`列表高度无效，在自定义的css中加入如下代码
```css
.aplayer .aplayer-list {
    max-height: 600px;
}

.aplayer .aplayer-list ol {
    max-height: 600px;
}
```

# 结尾
- 如果你也想跟我一样喜欢自定义歌曲的，请按照以下内容继续
1. 首先通过它的接口去获取我们的歌单列表，直接浏览器访问以下链接就行
```
https://api.i-meto.com/meting/api?server=tencent&type=playlist&id=8672698451
```
2. 如果不知道接口的意思就[看这个文档](https://github.com/MoePlayer/hexo-tag-aplayer/blob/master/docs/README-zh_cn.md)，其它的直接忽略，我们只看`server`和`type`的意思，id很好理解，`type`是啥id就是啥id咯
3. 访问后把结果赋值给下面`set_music()`中的`arr`，然后把运行后的结果赋值给`add_music()`的`new_data`，默认是把自己添加在置在最前
```javascript
function set_music() {
    /* 转换 */
    let arr = [{"title":"去年夏天","author":"王大毛","url":"https://api.i-meto.com/meting/api?server=tencent&type=url&id=004XePmv4CsaEq&auth=28f23251d1b3b2af8df8e03cf484acde79c6a429","pic":"https://api.i-meto.com/meting/api?server=tencent&type=pic&id=003eyd0o3lYmxM&auth=843fd0a3b54f4173c476275be999c3dba547dd36","lrc":"https://api.i-meto.com/meting/api?server=tencent&type=lrc&id=004XePmv4CsaEq&auth=9ce9221aaea8bea58474a5b6dcb329aef90b9319"}];
    var music_list = {};
    var data = [];
    for (var i = 0; i < arr.length; i++) {
        music_list = {
            'name': arr[i].title,
            'artist': arr[i].author,
            'url': 'https://qcloud.app966.cn/music/' + arr[i].title + '.mp3',
            'cover': arr[i].pic,
            'lrc': arr[i].lrc,
            'theme': '#ad7a86'
        };
        data.push(music_list);
    }
    console.log(data);
    return data;
}
set_music();
```
- 运行示例
{% image https://qcloud.app966.cn/img/2.png %}

- 最后就是下载歌曲啦

- 运行下面的代码即可
```python
import requests
import os

def dow():
    while True:
        music_name = input('\r请输入歌曲名：')
        if music_name == 'exit':
            break
        header = {'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0'}
        url = 'http://search.kuwo.cn/r.s?client=kt&all=' + music_name + '&pn=0&rn=10&ver=kwplayer_ar_99.99.99.99&vipver=1&ft=music&cluster=0&strategy=2012&encoding=utf8&rformat=json&vermerge=1&mobi=1'
        ret = requests.get(url, headers=header, verify=False).json()
        n = 0
        title = ''
        for i in ret['abslist']:
            n += 1
            title += str(n) + '. ' + i['SONGNAME'] + ' - ' + i['ARTIST'] + '\n'
        print(title)
        rid = input('请输入序号下载对应的歌曲：')
        x = int(rid) - 1
        rid = ret['abslist'][x]['MUSICRID']
        music_name = ret['abslist'][x]['SONGNAME']
        if '-' in music_name:
            music_name = str_left(music_name, '-')
        print(rid, music_name)
        url = 'http://antiserver.kuwo.cn/anti.s?response=url&rid=' + rid + '&format=mp3|mp3&type=convert_url'
        play_url = requests.get(url, headers=header, verify=False).text
        if play_url:
            downloader(play_url, music_name)


def downloader(url, title):
    size = 0
    path = r'D:\\music\\' + title + '.mp3'
    res = requests.get(url, stream=True, verify=False)
    chunk_size = 1024
    # 每次下载数据大小
    content_size = int(res.headers["content-length"])
    # 总大小
    if res.status_code == 200:
        print('[%s 文件大小]: %0.2f MB' % (title, content_size / chunk_size / 1024))
        with open(path, 'wb') as f:
            for data in res.iter_content(chunk_size=chunk_size):
                f.write(data)
                size += len(data)  # 已下载文件大小
                print('\r' + '[下载进度]: %s%.2f%%' % ('>' * int(size * 50 / content_size), float(size / content_size * 100)), end='')


def str_left(t, s):
    if isinstance(t, str) != True or isinstance(s, str) != True:
        return '传入参数有误'
    elif t.find(s) != -1:
        return t[0:t.find(s)]
    else:
        return ""

if __name__ == '__main__':
    dow()
```

- 运行示例
{% image https://qcloud.app966.cn/img/1.png %}

- 预览[我的歌单](/music/)查看效果

