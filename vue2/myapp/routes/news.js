var express = require('express');
var router = express.Router();
let getcon = require('./dbutil');
let jwt = require('../jwt/index.js');
router.use(jwt);
/**
 * 查
 * @pageNum 当前页
 * @pageSize 一页多少条
 * @title 标题
 */
router.get('/check', function (req, res, next) {
    console.log(req);
    // let sql = 'SELECT * FROM students'
    let db = getcon();
    db.connect();
    // 当前页
    let pageNum = req.query.pageNum - 0;
    // 页面条数
    let pageSize = req.query.pageSize - 0; //传过来的是个字符串 -0把他变成数字
    // 起始条数
    let start = (pageNum - 1) * pageSize;

    let sql = `SELECT * FROM news`;
    let sql2;
    let count;
    if (req.query.title) {
        sql2 = `SELECT COUNT(*) FROM news where title like '%${req.query.title}%'`;
        sql += ` where title like '%${req.query.title}%' LIMIT ${start},${pageSize}`;
    } else {
        sql2 = 'SELECT COUNT(*) FROM news';
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
 * 新增新闻
 * @title 新闻标题
 * @info 新闻内容
 * @time 新闻时间
 * @author 作者
 * @imgUrl 图片地址
 */
router.post('/add', function (req, res, next) {
    if (!req.body.title) {
        res.send({
            code: 101,
            msg: '标题不能为空'
        });
        return;
    } else if (!req.body.info) {
        res.send({
            code: 101,
            msg: '新闻内容不能为空'
        });
        return;
    } else if (!req.body.time) {
        res.send({
            code: 101,
            msg: '时间不能为空'
        });
        return;
    } else if (!req.body.author) {
        res.send({
            code: 101,
            msg: '作者不能为空'
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
    let sql = 'INSERT INTO news (title, info ,time,author,imgUrl) VALUES (?,?,?,?,?)';
    db.query(
        sql,
        [req.body.title, req.body.info, req.body.time, req.body.author, req.body.imgUrl],
        function (error, results) {
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
        }
    );
});

/**
 * 删除
 * @id
 */
router.delete('/delete', function (req, res, next) {
    // let sql = 'SELECT * FROM students'
    let db = getcon();
    db.connect();
    let sql = 'DELETE FROM news WHERE id = ?';
    db.query(sql, [req.body.id], function (error, results) {
        if (error) {
            res.send({
                code: 500,
                data: '删除失败' + error
            });
            return;
        }
        console.log(results);
        if (results.affectedRows > 0) {
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
 * 修改学生信息
 * @title 新闻标题
 * @info 新闻内容
 * @time 新闻时间
 * @author 作者
 * @imgUrl 图片
 * @id
 */
router.put('/edit', function (req, res, next) {
    // let sql = 'SELECT * FROM students'
    let db = getcon();
    db.connect();
    let sql = 'UPDATE news SET title = ?,info = ? , time = ? , author = ? ,imgUrl = ? WHERE id = ?';
    if (!req.body.title) {
        res.send({
            code: 101,
            msg: '新闻标题不能为空'
        });
        return;
    } else if (!req.body.info) {
        res.send({
            code: 101,
            msg: '新闻内容不能为空'
        });
        return;
    } else if (!req.body.time) {
        res.send({
            code: 101,
            msg: '新闻时间不能为空'
        });
        return;
    } else if (!req.body.author) {
        res.send({
            code: 101,
            msg: '作者不能为空'
        });
        return;
    } else if (!req.body.imgUrl) {
        res.send({
            code: 101,
            msg: '图片不能为空'
        });
        return;
    }
    db.query(
        sql,
        [req.body.title, req.body.info, req.body.time, req.body.author, req.body.imgUrl, req.body.id],
        function (error, results) {
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
        }
    );
});

module.exports = router;
