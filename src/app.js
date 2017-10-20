var app = require('express')();
var fs = require('fs');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
var options = {
    pfx: fs.readFileSync(path.resolve(__dirname, '..') + '/bin/keys/server.pfx'),
    passphrase: 'shuoba'
};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(options, app);
var PORT = 3000;
var SSLPORT = 3001;

var httpServerLister = httpServer.listen(PORT, function() {
    var host = httpServerLister.address().address;
    host = host === '::' ? 'localhost' : host;
    console.log('');
    console.log('HTTP Server is running on: http://%s:%s', host, PORT);
    console.log('See demo in: http://%s:%s/%s', host, PORT, 'demos.html');
});
var httpsServerLister = httpsServer.listen(SSLPORT, function() {
    var host = httpsServerLister.address().address;
    host = host === '::' ? 'localhost' : host;
    console.log('');
    console.log('HTTPS Server is running on: https://%s:%s', host, SSLPORT);
    console.log('See demo in: https://%s:%s/%s', host, SSLPORT, 'demos.html');
});

module.exports = app;
