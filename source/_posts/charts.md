---
title: Butterfly博客文章统计图详细教程
tags:
  - Butterfly
  - 教程
categories:
  - Butterfly
keywords: Butterfly博客文章统计图
cover: /temp/img/Maite_Adobe.jpg
abbrlink: 2e3b06de
date: 2022-07-26 06:46:06
---

# 前言

- Q: 这么多教程为啥还要写这个呢？
- A：主要是因为他有坑（逼死强迫症的那种），安装过程可以转到[Eurkon](https://blog.eurkon.com/post/1213ef82.html)的博客，当然我这里也会写

# 安装

## 新建 charts 页面

```
hexo new page charts
```

## 引入 ECharts.js
- 修改主题下的`_config.yml`文件，在inject 配置项中引入`echart.js`文件，注意必须放在第一个。

```yml
inject:
  head:
    - <script src="https://npm.elemecdn.com/echarts@4.9.0/dist/echarts.min.js"></script>
```

## 文章统计代码
- 在主题下的` /scripts/helpers/ `目录下新建`charts.js`文件。

```JavaScript
const cheerio = require('cheerio')
const moment = require('moment')

hexo.extend.filter.register('after_render:html', function (locals) {
  const $ = cheerio.load(locals)
  const post = $('#posts-chart')
  const tag = $('#tags-chart')
  const category = $('#categories-chart')
  const htmlEncode = false

  if (post.length > 0 || tag.length > 0 || category.length > 0) {
    if (post.length > 0 && $('#postsChart').length === 0) {
      if (post.attr('data-encode') === 'true') htmlEncode = true
      post.after(postsChart(post.attr('data-start')))
    }
    if (tag.length > 0 && $('#tagsChart').length === 0) {
      if (tag.attr('data-encode') === 'true') htmlEncode = true
      tag.after(tagsChart(tag.attr('data-length')))
    }
    if (category.length > 0 && $('#categoriesChart').length === 0) {
      if (category.attr('data-encode') === 'true') htmlEncode = true
      category.after(categoriesChart())
    }

    if (htmlEncode) {
      return $.root().html().replace(/&amp;#/g, '&#')
    } else {
      return $.root().html()
    }
  } else {
    return locals
  }
}, 15)

function postsChart (startMonth) {
  const startDate = moment(startMonth || '2022-04')
  const endDate = moment()

  const monthMap = new Map()
  const dayTime = 3600 * 24 * 1000
  for (let time = startDate; time <= endDate; time += dayTime) {
    const month = moment(time).format('YYYY-MM')
    if (!monthMap.has(month)) {
      monthMap.set(month, 0)
    }
  }
  hexo.locals.get('posts').forEach(function (post) {
    const month = post.date.format('YYYY-MM')
    if (monthMap.has(month)) {
      monthMap.set(month, monthMap.get(month) + 1)
    }
  })
  const monthArr = JSON.stringify([...monthMap.keys()])
  const monthValueArr = JSON.stringify([...monthMap.values()])

  return `
  <script id="postsChart">
    var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
    var postsChart = echarts.init(document.getElementById('posts-chart'), 'light');
    var postsOption = {
      title: {
        text: '文章发布统计图',
        x: 'center',
        textStyle: {
          color: color
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        name: '',
        type: 'category',
        boundaryGap: false,
        nameTextStyle: {
          color: color
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: color,
          interval: 0,
          rotate: 0
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        },
        data: ${monthArr}
      },
      yAxis: {
        name: '文章篇数',
        type: 'value',
        nameTextStyle: {
          color: color
        },
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: color
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        }
      },
      series: [{
        name: '文章篇数',
        type: 'line',
        smooth: true,
        lineStyle: {
            width: 0
        },
        showSymbol: false,
        itemStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgba(1, 191, 236)'
          }])
        },
        areaStyle: {
          opacity: 1,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(128, 255, 165)'
          }, {
            offset: 1,
            color: 'rgba(1, 191, 236)'
          }])
        },
        data: ${monthValueArr},
        markLine: {
          data: [{
            name: '平均值',
            type: 'average',
            label: {
              color: color
            }
          }]
        }
      }]
    };
    postsChart.setOption(postsOption);
    setpRotate();
    window.addEventListener('resize', () => { 
      setpRotate();
      postsChart.resize();
    });
    function setpRotate() {
      let postsOptionNew = postsOption
      if (document.body.clientWidth<=768) {
        postsOptionNew.xAxis.axisLabel.rotate = 40
      }else{
        postsOptionNew.xAxis.axisLabel.rotate = 0
      }
      postsChart.setOption(postsOptionNew)
    }
  </script>`
}

function tagsChart (len) {
  const tagArr = []
  hexo.locals.get('tags').map(function (tag) {
    tagArr.push({ name: tag.name, value: tag.length })
  })
  tagArr.sort((a, b) => { return b.value - a.value })

  const dataLength = Math.min(tagArr.length, len) || tagArr.length
  const tagNameArr = []
  const tagCountArr = []
  for (let i = 0; i < dataLength; i++) {
    tagNameArr.push(tagArr[i].name)
    tagCountArr.push(tagArr[i].value)
  }
  const tagNameArrJson = JSON.stringify(tagNameArr)
  const tagCountArrJson = JSON.stringify(tagCountArr)

  return `
  <script id="tagsChart">
    var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
    var tagsChart = echarts.init(document.getElementById('tags-chart'), 'light');
    var tagsOption = {
      title: {
        text: 'Top ${dataLength} 标签统计图',
        x: 'center',
        textStyle: {
          color: color
        }
      },
      tooltip: {},
      xAxis: {
        name: '',
        type: 'category',
        nameTextStyle: {
          color: color
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: color,
          interval: 0
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        },
        data: ${tagNameArrJson}
      },
      yAxis: {
        name: '文章篇数',
        type: 'value',
        splitLine: {
          show: false
        },
        nameTextStyle: {
          color: color
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          color: color
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: color
          }
        }
      },
      series: [{
        name: '文章篇数',
        type: 'bar',
        data: ${tagCountArrJson},
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(128, 255, 165)'
          },
          {
            offset: 1,
            color: 'rgba(1, 191, 236)'
          }])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(128, 255, 195)'
            },
            {
              offset: 1,
              color: 'rgba(1, 211, 255)'
            }])
          }
        },
        markLine: {
          data: [{
            name: '平均值',
            type: 'average',
            label: {
              color: color
            }
          }]
        }
      }]
    };
    tagsChart.setOption(tagsOption);
    setRotate();
    window.addEventListener('resize', () => { 
      setRotate();
      tagsChart.resize();
    });
    function setRotate() {
      let tagsOptionNew = tagsOption
      if (document.body.clientWidth<=768) {
        tagsOptionNew.xAxis.axisLabel.rotate = -90
      }else{
        tagsOptionNew.xAxis.axisLabel.rotate = 40
      }
      tagsChart.setOption(tagsOptionNew)
    }

    tagsChart.on('click', 'series', (event) => {
      if(event.name != '平均值'){
        let href = '/tags/' + event.name + '/';
        window.location.href = href;
      }
    });
  </script>`
}

function categoriesChart () {
  const categoryArr = []
  hexo.locals.get('categories').map(function (category) {
    categoryArr.push({ name: category.name, value: category.length })
  })
  categoryArr.sort((a, b) => { return b.value - a.value });
  const categoryArrJson = JSON.stringify(categoryArr)

  return `
  <script id="categoriesChart">
    var color = document.documentElement.getAttribute('data-theme') === 'light' ? '#4c4948' : 'rgba(255,255,255,0.7)'
    var categoriesChart = echarts.init(document.getElementById('categories-chart'), 'light');
    var categoriesOption = {
      title: {
        text: '文章分类统计图',
        x: 'center',
        textStyle: {
          color: color
        }
      },
      legend: {
        top: 'bottom',
        type: 'scroll',
        textStyle: {
          color: color
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      series: [{
        name: '文章篇数',
        type: 'pie',
        radius: [30, 80],
        center: ['50%', '50%'],
        roseType: 'area',
        label: {
          color: color,
          formatter: '{b} : {c} ({d}%)'
        },
        data: ${categoryArrJson},
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 255, 255, 0.5)'
          }
        }
      }]
    };
    categoriesChart.setOption(categoriesOption);
    window.addEventListener('resize', () => { 
      categoriesChart.resize();
    });
    categoriesChart.on('click', 'series', (event) => {
      let href = '/categories/' + event.name + '/';
      window.location.href = href;
    });
  </script>`
}
```
## 使用统计图

