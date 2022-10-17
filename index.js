const request = require("request");
const axios = require('axios');
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
//express 모듈 불러오기
const express = require("express");
const cors = require('cors');
const os = require("os");
const mysql = require('mysql');
const response = require("express");
const bodyParser = require("body-parser");
//파일 업로드용
var multer = require('multer');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1q2w3e4r!',
    database: 'jeiue_campus'
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const networkInterfaces = os.networkInterfaces();

const ip = networkInterfaces['en0'][1]['address'];

let main_notice = () => {
    request(
        {
            url: "https://jeiu.ac.kr/board/list.asp?BoardID=00001",
            method: "GET",
            encoding: null,
        },
        (error, response, body) => {
            if (response.statusCode === 200) {
                console.log('메인화면용 게시판 목록 연동 완료 \n');

                //iconv를 사용하여 body를 EUC-KR로 디코드
                const bodyDecoded = iconv.decode(body, "euc-kr");
                //디코드 해서 저장
                const $ = cheerio.load(bodyDecoded);

                const title = $('#content > table > tbody > tr').toArray();
                const result = [];

                title.forEach((td) => {
                    const aFirst = $(td).find("a").first(); //첫번째 <a> 태그
                    const path = aFirst.attr("href");
                    const url = `https://jeiu.ac.kr/board/${path}`
                    const title = aFirst.text().trim();
                    const name = $(td).find('.name').first().text().trim();
                    const writeday = $(td).find('.writeday').first().text().trim();
                    const number =  $(td).find('.Number').first().text().trim();
                    const code = path.substring(12, 17);
                    let tag = '';
                    let color = '';

                    if (title.includes('장학')) {
                        tag = '장학';
                        color = 'background: ' + '#FF3B30';
                    }else if (title.includes('학사') || title.includes('입학')) {
                        tag = '학사';
                        color = 'background: ' + '#FFCC00';
                    }else if (title.includes('공고') || title.includes('코로나') || title.includes('교내')) {
                        tag = '교내';
                        color = 'background: ' + '#34C759';
                    }else{
                        tag = '기타';
                        color = 'background: ' + '#FF9500';
                    }

                    result.push({
                        url,
                        title,
                        name,
                        writeday,
                        number,
                        code,
                        tag,
                        color
                    })
                });
                const removed = result.splice(2, 5);

                app.get("/board", (req, res) => {
                    res.send(removed);
                });
            }
        }
    )
}

let big_size_notice = () => {
    request(
        {
            url: "https://jeiu.ac.kr/board/list.asp?BoardID=00001",
            method: "GET",
            encoding: null,
        },
        (error, response, body) => {
            if (response.statusCode === 200) {
                console.log('게시글 첫번째 목록 연동 완료 \n');

                //iconv를 사용하여 body를 EUC-KR로 디코드
                const bodyDecoded = iconv.decode(body, "euc-kr");
                //디코드 해서 저장
                const $ = cheerio.load(bodyDecoded);

                const title = $('#content > table > tbody > tr').toArray();
                const result = [];

                title.forEach((td) => {
                    const aFirst = $(td).find("a").first(); //첫번째 <a> 태그
                    const path = aFirst.attr("href");
                    const url = `https://jeiu.ac.kr/board/${path}`
                    const title = aFirst.text().trim();
                    const name = $(td).find('.name').first().text().trim();
                    const writeday = $(td).find('.writeday').first().text().trim();
                    const number =  $(td).find('.Number').first().text().trim();
                    const code = path.substring(12, 17);
                    let tag = '';
                    let color = '';

                    if (title.includes('장학')) {
                        tag = '장학';
                        color = 'background: ' + '#FF3B30';
                    }else if (title.includes('학사') || title.includes('입학')) {
                        tag = '학사';
                        color = 'background: ' + '#FFCC00';
                    }else if (title.includes('공고') || title.includes('코로나') || title.includes('교내')) {
                        tag = '교내';
                        color = 'background: ' + '#34C759';
                    }else{
                        tag = '기타';
                        color = 'background: ' + '#FF9500';
                    }

                    result.push({
                        url,
                        title,
                        name,
                        writeday,
                        number,
                        code,
                        tag,
                        color
                    })
                });

                app.get("/all_board", (req, res) => {
                    res.send(result);
                });
            }
        }
    )
}

