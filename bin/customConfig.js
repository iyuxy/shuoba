var customConfig = {
    url: 'https://www.iyuxy.com',
    title: '喻小右',
    poweredby: '喻小右正在使用说吧',
    showItem: {
        name: true,
        email: true,
        website: true
    },
    personEmail: '**',
    sendEmail: true,
    mail: {
        from: 'shuoba@iyuxy.com',
        options: {
            host: 'smtp.exmail.qq.com',
            port: 25,
            auth: {
                user: '**',
                pass:  '**'
            }
        }
    }
};

module.exports = customConfig;