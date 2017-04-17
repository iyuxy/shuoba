var util  = require('../bin/util');

var mailer  = require('../bin/mail');

var comment = require('./comment');

var validator = require('validator');

var app = require('./app');

var counter = 0x861005;

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
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.end(JSON.stringify(data));
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
      comment: req.body.comment,
      parentId: req.body.parentId || '0'
    };
    commentContent._id = commentContent.pageId + '' + new Date().getTime() + counter ++;
    if (commentContent.parentId !== '0') {
      if (validator.isEmail(commentContent.from)) {
        comment.getComment({pageId: commentContent.pageId, _id: commentContent.parentId}, function (data) {
          data = data[0];
          mailer.commentNotice({
            to: data.from,
            nickName: data.nickname,
            fromNickName: commentContent.nickname,
            title: data.title,
            pageUrl: commentContent.url
          });
        });
      }
    }

    if (validator.isEmail(commentContent.from)) {
      mailer.mailToOwner({
          fromNickName: commentContent.nickname,
          title: commentContent.title,
          pageUrl: commentContent.url
      });
    }

    var resContent = {
        success: true,
        data: ''
    };
    comment.insertComment(commentContent, function () {
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
        res.end(JSON.stringify(resContent));
    }, function () {
        res.status(503).end();
    });
})
