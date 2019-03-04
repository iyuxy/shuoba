/**
 * mongoDB 配置文件
 * @param  none
 */

var MongoClient = require('mongodb').MongoClient;
var customConfig = require('./customConfig');
var u = require('underscore');

var shuobaConfig = {
    MongoClient: MongoClient,
    DB_CONN_STR : 'mongodb://localhost:port/db',
    collection: 'collection'
};

shuobaConfig = u.extend(shuobaConfig, customConfig);

module.exports = shuobaConfig;