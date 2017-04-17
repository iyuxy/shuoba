var app = require('express')();
var fs = require('fs');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var path = require('path')
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
    var host = httpServerLister.address().address
    console.log('HTTP Server is running on: http://%s:%s', host, PORT);
});
var httpsServerLister = httpsServer.listen(SSLPORT, function() {
    var host = httpsServerLister.address().address
    console.log('HTTPS Server is running on: https://%s:%s', host, SSLPORT);
});

module.exports = app;
