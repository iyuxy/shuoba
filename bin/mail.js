var nodemailer = require("nodemailer");
var directTransport = require('nodemailer-direct-transport');
var validator = require('validator');
var Promise = require('bluebird')
var config = require('./config');
var u = require('underscore');

var path = require('path');
var fs = require('fs');
var templatesDir = path.resolve(__dirname, '.', 'email-templates');
var htmlToText = require('html-to-text');

function  shuoBaMailer() {
    var self = this;
    if (config.mail.options && config.mail.options.auth) {
        self.direct = false;
        this.transport = nodemailer.createTransport(config.mail.options, {});
    }
    else {
        self.direct = true;
        self.transport = nodemailer.createTransport(directTransport());
    }
}

shuoBaMailer.prototype.getDomain = function () {
    var domain = config.url.match(new RegExp('^https?://([^/:?#]+)(?:[/:?#]|$)', 'i'));
    return domain && domain[1];
}

shuoBaMailer.prototype.from = function () {
    if (this.direct === false) {
        return config.title + '<' + config.mail.options.auth.user + '>';
    }

    var from = config.mail && (config.mail.from || config.mail.fromaddress);

    // If we don't have a from address at all
    if (!from) {
        // Default to shuoba@[blog.url]
        from = 'shuoba@' + this.getDomain();
    }

    // If we do have a from address, and it's just an email
    if (validator.isEmail(from)) {
        if (!config.title) {
            config.title = 'shuoba at ' + this.getDomain();
        }
        from = '"' + config.title + '" <' + from + '>';
    }

    return from;
};

shuoBaMailer.prototype.feedBack = function (type, message) {
    var feedBack = {
        success: type,
        message: message
    };
    console.log(feedBack)
    return feedBack;
};

shuoBaMailer.prototype.send = function (message) {
    var self = this,
    message = message || {};
    var to = message.to || false;
    
    if (!self.transport) {
        return self.feedBack(false, 'Email Error: No e-mail transport configured.');
    }
    if (!(message && message.subject && message.html && message.to)) {
        var message = self.feedBack(false, 'Email Error: Incomplete message data.');
        return message;
    }

    message = u.extend(message, {
        from: self.from(),
        to: to,
        generateTextFromHTML: true,
        encoding: 'base64'
    });

    return new Promise(function (resolve, reject) {
        self.transport.sendMail(message, function (error, response) {
            if (error) {
                return reject(self.feedBack(false, error));
            }

            if (self.transport.transportType !== 'DIRECT') {
                 return resolve(self.feedBack(true, response));
            }

            response.statusHandler.once('failed', function (data) {
                var reason = 'Email Error: Failed sending email。。。。';

                if (data.error && data.error.errno === 'ENOTFOUND') {
                    reason += ': there is no mail server at this address: ' + data.domain;
                }
                reason += '.';
                return reject(self.feedBack(false, reason));
            });

            response.statusHandler.once('requeue', function (data) {
                var errorMessage = 'Email Error: message was not sent, requeued. Probably will not be sent. :(';

                if (data.error && data.error.message) {
                    errorMessage += '\nMore info: ' + data.error.message;
                }

                return reject(self.feedBack(false, errorMessage));
            });

            response.statusHandler.once('sent', function () {
                return resolve(self.feedBack(true, 'Message was accepted by the mail server. Make sure to check inbox and spam folders. :)'));
            });
        });
    });
};


shuoBaMailer.prototype.sendTest = function (options) {
    var self = this;
    return generateContent({template: 'test'}).then(function (emailContent) {
        var message = {
            to: options.to,
            subject: 'Test shuoba Email',
            html: emailContent.html,
            text: emailContent.text,
            watchHtml: emailContent.html
        };
        return self.send(message);
    }, function (error) {
        // console.log(error);
    });
};

shuoBaMailer.prototype.commentNotice = function (options) {
    var self = this;
    var options = u.extend({template: 'notice'}, options);
    return generateContent(options).then(function (emailContent) {
        var message = {
            to: options.to,
            subject: '说吧新评论提醒',
            html: emailContent.html,
            text: emailContent.text,
            watchHtml: emailContent.html
        };
        return self.send(message);
    }, function (error) {
        console.log(error);
    });
};

shuoBaMailer.prototype.mailToOwner = function (options) {
    var self = this;
    var options = u.extend({template: 'commentMail', siteName: config.title}, options);
    return generateContent(options).then(function (emailContent) {
        var message = {
            to: config.personEmail,
            subject:  config.title + '说吧新评论提醒',
            html: emailContent.html,
            text: emailContent.text,
            watchHtml: emailContent.html
        };
        return self.send(message);
    }, function (error) {
        console.log(error);
    });
};

var generateContent = function (options) {
    var defaultData = {
        siteUrl: config.url || 'test'
    };

    var emailData = u.defaults(defaultData, options);
    u.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    // read the proper email body template
    return new Promise(function (resolve, reject) {
        fs.readFile(templatesDir + '/' + options.template + '.html', {encoding: 'utf8'}, function (error, fileContent) {
            if (error) {
                reject(error);
            }

            var compiled = u.template(fileContent);
            // insert user-specific data into the email
            var htmlContent = compiled(emailData);

            // generate a plain-text version of the same email
            var textContent = htmlToText.fromString(htmlContent);
            resolve({
                html: htmlContent,
                text: textContent
            });
        });
    });
};

module.exports = new shuoBaMailer();
