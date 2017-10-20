# shouba 
![travis](https://travis-ci.org/yuyouwen/shuoba.svg?branch=master)   ![coverity](https://scan.coverity.com/projects/14065/badge.svg)

A useful comment system for blog or homepage

## Overview
![overview](./assets/overview.png)

## Features

* 跨终端的评论框&评论列表样式
* 留言按层级展示
* 评论和回复邮件提醒
* 支持https

## Install

> 当前版本依赖mongoDB，所以在安装前请先安装好mongoDB，下一个版本会基于SQLite适配。

```shell
 git clone https://github.com/yuyouwen/shuoba.git
```

## Quick Start
#### 第一步：安装依赖
```shell
npm install
```
#### 第二步：修改MongDB配置
打开bin/config.js文件，修改mongoDB地址和collection地址
```javascript
var shuobaConfig = {
    MongoClient: MongoClient,
    DB_CONN_STR : 'mongodb://localhost:27017/iyuxy',
    collection: 'shuoba'
};
```
#### 第二步：修改基础配置
打开bin/customConfig.js文件，修改站点地址和邮件相关配置
```javascript
var shuobaConfig = {
    MongoClient: MongoClient,
    DB_CONN_STR : 'mongodb://localhost:27017/iyuxy',
    collection: 'shuoba'
};
```

### 第三步：启动应用

```shell
npm start
```
