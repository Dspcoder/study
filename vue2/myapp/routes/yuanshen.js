var express = require('express');
var router = express.Router();
let getcon = require('./dbutil');
let jwt = require('../jwt/index.js');
router.use(jwt);

/**
 * 查
 * @pageNum 当前页
 * @pageSize 一页多少条
 * @name 名称
 */
router.get('/check', function (req, res, next) {
    // let sql = 'SELECT * FROM students'
    let db = getcon();
    db.connect();
    // 当前页
    let pageNum = req.query.pageNum - 0;
    // 页面条数
    let pageSize = req.query.pageSize - 0; //传过来的是个字符串 -0把他变成数字
    // 起始条数
    let start = (pageNum - 1) * pageSize;

    let sql = `SELECT * FROM yuanshen`;
    let sql2;
    let count;
    if (req.query.name) {
        sql2 = `SELECT COUNT(*) FROM yuanshen where name like '%${req.query.name}%'`;
        sql += ` where name like '%${req.query.name}%' LIMIT ${start},${pageSize}`;
    } else {
        sql2 = 'SELECT COUNT(*) FROM yuanshen';
        sql += ` LIMIT ${start},${pageSize}`;
    }
    db.query(sql2, null, (err, results) => {
        count = results[0]['COUNT(*)'];
        console.log(count);
    });
    db.query(sql, [start, pageSize], (err, results) => {
        console.log(results);
        console.log(count);
        if (err) {
            res.send({
                code: 500,
                msg: '查询失败'
            });
        } else {
            res.send({
                code: 200,
                msg: '查询成功',
                results,
                total: count
            });
        }
    });
});

/**
 * 新增学生
 * @name 名字
 * @imgurl 图片
 *
 */
router.post('/add', function (req, res, next) {
    if (!req.body.name) {
        res.send({
            code: 101,
            msg: '名称不能为空'
        });
        return;
    } else if (!req.body.imgUrl) {
        res.send({
            code: 101,
            msg: '图片不能为空'
        });
        return;
    }
    let db = getcon();
    db.connect();
    let sql = 'INSERT INTO yuanshen (name, imgUrl) VALUES (?,?)';
    db.query(sql, [req.body.name, req.body.imgUrl], function (error, results) {
        if (error) {
            res.send({
                code: 500,
                data: '添加失败(名称已存在)'
            });
            return;
        }
        res.send({
            code: 200,
            data: '添加成功'
        });
        db.end();
    });
});

module.exports = router;
