---
title: 抖音汽水音乐API
tags:
  - java
categories:
  - java
keywords: 汽水音乐API
cover: /temp/img/HifuMiyo-Folio-Art-Editorial-Illustration-Waitrose-Weekend.jpg
abbrlink: cf85313
date: 2022-07-30 07:14:33
---

# 前言

1. 收集了那么多音乐api不差这一个了
2. 这个播放器的音乐都是网红歌曲，主要为了获取榜单排行榜音乐
3. 这个播放器有加密但是它不校验加密，丢浏览器都能直接请求的那种
4. 好像是抖音旗下的属实有点冷门
5. 不逼逼了直接放代码结束

# 代码区

```java
package coke;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import java.io.IOException;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class coke_music {

    public static String get_musiclist(int music_type){
        /*
        获取歌单列表
        music_type=类型
        0=每日推荐
        93=官方
        9=欧美
        38=说唱
        16=电子
        15=摇滚
        18=民谣
        19=R&B
        20=国风
        40=学习
        45=睡前
        69=治愈
        8=华语
        14=流行
        */
        String url = "https://beta-luna.douyin.com/luna/feed/playlist-square?request_tag_from=lynx&device_platform=android&os=android&ssmix=a&_rticket=1659112744687&cdid=4a6a891c-e1e1-4fec-8ef6-94f28a302b0b&channel=xiaomi_8478&aid=8478&app_name=luna&version_code=10090140&version_name=1.9.1&manifest_version_code=10090140&update_version_code=10090140&resolution=1080*2030&dpi=440&device_type=MI+6X&device_brand=xiaomi&language=zh&os_api=28&os_version=9&ac=wifi&package=com.luna.music&hybrid_version_code=10090140&device_model=MI+6X&tz_name=Asia%2FShanghai&tz_offset=28800&network_speed=5246&iid=&device_id=";
        JSONObject param = new JSONObject();
        param.put("category_id", music_type);
        String result = null;
        HttpPost httpPost = new HttpPost(url);
        CloseableHttpClient client = HttpClients.createDefault();
        StringEntity entity = new StringEntity(param.toJSONString(), "UTF-8");
        httpPost.setHeader("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1");
        httpPost.setEntity(entity);
        try {
            HttpResponse response = client.execute(httpPost);
            if (response.getStatusLine().getStatusCode() == 200) {
                result = EntityUtils.toString(response.getEntity(), "utf-8");
            }
        } catch (IOException e) {
            e.printStackTrace();
            result = "error";
        }

        return result;
    }


    public static String get_musicrank(){
        /*
        获取rank榜
        */
        String url = "https://beta-luna.douyin.com/luna/discover?device_platform=android&os=android&ssmix=a&_rticket=1659122791092&cdid=05d1276c-3cad-4d05-892c-bb5187ca51b8&channel=xiaomi_8478&aid=8478&app_name=luna&version_code=10090140&version_name=1.9.1&manifest_version_code=10090140&update_version_code=10090140&resolution=1080*2030&dpi=440&device_type=MI+6X&device_brand=xiaomi&language=zh&os_api=28&os_version=9&ac=wifi&package=com.luna.music&hybrid_version_code=10090140&device_model=MI+6X&tz_name=Asia%2FShanghai&tz_offset=28800&network_speed=5297&iid=&device_id=";

        String result = null;
        HttpPost httpPost = new HttpPost(url);
        CloseableHttpClient client = HttpClients.createDefault();
        Map<String, String> map = new HashMap<>();
        map.put("body", null);
        StringEntity entity = new StringEntity(map.toString(), "UTF-8");
        httpPost.setEntity(entity);
        httpPost.setHeader("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1");
        try {
            HttpResponse response = client.execute(httpPost);
            if (response.getStatusLine().getStatusCode() == 200) {
                result = EntityUtils.toString(response.getEntity(), "utf-8");
            }
        } catch (IOException e) {
            e.printStackTrace();
            result = "error";
        }

        return result;
    }



    public static String get_playlist(String playlist_id){
        /*获取歌单里面的歌曲*/
        String url = MessageFormat.format("https://beta-luna.douyin.com/luna/playlist/detail?playlist_id={0}&cursor&device_platform=android&os=android&ssmix=a&_rticket=1659112831329&cdid=4a6a891c-e1e1-4fec-8ef6-94f28a302b0b&channel=xiaomi_8478&aid=8478&app_name=luna&version_code=10090140&version_name=1.9.1&manifest_version_code=10090140&update_version_code=10090140&resolution=1080*2030&dpi=440&device_type=MI+6X&device_brand=xiaomi&language=zh&os_api=28&os_version=9&ac=wifi&package=com.luna.music&hybrid_version_code=10090140&device_model=MI+6X&tz_name=Asia%2FShanghai&tz_offset=28800&network_speed=5246&iid=&device_id=", playlist_id);

        String result = null;
        HttpGet httpGet = new HttpGet(url);
        CloseableHttpClient client = HttpClients.createDefault();
        httpGet.setHeader("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1");

        try {
            HttpResponse response = client.execute(httpGet);
            if (response.getStatusLine().getStatusCode() == 200) {
                result = EntityUtils.toString(response.getEntity(), "utf-8");
            }
        } catch (IOException e) {
            e.printStackTrace();
            result = "error";
        }

        return result;
    }

    public static void main(String[] args) {
        String musicrank = get_musicrank();
        System.out.println("榜单列表：" + musicrank);

        String musiclist = get_musiclist(0);
        System.out.println("歌单列表：" + musiclist);
        JSONObject obj = JSONObject.parseObject(musiclist);
        List<Object> Array = obj.getJSONArray("items");
        JSONArray jsonArray = new JSONArray(Array);
        /*这里demo就取随机一个，你也可以固定或者全部取*/
        int listint = (int) (Math.random() * jsonArray.toArray().length);
        JSONObject obj1 = jsonArray.getJSONObject(listint);
        String list_id = obj1.getString("id");
        System.out.println(list_id);
        String playlist = get_playlist(list_id);
        System.out.println("音乐列表：" + playlist);

        obj = JSONObject.parseObject(playlist);
        Array = obj.getJSONArray("tracks");
        jsonArray = new JSONArray(Array);
        listint = (int) (Math.random() * jsonArray.toArray().length);
        obj1 = jsonArray.getJSONObject(listint);
        String music_id = obj1.getString("vid");
        System.out.println("音乐ID：" + music_id);
        /*得到这个id就等于结束了，不要从音乐列表去获取音乐的url，我测试是不行无法播放，具体原因懒得研究了。这里直接用抖音的万能解析接口
        https://www.douyin.com/aweme/v1/play/?video_id=这里输入上面获取的音乐ID&line=0&is_play_url=1&source=PackSourceEnum_PUBLISH
        请求后即可获得播放地址，会员音乐也是可以获取到的，目前全程无任何加密！
        * */
    }
}

```
# 结束
{% image /img/coke.png, alt= %}
