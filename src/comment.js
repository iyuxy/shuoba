/**
 * @file 处理评论数据
 * @author darrenywyu
 */

// change to false to use MongoDB
const USE_SQLITE = true;

let DB_UTIL = {};

if (USE_SQLITE) {
	var easySqlite3 = require('easy-sqlite3');
	DB_UTIL = new easySqlite3({
	    // 数据文件存放路径,相对于运行根目录
	    path: 'db',
	    // 数据库名称
	    database: 'iyuxy',
	    // 表名称
	    table: 'comments',
	    // select字段，支持使用[]配置多个字段进行查询
	    key: ['pageId'],
	    // 表结构示例
	    column: {
	        _id: 'TEXT',
	        title: 'TEXT',
	        url: 'TEXT',
	        pageId: 'INTEGER',
	        email: 'TEXT',
	        nickname: 'TEXT',
	        comment: 'TEXT',
	        website: 'TEXT',
	        parentId: 'TEXT',
	        time: 'INTEGER'
	    }
	});
}
else {
	DB_UTIL = require('../bin/util');
}


var comment = function () {};

comment.prototype.getComment = function (query, callback, errorCallback) {
    DB_UTIL.selectData(query, callback, errorCallback);
};

comment.prototype.insertComment = function (data, callback, errorCallback) {
    DB_UTIL.insertData(data, callback, errorCallback);
};

module.exports = new comment();