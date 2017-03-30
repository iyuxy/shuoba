var util  = require('../bin/util');

var mailer  = require('../bin/mail');

util.insertData({"name":"xx", "url":"xx.com"}, function (result) {
    console.log(result)
}, function (err) {
    console.log(err);
});

mailer.send({
    to: 'xx@mail.com',

    subject: 'Test shuoba Email',
    // plaintext body
    text: 'Hello World!',

    // HTML body
    html: '<p>hello world</p>' +
        '<p></p>',

    // Apple Watch specific HTML body
    watchHtml: '<b>Hello</b> to myself',
}).then(function (data) {
    console.log(data);
}, function (error) {
    console.log(error);
});

mailer.sendTest({
    to: 'xx@mail.com'
});