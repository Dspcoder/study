const expressJwt = require('express-jwt');
const jwt = expressJwt({
    secret: 'wwj',
    algorithms: ['HS256']
}).unless({
    //不需要token的接口
    path: ['/login', '/registered', '/updata', '/upload','/type/check','/type/add','/type/edit','/type/delete',]
});

module.exports = jwt;
