---
title: 各类api整理
tags:
  - api
  - python
categories:
  - python
keywords: api、接口
cover: /temp/img/James-Gilleard-Folio-Illustration-Chef-Digital.jpg
abbrlink: d25b4188
date: 2022-06-18 00:07:17
---

## 酷狗 api


- 搜索示例

``` python

# web版
import requests
url = 'http://mobilecdn.kugou.com/api/v3/search/song?keyword=周杰伦&page=1&pagesize=10'
return requests.get(url).text

```

参数名|参数类型|参数描述|参数示例
---|---|---|---
keyword|string|搜索的内容|周杰伦
page|int|页数，首页默认=1|1
pagesize|int|每页返回的条数|10

``` python

# app版
import requests
url = 'https://gateway.kugou.com/complex_search_v2?platform=AndroidFilter&tag=em&serverid=1005&clientver=10159&area_code=1&keyword=周杰伦&iscorrection=1&cursor=1&userid=0&with_res_tag=1'
header = {
        'Host': 'gateway.kugou.com',
        'x-router': 'complexsearch.kugou.com',
        'User-Agent': 'Android511-AndroidPhone-10159-18-0-SearchAll-wifi'
    }
return requests.get(url, hedaers=header).text

```

参数名|参数类型|参数描述|参数示例
---|---|---|---
keyword|string|搜索的内容|周杰伦
cursor|int|页数，首页默认为1|1
userid|int|登录者的uid,不登录为0，若登录的号有VIP可获取VIP歌曲|0


- 获取播放链接示例

``` python

# web版 不可以获取收费音乐
import requests
url = 'http://trackercdn.kugou.com/i/?cmd=4&hash=6d6bc2d6ae2b21943f810a2cd23e2260&key=438e67f73f52a62dfd8f376baee6fa67&pid=1&forceDown=0&vip=1'
return requests.get(url).text

```
参数名|参数类型|参数描述|参数示例
---|---|---|---
hash|string|音乐id 从搜索接口获取|6d6bc2d6ae2b21943f810a2cd23e2260 晴天（参与key计算）
key|string|歌曲id的md5运算 key = md5（hash+‘kgcloud’） |438e67f73f52a62dfd8f376baee6fa67

``` python

# app版 登录VIP账号可以获取收费音乐
import requests
import random
# mid=生成随机38位
mid = '57504571277460088827659080040737130582'
# mid = str(random.randint(10000000000000000000000000000000000000,99999999999999999999999999999999999999))

url = 'https://gateway.kugou.com/i/v2/?dfid=&pid=2&mid='+mid+'&cmd=26&token=&hash=60420483a05ade5ebcb66e863048084a&area_code=1&behavior=play&appid=1005&module=&vipType=6&ptype=1&{% wavy userid %}=0&mtype=1&album_id=&pidversion=3001&key=0461a472420a489a3d8e12efd3909193&version=10209&album_audio_id=&with_res_tag=1'
header = {
        'Host': 'gateway.kugou.com',
        'x-router': 'complexsearch.kugou.com',
        'User-Agent': 'Android511-AndroidPhone-10159-18-0-SearchAll-wifi'
    }
return requests.get(url, hedaers=header).text

```

参数名|参数类型|参数描述|参数示例
---|---|---|---
hash|string|音乐id 从搜索接口获取|60420483a05ade5ebcb66e863048084a 爱你（参与key计算）
userid|string|用户id，不登录为0 |0（参与key计算）
token|string|不登录为空 |null
mid|string|设备id,随机生成38位即可 |57504571277460088827659080040737130582（参与key计算）
key|string|歌曲id的md5运算 key = md5（hash+‘57ae12eb6890223e355ccfcb74edf70d1005’+mid+userid） |0461a472420a489a3d8e12efd3909193


## 酷我 api

- 搜索示例

``` python

import requests
import uuid
import urllib.parse

def get_kuwo_kwd(keyword, page='1'):
    if keyword:
        keyword = urllib.parse.quote(keyword)
    else:
        return {'msg': '缺少必填参数'}
    url = 'http://www.kuwo.cn/'
    ret = requests.get(url)
    cookie = ret.cookies.get('kw_token', '')
    if cookie:
        print('获取token', cookie, '搜索内容：' + keyword)
        url = 'http://www.kuwo.cn/api/www/search/searchMusicBykeyWord?key=' + keyword + '&pn=' + page + '&rn=30&httpsStatus=1&reqId=' + str(
            uuid.uuid4())
        header = {
            'Cookie': 'kw_token=' + cookie,
            'csrf': cookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0',
            'Referer': 'http://www.kuwo.cn/search/list?key=' + keyword
        }
        ret = requests.get(url, headers=header).text
        print('获得搜索结果', ret)
        return ret
    else:
        return {'msg': 'token没有获取到'}

```