// 페이지 연동 요청
app.get('/con/:page', function (req, res) {
    const params = req.params;
    console.log("페이지 연동 요청: "+ params.page + "번 게시글");

    request(
        {
            url: "https://jeiu.ac.kr/board/view.asp?sn=" + params.page + "&page=1&search=&SearchString=&BoardID=00001",
            method: "GET",
            encoding: null,
        },
        (error, response, body) => {
            if (response.statusCode === 200) {
                console.log("세부페이지 배포 성공: " + params.page + "번 게시글 \n");

                //iconv를 사용하여 body를 EUC-KR로 디코드
                const bodyDecoded = iconv.decode(body, "euc-kr");
                //디코드 해서 저장
                const $ = cheerio.load(bodyDecoded);
                mainurl = 'https://jeiu.ac.kr'

                const data = [{
                    title: $('#content > div.b_view > div.v_top > div.v_title').text(),
                    date: $('#content > div.b_view > div.v_top > div.v_info > span:nth-child(2)').text(),
                    view: $('#content > div.b_view > div.v_top > div.v_info > span:nth-child(3)').text(),
                    fileName: $('#content > div.b_view > div.v_top > div.v_file > div > a').text(),
                    fileLink: mainurl + $('#content > div.b_view > div.v_top > div.v_file > div > a').attr('href'),
                    contents: $('#content > div.b_view > div.v_con > p').find('*').text().trim(),
                    img: mainurl + $('#content > div.b_view > div.v_con').find('img').attr('src')
                }]

                app.get("/" + params.page +"/notice", (req, res) => {
                    res.send(data);
                });

                res.redirect("/" + params.page + "/notice");
            }
        }
    )


});

app.use(bodyParser.urlencoded({extended: false}))

app.get('/all_board/:page', function (req, res) {
    const params = req.params;
    console.log("페이지 연동 요청: " + params.page + " 페이지");

    request(
        {
            url: "https://jeiu.ac.kr/board/list.asp?Page=" + params.page + "&search=&SearchString=&BoardID=00001",
            method: "GET",
            encoding: null,
        },
        (error, response, body) => {
            if (response.statusCode === 200) {
                console.log(params.page + ' 페이지 게시판 연동 성공 \n');

                //iconv를 사용하여 body를 EUC-KR로 디코드
                const bodyDecoded = iconv.decode(body, "euc-kr");
                //디코드 해서 저장
                const $ = cheerio.load(bodyDecoded);

                const title = $('#content > table > tbody > tr').toArray();
                const result = [];

                title.forEach((td) => {
                    const aFirst = $(td).find("a").first(); //첫번째 <a> 태그
                    const path = aFirst.attr("href");
                    const url = `https://jeiu.ac.kr/board/${path}`
                    const title = aFirst.text().trim();
                    const name = $(td).find('.name').first().text().trim();
                    const writeday = $(td).find('.writeday').first().text().trim();
                    const number =  $(td).find('.Number').first().text().trim();
                    const code = path.substring(12, 17);
                    let tag = '';
                    let color = '';

                    if (title.includes('장학')) {
                        tag = '장학';
                        color = 'background: ' + '#FF3B30';
                    }else if (title.includes('학사') || title.includes('입학') || title.includes('수강') || title.includes('전과') || title.includes('재입학')) {
                        tag = '학사';
                        color = 'background: ' + '#FFCC00';
                    }else if (title.includes('공고') || title.includes('코로나') || title.includes('교내')) {
                        tag = '교내';
                        color = 'background: ' + '#34C759';
                    }else{
                        tag = '기타';
                        color = 'background: ' + '#FF9500';
                    }

                    result.push({
                        url,
                        title,
                        name,
                        writeday,
                        number,
                        code,
                        tag,
                        color
                    })
                });

                app.get("/all_board/" + params.page +"/board", (req, res) => {
                    res.send(result);
                });

                res.redirect("/all_board/"+ params.page +"/board");
            }
        }
    )

});

//////////
//SQL 부분
/////////
// mysql에서 정보 불러오기
connection.connect();
//현재 시간
let nowTime = Date.now().toString()

// storage 설정
const profile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'profile_img/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: (req, file, cb) => {
        cb(null, nowTime + '-' + file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
})

