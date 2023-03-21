function switchPostChart () {
  // 这里为了统一颜色选取的是“明暗模式”下的两种字体颜色，也可以自己定义
  let color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
  if (document.getElementById('posts-chart') && postsOption) {
    try {
      let postsOptionNew = postsOption
      postsOptionNew.title.textStyle.color = color
      postsOptionNew.xAxis.nameTextStyle.color = color
      postsOptionNew.yAxis.nameTextStyle.color = color
      postsOptionNew.xAxis.axisLabel.color = color
      postsOptionNew.yAxis.axisLabel.color = color
      postsOptionNew.xAxis.axisLine.lineStyle.color = color
      postsOptionNew.yAxis.axisLine.lineStyle.color = color
      postsOptionNew.series[0].markLine.data[0].label.color = color
      postsChart.setOption(postsOptionNew)
    } catch (error) {
      console.log(error)
    }
  }
  if (document.getElementById('tags-chart') && tagsOption) {
    try {
      let tagsOptionNew = tagsOption
      tagsOptionNew.title.textStyle.color = color
      tagsOptionNew.xAxis.nameTextStyle.color = color
      tagsOptionNew.yAxis.nameTextStyle.color = color
      tagsOptionNew.xAxis.axisLabel.color = color
      tagsOptionNew.yAxis.axisLabel.color = color
      tagsOptionNew.xAxis.axisLine.lineStyle.color = color
      tagsOptionNew.yAxis.axisLine.lineStyle.color = color
      tagsOptionNew.series[0].markLine.data[0].label.color = color
      tagsChart.setOption(tagsOptionNew)
    } catch (error) {
      console.log(error)
    }
  }
  if (document.getElementById('categories-chart') && categoriesOption) {
    try {
      let categoriesOptionNew = categoriesOption
      categoriesOptionNew.title.textStyle.color = color
      categoriesOptionNew.legend.textStyle.color = color
      categoriesOptionNew.series[0].label.color = color
      categoriesChart.setOption(categoriesOptionNew)
    } catch (error) {
      console.log(error)
    }
  }
}

document.getElementById("darkmode").addEventListener("click", function () { setTimeout(switchPostChart, 100) })


//动态标题
// var OriginTitile = document.title;
// var titleTime;
// document.addEventListener('visibilitychange', function () {
//     if (document.hidden) {
//         //离开当前页面时标签显示内容
//         document.title = '⌇●﹏●⌇不要走！再看看嘛！';
//         clearTimeout(titleTime);
//     }
//     else {
//         //返回当前页面时标签显示内容
//         document.title = 'φ(￣∇￣o)ゝ欢迎回来！' + OriginTitile;
//         //两秒后变回正常标题
//         titleTime = setTimeout(function () {
//             document.title = OriginTitile;
//         }, 2000);
//     }
// });


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
	var old_data = get_music('kugou', '6222311');
    if (window.ap != null) {
        window.ap.pause();
    };
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
	var old_data = get_music('wyy', '7480897649');
    if (window.ap != null) {
        window.ap.pause();
    };
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
	var old_data = get_music('qqmusic', '8672698451');
	var new_data = get_music_json();
     var n_data = add_music(old_data, new_data);

    	if (window.ap != null) {
        window.ap.pause();
    };
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
    var url = 'https://qcloud.app966.cn/music_json/music_json.txt';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.send(null);
    var data = JSON.parse(xhr.responseText);
    return data;
}

function get_music(server, id) {
    /* 获取音乐列表，只支持列表 */
    var url = 'https://api2.52jan.com/music/songlist';
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, false);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send('server=' + server + '&id=' + id);
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


function api_statistics() {
	/* api统计信息 */
    var url = 'https://api2.52jan.com/api_statistics';
    var xhr = new XMLHttpRequest();
    var time = new Date();
    var time1 = time.toLocaleDateString();
    var time2 = (time.getTime() - new Date(time1).getTime()) / 1000;
    xhr.open('POST', url, false);
    xhr.send(null);
    var e = JSON.parse(xhr.responseText);
    let t = ["音乐", "其它", "快手", "24h平均并发/s", "今日总调用"]
        , o = [String(e.music), String(e.custom), String(e.ks), String((e.total/time2).toFixed(2)), String(e.total)]
        , n = [0, 1, 2, 3, 4]
        , l = "";
    o = o.map((e => e.replace(/(<\/span><span>)/g, "").replace(/(<\/span><\/p>)/g, "")));
    for (var i = 0; i < t.length; i++) {
        l += "<div><span>" + t[n[i]] + '</span><span class="num">' + o[n[i]] + "</span></div>";
    }
    document.querySelectorAll("#statistic .content")[0].innerHTML = l
}


function whenDOMReady() {
    if (location.pathname.includes('charts')) {
        api_statistics();
    }
    if (location.pathname.includes('music')) {
        aplayer3();
    }
}
whenDOMReady();
