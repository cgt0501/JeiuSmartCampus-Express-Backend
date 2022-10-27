const mysql = require('mysql');
const express = require("express");
require("dotenv").config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: 'jeiue_campus'
});

connection.connect();

// 회원가입 받기
let signUp = (req, res) => {
    const name = req.body.name;
    const stu_num = req.body.stu_num;
    const password = req.body.password;
    const department = req.body.department;
    const rank = req.body.rank;
    let img;
    //파일이 비어있을때
    if (req.file === undefined) {
        img = "";
    } else {
        //파일이 있을때
        img = req.file['filename'];
    }
    console.log(name, stu_num, password, department, rank, img);
    connection.query('INSERT INTO Users VALUES(null, ?, ?, ?, ?, ?, ?)', [name, password, department, rank, stu_num, img], (error, result) => {
        if (error) throw error;
        res.send((result))
        console.log("[POST] 알림: " + department + ", " + name + "의 회원가입을 받았습니다.");
    });
};
// 회원정보 확인하기 (로그인)
let login = (req, res) => {
    const stu_num = req.body.stu_num;
    const password = req.body.password;

    connection.query('select * from Users where stu_number=?', [stu_num], function (error, result) {
        //존재하지 않는 학번 출력
        if (!result[0]) {
            res.send({
                code: 1,
                massage: "존재하지 않는 학번입니다."
            })
            console.log("[POST] 알림: 존재하지 않는 학번으로 로그인을 시도하여 로그인이 거부되었습니다.");
        } else {
            // 패스워드가 맞았을때
            if (password === result[0].password) {
                res.send({
                    // 사용자 정보를 JSON으로 전송
                    id: result[0].id,
                    name: result[0].name,
                    password: result[0].password,
                    department: result[0].department,
                    stu_rank: result[0].stu_rank,
                    stu_number: result[0].stu_number,
                    code: 3,
                    img: result[0].img
                })
                console.log("[POST] 알림: " + stu_num + " 의 로그인 요청을 받았습니다.");
            } else {
                res.send({
                    massage: "비밀번호를 확인해주세요",
                    code: 2
                })
                console.log("[POST] 알림: 비밀번호가 일치하지 않아 로그인이 거부되었습니다.", password);
            }
        }
        //에러 발생
        if (error) {
            res.send({
                massage: "알 수 없는 오류가 발생했습니다. " + error
            })
        }

    });
};
// 회원정보 수정
let infoUpdate = (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const password = req.body.password;
    const department = req.body.department;
    const rank = req.body.rank;


    connection.query('UPDATE Users SET name = ?, password = ?, department = ?, stu_rank = ?  WHERE id = ?', [name, password, department, rank, id], (error, result) => {
        if (error) throw error;
        res.send(result)
    })

    console.log("[POST] 알림: " + id + ', ' + name + " 의 계정을 수정했습니다.");
};
// 회원 사진 수정
let photoUpdate = (req, res) => {
    const id = req.body.id;

    let img;

    //파일이 비어있을때
    if (req.file === undefined) {
        img = "";
        console.log("[POST] 알림: " + id + "가 프로필 사진 변경을 요청하였으나, 아무런 파일이 없었습니다.");
    } else {
        img = req.file['filename'];
        console.log("[POST] 알림: " + id + "의 프로필 사진을 변경하였습니다.");
    }

    connection.query('UPDATE Users SET img = ?  WHERE id = ?', [img, id], (error, result) => {
        if (error) throw error;
        res.send(result)
    });
};
// 회원정보 삭제
let userDelete = (req, res) => {
    const id = req.body.id;

    connection.query('DELETE FROM Users WHERE id=?', [id], (error, result) => {
        if (error) throw error;
        res.send(result)
    })

    console.log("[POST] 알림: " + id + " 의 계정을 삭제했습니다.");
};

module.exports = {
    signUp: signUp,
    login: login,
    infoUpdate: infoUpdate,
    photoUpdate: photoUpdate,
    userDelete: userDelete
};