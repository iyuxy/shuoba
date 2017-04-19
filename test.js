var nodemailer = require("nodemailer");  
var u = require('underscore');
var config  = {  
    options: {
        host: 'smtp.exmail.qq.com',
        port: 25,
        auth: {
            user: 'shuoba@iyuxy.com',
            pass:  'YYWjn25sl!!!'
        }
    }
}
var transport = nodemailer.createTransport(config.options, {});  
var message = {  
    // 收件人
    to: 'yuyouwen@baidu.com',

    // 邮件主题
    subject: 'test email', //

    // 内容
    text: 'Hello wolrd!',

    // 内容
    html: '<p>Hello world！</p>',

    // Apple Watch specific HTML body
    watchHtml: '<p>Hello world<p>',
}

message = u.extend(message, {
        from: 'shuoba@iyuxy.com',
        generateTextFromHTML: true,
        encoding: 'base64'
});

transport.sendMail(message, function (error, response) {  
    if (error) {
        console.log(error);
    }
    else {
         console.log(response);
    }
});