参数名|参数类型|参数描述|参数示例
---|---|---|---
key|string|搜索的内容|爱你
pn|int|页数，首页默认为1|1
rn|int|每页返回的数量|30

- 获取播放链接示例

```python

# 可以获取收费音乐
import requests
def get_kuwo_playurl(music_id):
    url = 'http://antiserver.kuwo.cn/anti.s?response=url&rid=MUSIC_' + music_id + '&format=mp3|mp3&type=convert_url'
    ret = requests.get(url).text
    print('mp3', ret)
    return ret
    
```
参数名|参数类型|参数描述|参数示例
---|---|---|---
rid|int|音乐id|89622

## 网易云 api

- 搜索、播放示例

```python

# 登录vip账号可以获取收费音乐

import urllib.request,os,json
from lxml import etree
import execjs,requests,random
import base64,codecs
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad

def to_16(key):
    while len(key) % 16 != 0:
        key += '\0'
    return str.encode(key)

def AES_encrypt(text, key, iv):
    bs = AES.block_size
    pad2 = lambda s: s + (bs - len(s) % bs) * chr(bs - len(s) % bs)
    encryptor = AES.new(to_16(key), AES.MODE_CBC, to_16(iv))

    pd2 = pad(str.encode(pad2(text)), 16)

    encrypt_aes = encryptor.encrypt(pd2)
    encrypt_text = str(base64.encodebytes(encrypt_aes), encoding='utf-8')
    return encrypt_text

def RSA_encrypt(text, pubKey, modulus):
    text = text[::-1]
    rs = int(codecs.encode(text.encode('utf-8'), 'hex_codec'), 16) ** int(pubKey, 16) % int(modulus, 16)
    return format(rs, 'x').zfill(256)


#获取i值的函数，即随机生成长度为16的字符串
get_i=execjs.compile(r"""
    function a(a) {
        var d, e, b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", c = "";
        for (d = 0; a > d; d += 1)
            e = Math.random() * b.length,
            e = Math.floor(e),
            c += b.charAt(e);
        return c
    }
""")

class WangYiYun():
    def __init__(self):
        self.csrf_token = '4d0b2e88b6ab343e26e68ca6e6037ee4'
        self.g = '0CoJUm6Qyw8W8jud'
        self.b = "010001"
        self.c = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'
        self.i = get_i.call('a', 16)
        self.iv = "0102030405060708"
        # if not os.path.exists("d:/music"):
        #     os.mkdir('d:/music')
        self.ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.152 Safari/537.36'

    def get_encSecKey(self):
        return RSA_encrypt(self.i, self.b, self.c)

    def get_wyy_kwd(self, keyword):

        url = 'https://music.163.com/weapi/cloudsearch/get/web?csrf_token=' + self.csrf_token
        encText = str({'hlpretag': '<span class=\"s-fc7\">', 'hlposttag': '</span>', '#/discover': '', 's': keyword, 'type': '1', 'offset': "0", 'total': 'true', 'limit': '30', 'csrf_token': self.csrf_token})
        params = AES_encrypt(AES_encrypt(encText, self.g, self.iv), self.i, self.iv)
        data = {
            'params': params,
            'encSecKey': self.get_encSecKey()
        }

        header = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'music.163.com',
            'Referer': 'https://music.163.com/search/',
            'User-Agent': self.ua
        }
        ret = requests.post(url, headers=header, data=data)
        print('搜索结果', ret.text)
        return ret.json()


    def get_wyy_playurl(self, music_id, music_name='未获取到音乐名'+str(random.randint(10,99))):

        url = 'https://music.163.com/weapi/song/enhance/player/url?csrf_token=' + self.csrf_token
        encText = str({'ids': "[" + str(music_id) + "]", 'br': 128000, 'csrf_token': self.csrf_token, 'MUSIC_U': '42f261e687b542b337a7ed725bc3eef999d3a186ca605bc29ac9c83d0c081c6b33a649814e309366'})
        params = AES_encrypt(AES_encrypt(encText, self.g, self.iv), self.i, self.iv)
        data = {
            'params': params,
            'encSecKey': self.get_encSecKey()
        }
        headeer = {
            'User-Agent': self.ua,
            'Referer': 'https://music.163.com/',
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        ret = requests.post(url, headers=headeer, data=data).json()
        download_url = ret['data'][0]['url']
        if download_url:
            try:
                msg = {'music_name': music_name, 'play_url': download_url}
                # 根据音乐url地址，用urllib.request.retrieve直接将远程数据下载到本地
                # urllib.request.urlretrieve(download_url, 'd:/music/' + music_name+ '.mp3')
                # print('Successfully Download:'+music_name+ '.mp3')
            except:
                msg = {'msg': '出错了~'}
        else:
            msg = {'msg': '获取失败'}
        print(msg)
        return msg

if __name__ == '__main__':
    wyy = WangYiYun()
    # 搜索内容
    ret = wyy.get_wyy_kwd('爱你')
    music_id = ret['result']['songs'][0]['id']
    music_name = ret['result']['songs'][0]['name']
    print(music_name, music_id)
    if music_id:
        wyy.get_wyy_playurl(music_id, music_name)

```

