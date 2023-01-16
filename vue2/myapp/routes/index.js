var express = require('express');
var router = express.Router();
let getcon = require('./dbutil');
let jwt = require('jsonwebtoken');

let jwts = require('../jwt/index.js');
router.use(jwts);
/* GET home page. */
/**
 * 登录
 * @name 登录账号
 * @password 登录密码
 */
router.post('/login', function (req, res, next) {
    console.log(111);
    // let sql = 'SELECT * FROM students'
    let db = getcon();
    db.connect();
    let sql = 'SELECT * FROM login WHERE name=? AND password=?';
    db.query(sql, [req.body.name, req.body.password], function (error, results) {
        if (error) {
            console.log('失败了');
            return;
        }
        if (results.length > 0) {
            // 根据用户输入的账号密码以及自定义的密码字符串生成token，一天后失效
            let token = jwt.sign(req.query, 'wwj', {
                // token失效时间
                expiresIn: 60 * 60 * 24
            });
            res.send({
                code: 200,
                data: '登录成功',
                token
            });
        } else {
            res.send({
                code: 500,
                data: '用户名或密码错误'
            });
        }
        db.end();
    });
});
/**
 * 注册
 * @name 名称
 * @password 密码
 */

router.post('/registered', function (req, res, next) {
    // let sql = 'SELECT * FROM students'
    let db = getcon();
    db.connect();
    let sql = 'INSERT INTO login (name, password) VALUES (?,?)';
    db.query(sql, [req.body.name, req.body.password], function (error, results) {
        if (error) {
            res.send({
                code: 500,
                data: '注册失败(账号已注册)'
            });
            return;
        }
        res.send({
            code: 200,
            data: '注册成功'
        });
        db.end();
    });
});
/**
 * 删除
 * @id
 */
router.get('/delete', function (req, res, next) {
    // let sql = 'SELECT * FROM students'
    let db = getcon();
    db.connect();
    let sql = 'DELETE FROM login WHERE id = ?';
    db.query(sql, [req.query.id], function (error, results) {
        if (error) {
            res.send({
                code: 500,
                data: '删除失败' + error
            });
            return;
        }
        console.log(error);
        console.log(results.affectedRows);
        if (results.affectedRows.length > 0) {
            res.send({
                code: 200,
                data: '删除成功'
            });
        } else {
            res.send({
                code: 500,
                data: '删除目标不存在'
            });
        }
        db.end();
    });
});

/**
 * 修改密码
 * @password 需要修改的密码
 * @name 需要修改的账号
 */
router.put('/updata', function (req, res, next) {
    // let sql = 'SELECT * FROM students'
    let db = getcon();
    db.connect();
    let sql = 'UPDATE login SET password = ? WHERE name = ?';
    db.query(sql, [req.body.password, req.body.name], function (error, results) {
        if (error) {
            res.send({
                code: 500,
                data: '系统错误' + error
            });
            return;
        }
        console.log(results.changedRows);
        if (results.changedRows > 0) {
            res.send({
                code: 200,
                data: '修改成功'
            });
        } else {
            res.send({
                code: 500,
                data: '修改失败'
            });
        }
        db.end();
    });
});

let multiparty = require('multiparty');
let path = require('path');
router.post('/upload', function (req, res) {
    let form = new multiparty.Form({
        uploadDir: './public/upload' //指定保存上传文件的路径
    });
    form.parse(req, function (err, fields, files) {
        let key = Object.keys(files)[0]; //获取上传信息中的 key
        if (err) {
            res.send(err);
        } else {
            res.send({
                status: 1,
                url: path.basename(files[key][0].path)
            }); //根据 key 获取上传的文件名并返回
        }
    });
});

module.exports = router;
