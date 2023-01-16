const mysql = require('mysql'); //导入mysql模块
function getcon() {
    let connection = mysql.createConnection({
        host: 'localhost', //数据库地址
        user: 'root', //数据库用户名
        password: 'root', //数据库密码
        database: 'student' //数据库名
    });
    return connection;
}
//导出方法
module.exports = getcon;