参数名|参数类型|参数描述|参数示例
---|---|---|---
csrf_token|string|登录后的凭据1 （参与加密）|无
MUSIC_U|string|登录后的凭据2 （参与加密）|无
keyword|string|搜索的内容 （参与加密）|爱你（搜索参数）
offset|int|翻页首页为0 （参与加密）|0（搜索参数）
music_id|int|音乐id （参与加密）|1956718331（获取音乐链接参数）


## Tiktok api

### 获取某人的所有作品

- 接口示例

```text
https://m.tiktok.com/api/post/item_list/?aid=1988&count=20&secUid=MS4wLjABAAAAzOqSo_TDLv6hWuFfTgN7E79a3G4A5DG3ZjXj_o_Uh2HAZTayiXor_X7Gh3SHta0T&cursor=0
```

参数名|参数类型|参数描述|参数示例
---|---|---|---
count|int|每次返回条数|20
secUid|string|sec_uid进入主页可获取|https://www.tiktok.com/@lilygumi
cursor|string|`首页为0，下一页为本次请求返回的cursor`|0

- 响应参数

```json

{
    "statusCode":0,
    "itemList":[
        {
            "id":"7112752507037715738",
            "desc":"I love this song 🫣",
            "createTime":1656066748,
            "video":{
                "id":"7112752507037715738",
                "height":1024,
                "width":576,
                "duration":8,
                "ratio":"720p",
                "cover":"https://p16-sign-va.tiktokcdn.com/obj/tos-useast2a-p-0037-aiso/7792929b50884b8bb59c6da4d86a7889?x-expires=1656144000\u0026x-signature=gTvf1VpWg7Az0M8gcogRDdgtnpY%3D",
                "originCover":"https://p16-sign-va.tiktokcdn.com/obj/tos-useast2a-p-0037-aiso/069acc0bd66d4540bcffdbf82a407d37_1656066750?x-expires=1656144000\u0026x-signature=aYvJUL3LnjSS3OSru%2B%2FK9zV2viE%3D",
                "dynamicCover":"https://p16-sign-va.tiktokcdn.com/obj/tos-useast2a-p-0037-aiso/4f685b97a5df41e1b5eefcdc2a78c8cb_1656066750?x-expires=1656144000\u0026x-signature=clhCDmcYOEYA29Rgm8O1UswRTsU%3D",
                "playAddr":"https://v16m-webapp.tiktokcdn-us.com/e1eeea77457de39d2026d3fd51f17b77/62b6c82c/video/tos/useast2a/tos-useast2a-pve-0037-aiso/e1802617a97946eeae4d458510a4ef35/?a=1988\u0026ch=0\u0026cr=0\u0026dr=0\u0026lr=tiktok\u0026cd=0%7C0%7C1%7C0\u0026cv=1\u0026br=2424\u0026bt=1212\u0026cs=0\u0026ds=3\u0026ft=ebtHKH-qMyq8ZuapUwe2NxSRfl7Gb\u0026mime_type=video_mp4\u0026qs=0\u0026rc=Ozo8Njo8N2Y1N2Y3OWhpaUBpM2s2N2c6ZndyZDMzZjgzM0A2LTFiYF8vXmExMS0xXmFgYSNmb2llcjQwc25gLS1kL2Nzcw%3D%3D\u0026l=202206250232360100040050060030360AD6E1A9",
                "downloadAddr":"https://v16m-webapp.tiktokcdn-us.com/e1eeea77457de39d2026d3fd51f17b77/62b6c82c/video/tos/useast2a/tos-useast2a-pve-0037-aiso/e1802617a97946eeae4d458510a4ef35/?a=1988\u0026ch=0\u0026cr=0\u0026dr=0\u0026lr=tiktok\u0026cd=0%7C0%7C1%7C0\u0026cv=1\u0026br=2424\u0026bt=1212\u0026cs=0\u0026ds=3\u0026ft=ebtHKH-qMyq8ZuapUwe2NxSRfl7Gb\u0026mime_type=video_mp4\u0026qs=0\u0026rc=Ozo8Njo8N2Y1N2Y3OWhpaUBpM2s2N2c6ZndyZDMzZjgzM0A2LTFiYF8vXmExMS0xXmFgYSNmb2llcjQwc25gLS1kL2Nzcw%3D%3D\u0026l=202206250232360100040050060030360AD6E1A9",
                "shareCover":[
                    "",
                    "https://p16-sign-va.tiktokcdn.com/tos-useast2a-p-0037-aiso/069acc0bd66d4540bcffdbf82a407d37_1656066750~tplv-tiktok-play.jpeg?x-expires=1656727200\u0026x-signature=%2BPK28a7022WWUX5JI8n4ND4Gj0I%3D",
                    "https://p16-sign-va.tiktokcdn.com/tos-useast2a-p-0037-aiso/069acc0bd66d4540bcffdbf82a407d37_1656066750~tplv-tiktokx-share-play.jpeg?x-expires=1656727200\u0026x-signature=w0rpeSJ%2Bn4WSSXrgM1IaIYthSF0%3D"
                ],
                "reflowCover":"https://p16-sign-va.tiktokcdn.com/obj/tos-useast2a-p-0037-aiso/7792929b50884b8bb59c6da4d86a7889?x-expires=1656144000\u0026x-signature=gTvf1VpWg7Az0M8gcogRDdgtnpY%3D",
                "bitrate":1241132,
                "encodedType":"normal",
                "format":"mp4",
                "videoQuality":"normal",
                "encodeUserTag":"",
                "codecType":"h264",
                "definition":"720p",
                "bitrateInfo":[
                    {
                        "GearName":"normal_720_0",
                        "Bitrate":1241132,
                        "QualityType":10,
                        "PlayAddr":{
                            "Uri":"v0f025gc0000caqovt3c77udh4l3rhi0",
                            "UrlList":[
                                "https://v16m-webapp.tiktokcdn-us.com/e1eeea77457de39d2026d3fd51f17b77/62b6c82c/video/tos/useast2a/tos-useast2a-pve-0037-aiso/e1802617a97946eeae4d458510a4ef35/?a=1988\u0026ch=0\u0026cr=0\u0026dr=0\u0026lr=tiktok\u0026cd=0%7C0%7C1%7C0\u0026cv=1\u0026br=2424\u0026bt=1212\u0026cs=0\u0026ds=3\u0026ft=ebtHKH-qMyq8ZuapUwe2NxSRfl7Gb\u0026mime_type=video_mp4\u0026qs=0\u0026rc=Ozo8Njo8N2Y1N2Y3OWhpaUBpM2s2N2c6ZndyZDMzZjgzM0A2LTFiYF8vXmExMS0xXmFgYSNmb2llcjQwc25gLS1kL2Nzcw%3D%3D\u0026l=202206250232360100040050060030360AD6E1A9",
                                "https://v16m-webapp.tiktokcdn-us.com/e1eeea77457de39d2026d3fd51f17b77/62b6c82c/video/tos/useast2a/tos-useast2a-pve-0037-aiso/e1802617a97946eeae4d458510a4ef35/?a=1988\u0026ch=0\u0026cr=0\u0026dr=0\u0026lr=tiktok\u0026cd=0%7C0%7C1%7C0\u0026cv=1\u0026br=2424\u0026bt=1212\u0026cs=0\u0026ds=3\u0026ft=ebtHKH-qMyq8ZuapUwe2NxSRfl7Gb\u0026mime_type=video_mp4\u0026qs=0\u0026rc=Ozo8Njo8N2Y1N2Y3OWhpaUBpM2s2N2c6ZndyZDMzZjgzM0A2LTFiYF8vXmExMS0xXmFgYSNmb2llcjQwc25gLS1kL2Nzcw%3D%3D\u0026l=202206250232360100040050060030360AD6E1A9"
                            ],
                            "DataSize":1360126,
                            "UrlKey":"v0f025gc0000caqovt3c77udh4l3rhi0_h264_720p_1241132",
                            "FileHash":"a3714e81dec3853b714052c41a7ad208",
                            "FileCs":"c:0-10864-2e06"
                        },
                        "CodecType":"h264"
                    }
                ]
            },
            "author":{
                "id":"6978141947873543169",
                "uniqueId":"lilygumi",
                "nickname":"lilygumi",
                "avatarThumb":"https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/b0456b1c271fc15e4013dae1db6fabf9~c5_100x100.jpeg?x-expires=1656295200\u0026x-signature=cltMfS9K4iYDl5dHpdP7sebE4FA%3D",
                "avatarMedium":"https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/b0456b1c271fc15e4013dae1db6fabf9~c5_720x720.jpeg?x-expires=1656295200\u0026x-signature=mKjY8ms6asNEkuQu9tpDuFE3GqU%3D",
                "avatarLarger":"https://p16-sign-va.tiktokcdn.com/tos-useast2a-avt-0068-giso/b0456b1c271fc15e4013dae1db6fabf9~c5_1080x1080.jpeg?x-expires=1656295200\u0026x-signature=m92lVF%2Bhhtm0R8TO7cwMQ8kz1OQ%3D",
                "signature":"Ig: lilygumii\nFb: Đặng Khánh LiLy",
                "verified":false,
                "secUid":"MS4wLjABAAAAzOqSo_TDLv6hWuFfTgN7E79a3G4A5DG3ZjXj_o_Uh2HAZTayiXor_X7Gh3SHta0T",
                "secret":false,
                "ftc":false,
                "relation":1,
                "openFavorite":false,
                "commentSetting":0,
                "duetSetting":0,
                "stitchSetting":0,
                "privateAccount":false,
                "isADVirtual":false,
                "ttSeller":false
            },
            "music":{
                "id":"7034890254645611269",
                "title":"original sound",
                "playUrl":"https://sf16-ies-music-va.tiktokcdn.com/obj/musically-maliva-obj/7034890328813472517.mp3",
                "coverThumb":"https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/57e074aef1909c99928c9ba5c814954b~c5_100x100.jpeg?x-expires=1656295200\u0026x-signature=Pcnfx3PeQ%2F0xXuQsAQ%2FGfo%2FFrG8%3D",
                "coverMedium":"https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/57e074aef1909c99928c9ba5c814954b~c5_720x720.jpeg?x-expires=1656295200\u0026x-signature=VwGyJTOq%2F%2BxUcqifZdUt8tueP%2Fs%3D",
                "coverLarge":"https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/57e074aef1909c99928c9ba5c814954b~c5_1080x1080.jpeg?x-expires=1656295200\u0026x-signature=iKrbkjigsjqqwi3Pg3tF3m2%2FK4I%3D",
                "authorName":"bella \u0026 gemma",
                "original":true,
                "duration":13,
                "album":""
            },
            "stats":{
                "diggCount":4710,
                "shareCount":28,
                "commentCount":51,
                "playCount":29700
            },
            "duetInfo":{
                "duetFromId":"0"
            },
            "originalItem":false,
            "officalItem":false,
            "secret":false,
            "forFriend":false,
            "digged":false,
            "itemCommentStatus":0,
            "showNotPass":false,
            "vl1":false,
            "itemMute":false,
            "authorStats":{
                "followingCount":395,
                "followerCount":176900,
                "heartCount":980600,
                "videoCount":54,
                "diggCount":3465,
                "heart":980600
            },
            "privateItem":false,
            "duetEnabled":true,
            "stitchEnabled":true,
            "shareEnabled":true,
            "isAd":false,
            "duetDisplay":0,
            "stitchDisplay":0,
            "adAuthorization":false,
            "adLabelVersion":0
        }
    ],
    "cursor":"1656066748000",
    "hasMore":true
}

```

## 结尾

```TEXT

仅供学习交流，请勿商用以及大量获取，如有侵权请联系我第一时间删除

```


