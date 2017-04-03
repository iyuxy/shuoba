var util  = require('../bin/util');

var comment = function () {

}

comment.prototype.getComment = function (query, callback) {
    util.selectData(query, callback);
};


comment.prototype.insertComment = function (data, callback) {
    util.insertData(data, callback);
};

module.exports = new comment();