---
title: java版抖音视频解析
tags: java
categories: java
keywords: 抖音视频解析
cover: /temp/img/Maite_Youmagazine.jpg
abbrlink: ebfa80ed
date: 2022-07-01 02:22:57
---

# 使用idea导入相关依赖

{% span left h3, 从maven导入模块 %}

- 在idea中按`F4`进入模块设置或选中项目单击右键，可以看到进入模块设置
- 点击添加，选择来自maven，然后搜索想要的模块添加上就行
- 最好把自动引入模块的设置打开，如下图

{% image /img/jx_3.png, alt=进入模块设置 %}
{% image /img/jx_4.png, alt=搜索想要的模块 %}
{% image /img/jx_5.png, alt=自动导入设置 %}

- 也可以自己下载jar包放在`lib`目录下，并在`pom.xml`下添加如下代码，如下图

```xml
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.76</version>
    </dependency>
```
{% image /img/jx_2.png, alt=导入fastjson %}

# java代码
- 新的方法
```java
package text;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class dy_ana {
    public static String get_play(String video_id){
        /*
        获取无水印地址，新方法
        * */

        if (video_id == null){
            System.out.println("请手动输入字符视频id");
            Scanner sc = new Scanner(System.in);
            video_id = sc.nextLine();
            System.out.println(video_id);
        }

        /* String url = "https://www.douyin.com/aweme/v1/play/?video_id=%s&line=0&is_play_url=1&source=PackSourceEnum_PUBLISH";
        url = String.format(url, video_id);
        * */
        String t = String.valueOf(System.currentTimeMillis());
        String url = "https://api3-normal-c-hl.amemv.com/aweme/v1/multi/aweme/detail/?os_api=22&device_type=MI+9&ssmix=a&manifest_version_code=120701&dpi=240&uuid=%s&app_name=aweme&version_name=12.7.0&ts=%s&cpu_support64=false&storage_type=0&app_type=normal&appTheme=dark&ac=wifi&host_abi=armeabi-v7a&update_version_code=12709900&channel=tengxun_new&_rticket=%s&device_platform=android&iid=%s&version_code=120700&mac_address=%s&cdid=%s&openudid=%s&device_id=%s&resolution=720*1280&os_version=5.1.1&language=zh&device_brand=Android&aid=1128&mcc_mnc=46007";
        url = String.format(url, "262745062603948", t.substring(0,10), t, "3479331501001230", "10:2a:b3:7e:e5:2e", "a8f935d1-6b88-458a-8d15-1561ed4256b6", "af455a5a9cd3e9b4", "242369266188781");
        String params = "aweme_ids=[%s]&origin_type=goods_rank_list_0&push_params=&request_source=0";
        params = String.format(params, video_id);
        String ret = PostUrl(url, params);
        JSONObject obj = JSONObject.parseObject(ret);
        List<Object> Array = obj.getJSONArray("aweme_details");
        JSONArray jsonArray = new JSONArray(Array);
        JSONObject obj1 = jsonArray.getJSONObject(0);
        JSONObject obj2 = obj1.getJSONObject("video");
        JSONObject obj3 =  obj2.getJSONObject("play_addr");
        List<Object> Array1 = obj3.getJSONArray("url_list");
        JSONArray jsonArray1 = new JSONArray(Array1);
        return jsonArray1.getString(0);
    }



    public static String PostUrl(String httpUrl, String param) {

        HttpURLConnection connection = null;
        InputStream is = null;
        OutputStream os = null;
        BufferedReader br = null;
        String result = null;
        try {
            URL url = new URL(httpUrl);
            // 通过远程url连接对象打开连接
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            // 默认值为：false，当向远程服务器传送数据/写数据时，需要设置为true
            connection.setDoOutput(true);
            // 默认值为：true，当前向远程服务读取数据时，设置为true，该参数可有可无
            connection.setDoInput(true);
            // 设置传入参数的格式:请求参数应该是 name1=value1&name2=value2 的形式。
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            // 通过连接对象获取一个输出流
            os = connection.getOutputStream();
            // 通过输出流对象将参数写出去/传输出去,它是通过字节数组写出的
            os.write(param.getBytes());
            // 通过连接对象获取一个输入流，向远程读取
            if (connection.getResponseCode() == 200) {

                is = connection.getInputStream();
                // 对输入流对象进行包装:charset根据工作项目组的要求来设置
                br = new BufferedReader(new InputStreamReader(is, "UTF-8"));

                StringBuilder sbf = new StringBuilder();
                String temp = null;
                // 循环遍历一行一行读取数据
                while ((temp = br.readLine()) != null) {
                    sbf.append(temp);
                    sbf.append("\r\n");
                }
                result = sbf.toString();
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            // 关闭资源
            if (null != br) {
                try {
                    br.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (null != os) {
                try {
                    os.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (null != is) {
                try {
                    is.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            // 断开与远程地址url的连接

            assert connection != null;
            connection.disconnect();
        }
        return result;
    }



    public static String GetUrl(String url, boolean ss){
        /*
        get请求
        */
        BufferedReader reader = null;
        String result = "";
        try {
            URL realloc = new URL(url);
            //打开连接
            HttpURLConnection connection = (HttpURLConnection)realloc.openConnection();
            connection.setRequestMethod("GET");
            connection.setRequestProperty("user-agent",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0");
            connection.connect();
            /*
            获取location的情况下就不需要再去返回请求的结果拉
            */
            if (ss){
                connection.setInstanceFollowRedirects(false);
                String location = connection.getHeaderField("location");
                System.out.println("取location");
                result = location;
            }
            else {
                System.out.println("不取location");
                reader = new BufferedReader(new InputStreamReader(
                        connection.getInputStream(), "UTF-8"));
                String line;
                while ((line = reader.readLine()) != null) {
                    result += line;
                }

            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            if(reader!=null){
                try {
                    reader.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        /*
        获取抖音无水印视频示例
        1. 先获取数字视频id
        */
        String ret;
        String vid = null;

//        https://www.douyin.com/video/7123882684216085767
        String url = "https://v.douyin.com/kKpUdTE/";
        if (url.length() <= 29){
            ret = GetUrl(url, true);
        }
        else {
            ret = url;
        }

        System.out.println(ret);
        String regEx="7\\d{18}";
        Pattern p = Pattern.compile(regEx);
        Matcher m = p.matcher(ret);
        if (m.find()) {
            vid = m.group(0);
            System.out.println("匹配到的数字视频id:" + vid);
        } else {
            System.out.println("NO MATCH");
        }
        /*
        2.把数字视频id转成字符视频id
        */

        /* String video_id = get_video_id(vid);
        System.out.println("字符视频id：" + video_id);
        * */

        /*
        3.获取无水印地址
        */

/*        String play_url = get_play(video_id);*/

        String play_url = get_play(vid);
        System.out.println("无水印地址：" + play_url);

    }
}

```