//FileFilter 설정
const fileFilter = (req, file, cb) => {
    // mime type 체크하여 원하는 타입만 필터링
    if (file === "") {
        cb(null, false);
    } else {
        cb(null, true);
    }
}
const profile_upload = multer({storage: profile, fileFilter})

//프로필 이미지 확인 가능하게 해주는 메소드
app.use('/profile_img', express.static('profile_img'));

////////////
// 회원가입 받기 Create
///////////
app.post('/post/signup', profile_upload.single('profile_img'), function (req, res, next) {
    const name = req.body.name;
    const stu_num = req.body.stu_num;
    const password = req.body.password;
    const department = req.body.department;
    const rank = req.body.rank;
    let img = ""
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
        console.log(name + "의 회원가입을 받았습니다.")
    });
});
/////////////
// 로그인 확인하기 Read
/////////////
app.post('/post/login', function (req, res, next) {
    console.log("로그인을 요청하였습니다.")
    const stu_num = req.body.stu_num;
    const password = req.body.password;

    if (stu_num === "" && password === "") {
        res.send({
            code: 0,
            massage: "테스트."
        })
    } else {

        connection.query('select * from Users where stu_number=?', [stu_num], function (error, result) {
            //존재하지 않는 학번 출력
            if (!result[0]) {
                res.send({
                    code: 1,
                    massage: "존재하지 않는 학번입니다."
                })
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
                } else {
                    res.send({
                        massage: "비밀번호를 확인해주세요",
                        code: 2
                    })
                }
            }

            //에러 발생
            if (error) {
                res.send({
                    massage: "알 수 없는 오류가 발생했습니다. " + error
                })
            }

        });
    }
});
/////////////
// 유저 정보 삭제 Delete
/////////////
app.post('/post/profile_delete', function (req, res) {
    const id = req.body.id;

    console.log('프로필 삭제');
    connection.query('DELETE FROM Users WHERE id=?', [id], (error, result) => {
        if (error) throw error;
        res.send(result)
    })
});
/////////////
// 유저 정보 수정 Update
/////////////
app.post('/post/profile_update', function (req, res) {
    const id = req.body.id;
    const name = req.body.name;
    const password = req.body.password;
    const department = req.body.department;
    const rank = req.body.rank;

    console.log(id, name, password, department, rank)
    console.log('프로필 수정');
    connection.query('UPDATE Users SET name = ?, password = ?, department = ?, stu_rank = ?  WHERE id = ?', [name, password, department, rank, id], (error, result) => {
        if (error) throw error;
        res.send(result)
    })
});
/////////////
// 유저 프로필 수정 Update
/////////////
app.post('/post/profile_img_update', profile_upload.single('profile_img'), function (req, res) {
    const id = req.body.id;
    let img = "";

    //파일이 비어있을때
    if (req.file === undefined) {
        img = "";
    } else {
        img = req.file['filename'];
    }

    console.log(id, img)
    console.log('프로필 수정');
    connection.query('UPDATE Users SET img = ?  WHERE id = ?', [img, id], (error, result) => {
        if (error) throw error;
        res.send(result)
    })
});
////////////
// 사용자 리스트
////////////
app.get('/profile_list', function (req, res) {
    console.log("\n 사용자 리스트 불러오기");

    connection.query('SELECT * from Users', (error, result) => {
        if (error) throw error;
        res.send((result))
    });
});

app.get('/banner', function (req, res) {
    axios({
        // 크롤링을 원하는 페이지 URL
        url: 'https://www.jeiu.ac.kr/front_2022.asp',
        method: 'GET',
        responseType: 'arraybuffer',
    })
        // 성공했을 경우
        .then(response => {
            const content = iconv.decode(response.data, 'EUC-KR');
            const $ = cheerio.load(content);
            const img = $('#m_jei_slider > div:nth-child(1) > a > img').attr('src');
            const bg_link = "https://www.jeiu.ac.kr" + img
            let ori_data = []
            ori_data.push({
                bg_link
            })

            res.send(ori_data)
            console.log("배너를 불러왔습니다.");
        })
        // 실패했을 경우
        .catch(err => {
            console.error(err);
        });
})

main_notice()
big_size_notice()


app.listen(3000, ip, () => {
});

console.log("\n Now Host: " + ip + ":3000\n")