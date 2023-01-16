var express = require('express');
var router = express.Router();
let getcon = require('./dbutil');
let jwt = require('../jwt/index.js');
router.use(jwt);
/**
 * 新增学生
 * @name 学生名字
 * @phone 电话号码
 * @address 地址
 * @age 年龄
 * @type 类型
 */
router.post('/add', function (req, res, next) {
    if (!req.body.name) {
        res.send({
            code: 101,
            msg: '名称不能为空'
        });
        return;
    } else if (!req.body.phone) {
        res.send({
            code: 101,
            msg: '手机号不能为空'
        });
        return;
    } else if (!req.body.address) {
        res.send({
            code: 101,
            msg: '地址不能为空'
        });
        return;
    } else if (!req.body.age) {
        res.send({
            code: 101,
            msg: '年龄不能为空'
        });
        return;
    } else if (!req.body.type) {
        res.send({
            code: 101,
            msg: '类型不能为空'
        });
        return;
    }
    let db = getcon();
    db.connect();
    let sql = 'INSERT INTO students (name, phone ,address , age, type) VALUES (?,?,?,?,?)';
    db.query(
        sql,
        [req.body.name, req.body.phone, req.body.address, req.body.age, req.body.type],
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
    let sql = 'DELETE FROM students WHERE id = ?';
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
 * @name 学生名称
 * @phone 学生电话
 * @age 学生年龄
 * @address 学生地址
 * @type 类型
 * @id
 */
router.put('/edit', function (req, res, next) {
    // let sql = 'SELECT * FROM students'
    let db = getcon();
    db.connect();
    let sql = 'UPDATE students SET name = ?,phone = ? , age = ? , address = ?,type = ? WHERE id = ?';
    if (!req.body.name) {
        res.send({
            code: 101,
            msg: '名称不能为空'
        });
        return;
    } else if (!req.body.phone) {
        res.send({
            code: 101,
            msg: '电话不能为空'
        });
        return;
    } else if (!req.body.age) {
        res.send({
            code: 101,
            msg: '年龄不能为空'
        });
        return;
    } else if (!req.body.address) {
        res.send({
            code: 101,
            msg: '地址不能为空'
        });
        return;
    } else if (!req.body.type) {
        res.send({
            code: 101,
            msg: '类型不能为空'
        });
        return;
    }
    db.query(
        sql,
        [req.body.name, req.body.phone, req.body.age, req.body.address, req.body.type, req.body.id],
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

    let sql = `SELECT * FROM students`;
    let sql2;
    let count;
    if (req.query.name) {
        sql2 = `SELECT COUNT(*) FROM students where name like '%${req.query.name}%'`;
        sql += ` where name like '%${req.query.name}%' LIMIT ${start},${pageSize}`;
    } else {
        sql2 = 'SELECT COUNT(*) FROM students';
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

module.exports = router;
