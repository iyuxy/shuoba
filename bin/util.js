/**
 * 数据库操作工具库
 */


var baseConfig = require('./config');
var testConfig = require('./testConfig');

// 判断基础配置
testConfig(baseConfig);

// 插入数据
var insertData = function (data, callback, errorcallback) {
    connectDB(function (db) {
        //连接到对应数据表
        var collection = db.collection(baseConfig.collection);
        //插入数据
        collection.insert(data, function(err, result) { 
            if (err && typeof errorcallback === 'function') {
                errorcallback(err);
                return;
            }
            else if (err) {
                console.log('insertError:' + err);
            }
            callback(result);
        });
    });
};

// 查询数据
var selectData = function (whereStr, callback, errorcallback) {
    connectDB(function (db) {
        //连接到表  
        var collection = db.collection(baseConfig.collection);
        //查询数据
        collection.find(whereStr).toArray(function(err, result) {
            if (err && typeof errorcallback === 'function') {
                errorcallback(err);
                return;
            }
            else if (err) {
                console.log('selectError:' + err);
            }  
            callback(result);
        });
    });
};

// 更新数据
var updateData = function(whereStr, updateStr, callback, errorcallback) {
    connectDB(function () {
        //连接到表  
        var collection = db.collection(baseConfig.collection);
        //更新数据
        collection.update(whereStr, updateStr, function(err, result) {
            if (err && typeof errorcallback === 'function') {
                errorcallback(err);
                return;
            }
            else if (err) {
                console.log('updateError:' + err);
            }
            callback(result);
        });
    });
};

// 删除数据
var delData = function(whereStr, callback, errorcallback) {
    connectDB(function (db) {
        //连接到表  
        var collection = db.collection(baseConfig.collection);
        //删除数据
        collection.remove(whereStr, function(err, result) {
            if (err && typeof errorcallback === 'function') {
                errorcallback(err);
                return;
            }
            else if (err) {
                console.log('deleteError:' + err);
            }
            callback(result);
        });
    });
};

var connectDB = function (callback) {
    baseConfig.MongoClient.connect(baseConfig.DB_CONN_STR, function(err, db) {
        if (err) {
            console.log('Some error happend while connect to db');
        }
        callback(db);
        db.close();
    });
};

var util = {
    insertData: insertData,
    selectData: selectData,
    updateData: updateData,
    delData: delData
};

module.exports = util;
