## 使用MongDB保存评论数据

**在安装前请先在你的server上安装好mongoDB，并启动**

#### 第一步：下载代码
```shell
 git clone https://github.com/yuyouwen/shuoba.git
```


#### 第二步：安装依赖
```shell
cd shuoba && npm install
```

#### 第三步：添加mongoDB配置

打开bin/config.js文件，修改mongoDB地址和collection地址
```javascript
var shuobaConfig = {
    MongoClient: MongoClient,
    DB_CONN_STR : 'mongodb://localhost:27017/iyuxy',
    collection: 'shuoba'
};
```

#### 第三步：修改基础配置

打开`bin/customConfig.js`文件，修改站点地址(url)和邮件(personEmail)相关配置

```javascript
var customConfig = {
    // 网站地址
    url: 'https://www.iyuxy.com',
    title: '喻小右',
    poweredby: '喻小右正在使用说吧',
    // 接受邮件通知邮箱
    personEmail: '962608051@qq.com',
    sendEmail: true,
    // 邮件配置
    mail: {
        from: 'shuoba@iyuxy.com'
        // 如不提供，将使用node启动邮件程序
        options: {
        	host: 'smtp.exmail.qq.com',
            port: 25,
            auth: {
            	// qq邮箱地址
               	user: '96232**222@qq.com', 
               	// qq邮箱密码
                pass:  '****'
            }
        }
    }
};
```

#### 第四步：启动应用

```shell
npm start
```

#### 第五步：在浏览器中打开demo示例

```
https://localhost:3001/demos.html
```

