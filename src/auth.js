var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var qs = require('querystring');
var request = require('request');
var randomString = require('randomstring');
var app = require('./app');
var refer = '/user';

const githubConf = {
    clientID:'1f0469e139480179ec47',
    clientSecret:'081f438a3a007ee39825fdc7e7bf0c45dd804148',
    callbackURL:'https://localhost:3001/auth/github/callback'
}

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'iyuxy',
    cookie: {
        maxAge: 36000000 /*单位：毫秒*/
    },
    store: new SQLiteStore
}));


var isAuthenticated = function(req, res, next) {	
    if (req.isAuthenticated() || (req.user && req.user.provider)) {
        return next();
    }
    res.redirect('/auth/github');
}


app.get('/auth/github', function (req, res, next) {
    req.session.csrf_string = randomString.generate();
    refer = req.headers.referer;
    let githubAuthUrl =
        'https://github.com/login/oauth/authorize?' +
        qs.stringify({
            client_id: githubConf.clientID,
            redirect_uri: githubConf.callbackURL,
            state: req.session.csrf_string
        });
    res.redirect(githubAuthUrl);
});

app.get('/auth/github/callback', function (req, res, next) {
    const code = req.query.code;
    const returnedState = req.query.state;
    if (req.session.csrf_string === returnedState) {
        request.post({
            url: 'https://github.com/login/oauth/access_token?' +
            qs.stringify({
                client_id: githubConf.clientID,
                client_secret:githubConf.clientSecret,
                code: code,
                redirect_uri: githubConf.callbackURL,
                state: req.session.csrf_string
            })
        },
        function (error, response, body) {
            if (error !== null) {
                res.send(error)
            }
            req.session.access_token = qs.parse(body).access_token;
            res.redirect(refer);
        });
    }
    else {
        res.redirect('/auth/github');
    }
});

app.use('/user', function(req, res) {
    if (req.session.userInfo !== null
        && req.session.userInfo !== 'undefined'
        && req.session.userInfo !== undefined
        && req.session.userInfo !== '') {
        res.send(JSON.parse(req.session.userInfo));
    }
    else if (req.session.access_token === null
        || req.session.access_token === 'undefined'
        || req.session.access_token === undefined) {
            res.send({
                code: 403
            });
    }
    else {
        request.get({
            url: 'https://api.github.com/user',
            headers: {
                Authorization: 'token ' + req.session.access_token,
                'User-Agent': 'Login'
            }
        }, function (error, response, body){
            if (error !== null) {
                res.send({
                    code: 403
                })
            }
            else {
                var returnObj = {};
                body = JSON.parse(body);
                if (body.email === null) {
                    let info = body;
                    request.get({
                        url: 'https://api.github.com/user/public_emails',
                        headers: {
                            Authorization: 'token ' + req.session.access_token,
                            'User-Agent': 'Login'
                        }
                    }, function (error, response, body) {
                        body = JSON.parse(body);
                        if (error === null) {
                            info.email = body[0].email || '';
                            returnString = JSON.stringify({
                                nickname: info.login,
                                avatar_url: info.avatar_url,
                                website: info.blog || info.html_url,
                                email: info.email
                            });
                            req.session.userInfo = returnString;
                            res.send(returnString)
                        }
                        else {
                            returnString = JSON.stringify({
                                nickname: info.login,
                                avatar_url: info.avatar_url,
                                website: info.blog || info.html_url,
                                email: info.email
                            });
                            req.session.userInfo = returnString;
                            res.send(returnString);
                        }
                    })
                }
                else {
                    returnString = JSON.stringify({
                        nickname: body.login,
                        avatar_url: body.avatar_url,
                        website: body.blog || body.html_url,
                        email: body.email
                    });
                    req.session.userInfo = returnString;
                    res.send(returnString)
                }
            }
        });
    }
});
