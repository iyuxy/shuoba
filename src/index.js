var util  = require('../bin/util');

var mailer  = require('../bin/mail');

var comment = require('./comment');

var app = require('./app');

// mailer.send({
//     to: 'xx@mail.com',

//     subject: 'Test shuoba Email',
//     // plaintext body
//     text: 'Hello World!',

//     // HTML body
//     html: '<p>hello world</p>' +
//         '<p></p>',

//     // Apple Watch specific HTML body
//     watchHtml: '<b>Hello</b> to myself',
// }).then(function (data) {
//     console.log(data);
// }, function (error) {
//     console.log(error);
// });
// 

// 发送测试邮件
// mailer.sendTest({
//     to: 'yuyouwen@baidu.com'
// });
// 

app.get('/comment/:id', function(req, res) {
    comment.getComment({pageId: parseInt(req.params.id, 10)}, function (data) {
        res.status(200).end(JSON.stringify(data));
    }, function (err) {
        res.status(503).end();
    });
});

app.post('/comment/:id', function (req, res) {
    var commentContent = {
       title: req.body.title,
       url: req.body.url,
       pageId: parseInt(req.params.id, 10),
       from: req.body.from,
       nickname: req.body.nickname,
       comment: req.body.comment
    };
    var resContent = {
        success: true,
        data: ''
    };
    comment.insertComment(commentContent, function () {
        res.status(200).end(JSON.stringify(resContent));
    }, function () {
        res.status(503).end();
    });
})
