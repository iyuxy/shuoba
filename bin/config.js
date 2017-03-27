var MongoClient = require('mongodb').MongoClient;

var shuobaConfig = {
    MongoClient: MongoClient,
    DB_CONN_STR : 'mongodb://localhost:27017/iyuxy',
    collection: 'shuoba'
};

module.exports = shuobaConfig;