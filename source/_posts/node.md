---
title: Centos安装node.js详细教程
tags:
  - Centos
  - node
  - 教程
categories:
  - Centos
keywords: Centos安装node.js
cover: /temp/img/toyota-music-factory-mural.jpg
abbrlink: '98204530'
date: 2022-08-06 14:17:15
---

# 下载node.js
1. 我使用的是`Centos7.9`
2. [进入官网](https://nodejs.org/en/download/)下载页
3. 选择下载linux-64
4. 使用淘宝镜像源下载

```
wget https://registry.npmmirror.com/-/binary/node/v16.16.0/node-v16.16.0-linux-x64.tar.xz
```

# 解压
- 复制压缩文件名，执行解压命令

```
tar -xvf node-v16.16.0-linux-x64.tar.xz
```
- 为了方便操作node的文件夹，将压缩后的文件移动到名为`node16`的文件夹，也可以根据自己的喜好来命名新文件夹

```
mv node-v16.16.0-linux-x64 node16
```
- 然后再把当前目录的`node16`目录移动到`/usr/local`目录下

```
mv node16 /usr/local
```

# 配置环境变量

```
vi /etc/profile
```
- 在文件中输入以下内容，输入`i`开始编辑

```
export NODE_HOME=/usr/local/node16
export PATH=$PATH:$NODE_HOME/bin
export NODE_PATH=$NODE_HOME/lib/node_mudules
```
1. 编写完成后按`esc`键退出编辑，然后输入`:wq`保存文件内容，输入错误就不要保存了输入`:q!`不保存退出再重新编辑
2. 使配置立即生效

```
source /etc/profile
```

# 创建软链接

```
# 创建node命令链接
ln -s /usr/local/node16/bin/node /usr/local/bin/node

# 创建npm命令链接
ln -s /usr/local/node16/bin/npm /usr/local/bin/npm
```

# 测试
- 在任意目录下输入`node -v`和`npm -v`查看版本号

```
node -v
npm -v
```

