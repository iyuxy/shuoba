var util  = require('../bin/util');

util.insertData({"name":"xx", "url":"xx.com"}, function (result) {
    console.log(result)
}, function (err) {
    console.log(err);
});