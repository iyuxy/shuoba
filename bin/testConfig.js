/**
 * 校验配置信息
 * @param  {object} config 配置信息
 */

var u = require('underscore');

var testConfig = function(config) {
    var mustStr = ['MongoClient', 'DB_CONN_STR', 'collection'];
    var errorFlag = false;
    u.each(mustStr, function (item) {
        if (!config[item]) {
            console.log('Error: miss config for ' + item + 'in config.js');
            errorFlag = true;
        }
    });
    if (errorFlag) {
        throw('fatal Error, miss import config');
    }
};

module.exports = testConfig;