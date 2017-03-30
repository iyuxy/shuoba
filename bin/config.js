var MongoClient = require('mongodb').MongoClient;
var customConfig = require('./customConfig');
var u = require('underscore');

var shuobaConfig = {
    MongoClient: MongoClient,
    DB_CONN_STR : 'mongodb://localhost:27017/iyuxy',
    collection: 'shuoba'
};

shuobaConfig = u.extend(shuobaConfig, customConfig);


module.exports = shuobaConfig;