在第一次创建charts的页面下的`index.md`文件中添加以下内容：

```html
<!-- 文章发布时间统计图 -->
<div id="posts-chart" data-start="2021-01" style="border-radius: 8px; height: 300px; padding: 10px;"></div>
<!-- 文章标签统计图 -->
<div id="tags-chart" data-length="10" style="border-radius: 8px; height: 300px; padding: 10px;"></div>
<!-- 文章分类统计图 -->
<div id="categories-chart" style="border-radius: 8px; height: 300px; padding: 10px;"></div>
```
# 解决坑

## 适配Butterfly主题的明暗模式

- 这里就不要看他的教程了因为有坑
- 在主题文件下的` /source/ `目录内新建一个自定义js，名字随意，例如我的是 `/source/js/app966.js`,内容如下：

```JavaScript
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
```

## 引入自定义的js

- 修改主题下的`_config.yml`文件，在inject 配置项中引入`app966.js`文件。
- 注意事项：如果你在主题的`_config.yml`文件中打开了`pjax`务必使用`defer data-pjax`引入，否则`defer`即可；
- 否则会导致每次都要刷新才正常切换。

```yml
inject:
  head:
  bottom:
    - <script defer data-pjax src="/js/app966.js"></script>
```

## 点击平均值跳404的问题
- 如果你用的我上面的`文章统计代码`则可跳过此处。
- 删除文章统计代码第`281-282行`，添加下面代码覆盖即可。
- 否则会导致跳转404的问题。

```JavaScript
if(event.name != '平均值'){
        let href = '/tags/' + event.name + '/';
        window.location.href = href;
      }
```
## 解决标签统计图问题

- 如果你用的我上面的`文章统计代码`则可跳过此处。
- 在js代码中找到`标签统计图`下面的`axisLabel`，新增下面内容。
- 否则会导致标签统计图默认不显示所有标签文字的问题。

```diff
        axisLabel: {
          show: true,
          color: color,
+         interval: 0
```


# 结尾
- 以上步骤完毕后在博客根目录运行

```
hexo clean && hexo g
```
- 结果当然肯定是报错拉，因为你没有安装`EChart`模块，继续运行

```
npm install echarts --save
```
- 至此，所有问题都已完美解决！[看看成品效果](/charts/)
