const mysql = require('mysql');
require("dotenv").config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: 'jeiue_campus'
});

connection.connect();

// 게시글 작성
let write = (req, res) => {
    const table = req.body.table;
    const stu_id = req.body.stu_id;
    const title = req.body.title;
    const user = req.body.user;
    const date = req.body.date;
    const content = req.body.content;

    let img;
    //파일이 비어있을때
    if (req.file === undefined) {
        console.log("사진 없음");
        img = "";
    } else {
        //파일이 있을때
        img = req.file['filename'];
    }
    if (table === "CampusBoard_AI") {
        connection.query('INSERT INTO CampusBoard_AI VALUES(null, ?, ?, ?, ?, ?, ?)', [title, user, date, content, img, stu_id], (error, result) => {
            if (error) throw error;
            res.send((result))
            console.log("[POST] 알림: " + table + "에 " + stu_id + " " + user + "이 " + title + " 게시물을 등록하였습니다.");
        });
    } else if (table === "CampusBoard_Art") {
        connection.query('INSERT INTO CampusBoard_Art VALUES(null, ?, ?, ?, ?, ?, ?)', [title, user, date, content, img, stu_id], (error, result) => {
            if (error) throw error;
            res.send((result))
            console.log("[POST] 알림: " + table + "에 " + stu_id + " " + user + "이 " + title + " 게시물을 등록하였습니다.");
        });
    } else if (table === "CampusBoard_Founded") {
        connection.query('INSERT INTO CampusBoard_Founded VALUES(null, ?, ?, ?, ?, ?, ?)', [title, user, date, content, img, stu_id], (error, result) => {
            if (error) throw error;
            res.send((result))
            console.log("[POST] 알림: " + table + "에 " + stu_id + " " + user + "이 " + title + " 게시물을 등록하였습니다.");
        });
    } else if (table === "CampusBoard_Human") {
        connection.query('INSERT INTO CampusBoard_Human VALUES(null, ?, ?, ?, ?, ?, ?)', [title, user, date, content, img, stu_id], (error, result) => {
            if (error) throw error;
            res.send((result))
            console.log("[POST] 알림: " + table + "에 " + stu_id + " " + user + "이 " + title + " 게시물을 등록하였습니다.");
        });
    } else if (table === "CampusBoard_Nature") {
        connection.query('INSERT INTO CampusBoard_Nature VALUES(null, ?, ?, ?, ?, ?, ?)', [title, user, date, content, img, stu_id], (error, result) => {
            if (error) throw error;
            res.send((result))
            console.log("[POST] 알림: " + table + "에 " + stu_id + " " + user + "이 " + title + " 게시물을 등록하였습니다.");
        });
    }
}
// 게시글 리스트
let list = (req, res) => {
    const table = req.params.table;
    const page = req.params.page * 10;

    if (table === "CampusBoard_AI") {
        connection.query('SELECT id, title, user, date from CampusBoard_AI order by id desc limit ?, 10', [page], (error, result) => {
            if (error) throw error;
            res.send((result))
        });
        console.log(`[GET] 알림: AI학부 게시판의 ${(page / 10) + 1}번째 목록을 불러옵니다.`);
    } else if (table === "CampusBoard_Art") {
        connection.query('SELECT id, title, user, date from CampusBoard_Art order by id desc limit ?, 10', [page], (error, result) => {
            if (error) throw error;
            res.send((result))
        });
        console.log(`[GET] 알림: 예술학부 게시판의 ${(page / 10) + 1}번째 목록을 불러옵니다.`);
    } else if (table === "CampusBoard_Founded") {
        connection.query('SELECT id, title, user, date from CampusBoard_Founded order by id desc limit ?, 10', [page], (error, result) => {
            if (error) throw error;
            res.send((result))
        });
        console.log(`[GET] 알림: 창업학부 게시판의 ${(page / 10) + 1}번째 목록을 불러옵니다.`);
    } else if (table === "CampusBoard_Human") {
        connection.query('SELECT id, title, user, date from CampusBoard_Human order by id desc limit ?, 10', [page], (error, result) => {
            if (error) throw error;
            res.send((result))
        });
        console.log(`[GET] 알림: 인문학부 게시판의 ${(page / 10) + 1}번째 목록을 불러옵니다.`);
    } else if (table === "CampusBoard_Nature") {
        connection.query('SELECT id, title, user, date from CampusBoard_Nature order by id desc limit ?, 10', [page], (error, result) => {
            if (error) throw error;
            res.send((result))
        });
        console.log(`[GET] 알림: 자연학부 게시판의 ${(page / 10) + 1}번째 목록을 불러옵니다.`);
    }
}
// 게시글 읽기
let read = (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    if (table === "CampusBoard_AI") {
        connection.query('SELECT * from CampusBoard_AI where id = ?', [id], (error, result) => {
            if (error) throw error;
            const data = [{
                title: result[0].title,
                date: result[0].date,
                view: "",
                fileName: "",
                fileLink: "https://jeiu.ac.krundefined",
                contents: result[0].content,
                img: result[0].image,
                user: result[0].user,
                stu_id: result[0].stu_id
            }];
            res.send(data);
        });
        console.log("[GET] 알림: AI학부 게시판의 " + id + " 게시글을 불러왔습니다.");
    } else if (table === "CampusBoard_Art") {
        connection.query('SELECT * from CampusBoard_Art where id = ?', [id], (error, result) => {
            if (error) throw error;
            const data = [{
                title: result[0].title,
                date: result[0].date,
                view: "",
                fileName: "",
                fileLink: "https://jeiu.ac.krundefined",
                contents: result[0].content,
                img: result[0].image,
                user: result[0].user,
                stu_id: result[0].stu_id
            }];
            res.send(data);
        });
        console.log("[GET] 알림: 예술학부 게시판의 " + id + " 게시글을 불러왔습니다.");
    } else if (table === "CampusBoard_Founded") {
        connection.query('SELECT * from CampusBoard_Founded where id = ?', [id], (error, result) => {
            if (error) throw error;
            const data = [{
                title: result[0].title,
                date: result[0].date,
                view: "",
                fileName: "",
                fileLink: "https://jeiu.ac.krundefined",
                contents: result[0].content,
                img: result[0].image,
                user: result[0].user,
                stu_id: result[0].stu_id
            }];
            res.send(data);
        });
        console.log("[GET] 알림: 창업학부 게시판의 " + id + " 게시글을 불러왔습니다.");
    } else if (table === "CampusBoard_Human") {
        connection.query('SELECT * from CampusBoard_Human where id = ?', [id], (error, result) => {
            if (error) throw error;
            const data = [{
                title: result[0].title,
                date: result[0].date,
                view: "",
                fileName: "",
                fileLink: "https://jeiu.ac.krundefined",
                contents: result[0].content,
                img: result[0].image,
                user: result[0].user,
                stu_id: result[0].stu_id
            }];
            res.send(data);
        });
        console.log("[GET] 알림: 인문학부 게시판의 " + id + " 게시글을 불러왔습니다.");
    } else if (table === "CampusBoard_Nature") {
        connection.query('SELECT * from CampusBoard_Nature where id = ?', [id], (error, result) => {
            if (error) throw error;
            const data = [{
                title: result[0].title,
                date: result[0].date,
                view: "",
                fileName: "",
                fileLink: "https://jeiu.ac.krundefined",
                contents: result[0].content,
                img: result[0].image,
                user: result[0].user,
                stu_id: result[0].stu_id
            }];
            res.send(data);
        });
        console.log("[GET] 알림: 자연학부 게시판의 " + id + " 게시글을 불러왔습니다.");
    }
}
// 게시글 수정
let update = (req, res) => {
    const table = req.body.table;
    const id = req.body.id;
    const title = req.body.title;
    const content = req.body.content;

    if (table === "CampusBoard_AI") {
        connection.query('UPDATE CampusBoard_AI SET title = ?, content = ?  WHERE id = ?', [title, content, id], (error, result) => {
            if (error) throw error;
            res.send((result));
        });
        console.log("[GET] 알림: AI학부 게시판의 " + id + " 게시글을 수정했습니다.");
    } else if (table === "CampusBoard_Art") {
        connection.query('UPDATE CampusBoard_Art SET title = ?, content = ?  WHERE id = ?', [title, content, id], (error, result) => {
            if (error) throw error;
            res.send((result));
        });
        console.log("[GET] 알림: 예술학부 게시판의 " + id + " 게시글을 수정했습니다.");
    } else if (table === "CampusBoard_Founded") {
        connection.query('UPDATE CampusBoard_Founded SET title = ?, content = ?  WHERE id = ?', [title, content, id], (error, result) => {
            if (error) throw error;
            res.send((result));
        });
        console.log("[GET] 알림: 창업학부 게시판의 " + id + " 게시글을 수정했습니다.");
    } else if (table === "CampusBoard_Human") {
        connection.query('UPDATE CampusBoard_Human SET title = ?, content = ?  WHERE id = ?', [title, content, id], (error, result) => {
            if (error) throw error;
            res.send((result));
        });
        console.log("[GET] 알림: 인문학부 게시판의 " + id + " 게시글을 수정했습니다.");
    } else if (table === "CampusBoard_Nature") {
        connection.query('UPDATE CampusBoard_Nature SET title = ?, content = ?  WHERE id = ?', [title, content, id], (error, result) => {
            if (error) throw error;
            res.send((result));
        });
        console.log("[GET] 알림: 자연학부 게시판의 " + id + " 게시글을 수정했습니다.");
    }
}
// 게시글 사진 수정
let update_img = (req, res) => {
    console.log("요청이 들어왔습니다.");
    const table = req.body.table;
    const id = req.body.id;
    let img;

    //파일이 비어있을때
    if (req.file === undefined) {
        img = "";
        console.log("[POST] 알림: 사용자가 게시글 사진 변경을 요청하였으나, 아무런 파일이 없었습니다.");
    } else {
        img = req.file['filename'];
        console.log("[POST] 알림: 사용자가 게시글 사진을 변경하였습니다.");
    }

    if (table === "CampusBoard_AI") {
        connection.query('UPDATE CampusBoard_AI SET image = ?  WHERE id = ?', [img, id], (error, result) => {
            if (error) throw error;
            res.send((result));
        });
        console.log("[GET] 알림: AI학부 게시판의 " + id + " 게시글의 이미지를 수정했습니다.");
    } else if (table === "CampusBoard_Art") {
        connection.query('UPDATE CampusBoard_Art SET image = ?  WHERE id = ?', [img, id], (error, result) => {
            if (error) throw error;
            res.send((result));
        });
        console.log("[GET] 알림: 예술학부 게시판의 " + id + " 게시글의 이미지를 수정했습니다.");
    } else if (table === "CampusBoard_Founded") {
        connection.query('UPDATE CampusBoard_Founded SET image = ?  WHERE id = ?', [img, id], (error, result) => {
            if (error) throw error;
            res.send((result));
        });
        console.log("[GET] 알림: 창업학부 게시판의 " + id + " 게시글의 이미지를 수정했습니다.");
    } else if (table === "CampusBoard_Human") {
        connection.query('UPDATE CampusBoard_Human SET image = ?  WHERE id = ?', [img, id], (error, result) => {
            if (error) throw error;
            res.send((result));
        });
        console.log("[GET] 알림: 인문학부 게시판의 " + id + " 게시글의 이미지를 수정했습니다.");
    } else if (table === "CampusBoard_Nature") {
        connection.query('UPDATE CampusBoard_Nature SET image = ?  WHERE id = ?', [img, id], (error, result) => {
            if (error) throw error;
            res.send((result));
        });
        console.log("[GET] 알림: 자연학부 게시판의 " + id + " 게시글의 이미지를 수정했습니다.");
    }
}
// 게시글 삭제
let contents_delete = (req, res) => {
    const table = req.params.table;
    const id = req.params.id;

    if (table === "CampusBoard_AI") {
        connection.query('DELETE FROM CampusBoard_AI WHERE id=?', [id], (error, result) => {
            if (error) throw error;
            res.send((result))
        });
        console.log("[GET] 알림: AI학부 게시판의 " + id + " 게시글을 삭제했습니다.");
    } else if (table === "CampusBoard_Art") {
        connection.query('DELETE FROM CampusBoard_Art WHERE id=?', [id], (error, result) => {
            if (error) throw error;
            res.send((result))
        });
        console.log("[GET] 알림: 예술학부 게시판의 " + id + " 게시글을 삭제했습니다.");
    } else if (table === "CampusBoard_Founded") {
        connection.query('DELETE FROM CampusBoard_Founded WHERE id=?', [id], (error, result) => {
            if (error) throw error;
            res.send((result))
        });
        console.log("[GET] 알림: 창업학부 게시판의 " + id + " 게시글을 삭제했습니다.");
    } else if (table === "CampusBoard_Human") {
        connection.query('DELETE FROM CampusBoard_Human WHERE id=?', [id], (error, result) => {
            if (error) throw error;
            res.send((result))
        });
        console.log("[GET] 알림: 인문학부 게시판의 " + id + " 게시글을 삭제했습니다.");
    } else if (table === "CampusBoard_Nature") {
        connection.query('DELETE FROM CampusBoard_Nature WHERE id=?', [id], (error, result) => {
            if (error) throw error;
            res.send((result))
        });
        console.log("[GET] 알림: 자연학부 게시판의 " + id + " 게시글을 삭제했습니다.");
    }
}

module.exports = {
    write: write,
    list: list,
    read: read,
    update: update,
    update_img: update_img,
    contents_delete: contents_delete
};