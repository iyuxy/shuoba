var util  = require('../bin/util');
var sqlite3Util = require('../bin/sqlite3Util');

var comment = function () {

};

comment.prototype.getComment = function (query, callback, errorCallback) {
    util.selectData(query, callback, errorCallback);
};


comment.prototype.insertComment = function (data, callback, errorCallback) {
    util.insertData(data, callback, errorCallback);
};

module.exports = new comment();