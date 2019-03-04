/**
 * 用户配置文件
 * @param  none
 */

var customConfig = {
    url: 'https://www.iyuxy.com',
    title: '喻小右',
    poweredby: '喻小右正在使用说吧',
    showItem: {
        name: true,
        email: true,
        website: true
    },
    personEmail: 'xx@qq.com',
    sendEmail: true,
    mail: {
        from: 'xx@iyuxy.com',
        options: {
             host: 'smtp.exmail.qq.com',
            port: 25,
             auth: {
             }
         }
    }
};

module.exports = customConfig;