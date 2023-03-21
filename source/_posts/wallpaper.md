---
title: 用python做一个高清壁纸下载器
tags:
  - python
  - wallpaper
categories:
  - python
keywords: 壁纸下载器
cover: >-
  /temp/img/Maite-Franchi-Folio-Illustration-T-Brand-NYT-SAS_Barilla_Pasta-Data.jpg
abbrlink: a5f8adda
date: 2022-07-04 00:49:43
---

# 前言

{% checkbox green checked, 支持4K高清 %}
{% checkbox green checked, 支持区分手机、电脑壁纸 %}
{% checkbox green checked, 本源码仅限用于学习交流 %}
{% checkbox green checked, 由于整理相册的需求所以做一个壁纸下载的工具 %}
{% checkbox times red checked, 请勿批量爬取 %}
{% checkbox times red checked, 请勿用于商业用途 %}
{% checkbox green checked, 使用后造成的损失与作者无关 %}


# 代码区
- 代码开箱即用
- [下载wallpaper.py](/file/wallpaper.py)

```python
import os
import requests
import re
from bs4 import BeautifulSoup
import time
import random
import imagesize

class wallpaper:
    def __init__(self, page, download):
        """
        默认是获取美女图片
        :param page: 页数
        :param download: 是否下载图片
        """
        self.page = page
        self.download = download
        self.header = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:46.0) Gecko/20100101 Firefox/46.0'
        }
        if self.download:
            self.div = r"E:\\wallpaper"
            if not os.path.exists(self.div):
                os.mkdir(self.div)

    def downloader(self, url, path, title):
        size = 0
        res = requests.get(url, stream=True)
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

    def update_name(self, path):
        """
        修改文件名，用于区分手机和电脑版
        只支持jpg格式 其它格式在下面修改 或者单独放在一个文件夹内 删除第52行即可
        :param path:
        :return:
        """
        print('开始修改文件名')
        file_list = os.listdir(path)
        for f in file_list:
            old_name = os.path.join(path, f)
            if old_name[3:] == 'jpg':
                w, h = imagesize.get(old_name)
                isphone = '_phone' if h > w else '_pc'
                new_name = old_name[:len(old_name) - 6] + isphone + '.jpg'
                os.rename(old_name, new_name)
        print('文件名修改完毕')

    def get_4kbz(self):
        """
        默认是获取美女图片
        获取其它类型请更改page
        :return:
        """
        # 先获取cookie
        url = 'https://www.4kbizhi.com/'
        ret = requests.get(url, headers=self.header)
        cookie = requests.utils.dict_from_cookiejar(ret.cookies)
        self.header['Cookie'] = '__yjs_duid=' + cookie['__yjs_duid']
        start = time.time()
        for n in range(self.page):
            page = 'meinv/index_' + str(n + 1) + '.html' if n > 0 else 'meinv/'
            ret = requests.get(url + page, headers=self.header).content.decode('gbk')
            soup = BeautifulSoup(ret, 'lxml')
            tag = soup.find_all('img')
            for i in tag:
                img_key = re.sub(r"\s", "", str(i))
                img_key = re.sub(r"4k电脑壁纸", "", img_key)
                img_key = re.sub(r"4k手机壁纸", "", img_key)
                img_key = re.sub(r"4k美女壁纸", "", img_key)
                img_name = self.get_str_btw(img_key, 'alt="', '"')
                if img_name:
                    img = re.sub("small", "", img_key)
                    img = self.get_str_btw(img, 'src="', '"')
                    img = img[:len(img) - 14] + '.jpg'
                    if len(img) == 34:
                        img = 'https://www.4kbizhi.com' + img
                        print('\r' + img_name, img)
                        if self.download:
                            img_path = os.path.join(self.div, img_name + str(random.randint(10, 99)) + '.jpg')
                            # print(img_path)
                            self.downloader(img, img_path, img_name)
        if self.download:
            end = time.time()
            print('\n' + "全部下载完成！用时%s秒" % round(end - start, 1))
            self.update_name(self.div)

        """
        不完美 请求下面的接口即可注册cookie
        """

        # challenge_token = get_str_btw(ret.text, "window['yjs_js_challenge_token']='", "'</script>")
        # print(cookie, challenge_token)
        # url = 'https://www.4kbizhi.com/yjs-cgi/security/js_challenge/verify?token=' + challenge_token
        # data = {}
        # ret = requests.post(url, data=data, headers=header)
        # cookie = requests.utils.dict_from_cookiejar(ret.cookies)
        # print(ret.text)

    def get_jkrs(self):
        """
        默认获取全部
        获取其它类型请更改page
        :return:
        """
        url = 'https://jk.rs/'
        start = time.time()
        for n in range(self.page):
            page = 'page/%s/' % str(n + 1) if n > 0 else ''
            ret = requests.get(url + page, headers=self.header).text
            soup = BeautifulSoup(ret, 'lxml')
            tag = soup.find_all('a', class_='item-link')
            # print(tag)
            for i in tag:
                img_key = re.sub(r"\s", "", str(i))
                # print(img_key)
                img_url = self.get_str_btw(img_key, '"href="', '">')
                img_name = self.get_str_btw(img_key, '"item-link-text">', '</div>')
                ret = requests.get(img_url, headers=self.header).text
                soup = BeautifulSoup(ret, 'lxml')
                tag2 = soup.find_all('img', class_='post-item-img lazy')
                j = 0
                for i1 in tag2:
                    j += 1
                    img_key2 = re.sub(r"\s", "", str(i1))
                    img_name2 = self.get_str_btw(img_key2, 'title="', '"/>')
                    img_url2 = self.get_str_btw(img_key2, 'data-original="', '"src="')
                    print('\n' + '正在获取[%s]图集内的内容' % (img_name + str(j)))
                    if self.download:
                        div = self.div + "\\" + img_name
                        if not os.path.exists(div):
                            os.mkdir(div)
                        img_path = os.path.join(div, img_name2 + '.jpg')
                        self.downloader(img_url2, img_path, img_name2)
                if self.download:
                    end = time.time()
                    print('\n' + img_name + "下载完成！共用时%s秒" % round(end - start, 1))
                    # 这个图片源没有必要去区分手机和电脑
                    # self.update_name(div)


    def get_str_btw(self, s, f, b):
        par = s.partition(f)
        return (par[2].partition(b))[0][:]

if __name__ == '__main__':
    wall = wallpaper(download=True, page=5)
    # 下载jk
    wall.get_jkrs()
    # 下载4k
    # wall.get_4kbz()
```

# 成功示例
- [查看图集](/picture/wallpaper/index.html)

{% image /pic/wallpaper.png, alt= %}