- 旧版，此方法已失效
```java
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


public class dy_ana {

    public static String get_video_id(String vid){
        /*
        获取字符视频id
        * */
        String url = "https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=" + vid;
        String ret = GetUrl(url, false);
//        System.out.println(ret);

        JSONObject obj = JSONObject.parseObject(ret);
        List<Object> Array = obj.getJSONArray("item_list");
        JSONArray jsonArray = new JSONArray(Array);
        JSONObject obj1 = jsonArray.getJSONObject(0);
        JSONObject obj2 = obj1.getJSONObject("video");
        String video_id =  obj2.getString("vid");
        return video_id;
    }

    public static String get_play(String video_id){
        /*
        获取无水印地址
        * */

        if (video_id == null){
            System.out.println("请手动输入字符视频id");
            Scanner sc = new Scanner(System.in);
            video_id = sc.nextLine();
            System.out.println(video_id);
        }

        String url = "https://www.douyin.com/aweme/v1/play/?video_id=%s&line=0&is_play_url=1&source=PackSourceEnum_PUBLISH";
        url = String.format(url, video_id);
        String play_url = GetUrl(url, true);
        return play_url;
    }

    public static String GetUrl(String url, boolean ss){
        /*
        get请求
        */
        BufferedReader reader = null;


        String result = "";
        try {
            URL realloc = new URL(url);
            //打开连接
            HttpURLConnection connection = (HttpURLConnection)realloc.openConnection();

            connection.setRequestMethod("GET");
            connection.setRequestProperty("user-agent",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0");
            connection.connect();
            /*
            获取location的情况下就不需要再去返回请求的结果拉
            */
            if (ss == true){
                connection.setInstanceFollowRedirects(false);
                String location = connection.getHeaderField("location");
                System.out.println("取location");
                result = location;
            }
            else {
                System.out.println("不取location");
                reader = new BufferedReader(new InputStreamReader(
                        connection.getInputStream(), "UTF-8"));
                String line;
                while ((line = reader.readLine()) != null) {
                    result += line;
                }

            }
        } catch (Exception e) {
            e.printStackTrace();
        }finally{
            if(reader!=null){
                try {
                    reader.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return result;
    }

    public static void main(String[] args) {
        /*
        获取抖音无水印视频示例
        1. 先获取数字视频id
        */
        String ret;
        String vid = null;
//        https://www.douyin.com/video/7114995682527743269
        String url = "https://v.douyin.com/YpcJm6R/";
        if (url.length() <= 29){
            ret = GetUrl(url, true);
        }
        else {
            ret = url;
        }

        System.out.println(ret);
        String regEx="7\\d{18}";
        Pattern p = Pattern.compile(regEx);
        Matcher m = p.matcher(ret);
        if (m.find()) {
            vid = m.group(0);
            System.out.println("匹配到的数字视频id:" + vid);
        } else {
            System.out.println("NO MATCH");
        }
        /*
        2.把数字视频id转成字符视频id
        */

        String video_id = get_video_id(vid);
        System.out.println("字符视频id：" + video_id);
        /*
        3.获取无水印地址
        */

        String play_url = get_play(video_id);
        System.out.println("无水印地址：" + play_url);

    }
}

```
# 成功示例
{% image https://qcloud.app966.cn/img/dy_ana.png, alt= %}

# 结尾
- <font size=3>其它平台也可以按照这种方法获取无水印地址，实际原理都差不多</font>
- <font size=3>本源码仅限学习交流，不可用于商业用途</font>
- <font size=3>如有侵权请联系我删除</font>

