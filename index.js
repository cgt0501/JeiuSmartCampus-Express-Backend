const request = require("request");
const cheerio = require("cheerio");
const iconv = require("iconv-lite");
//express 모듈 불러오기
const express = require("express");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

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
/*
let noticeContent = () => {

    request(
        {
            url: "https://jeiu.ac.kr/board/view.asp?sn=53964&page=1&search=&SearchString=&BoardID=00001",
            method: "GET",
            encoding: null,
        },
        (error, response, body) => {
            if (response.statusCode === 200) {
                console.log("(샘플) 세부페이지 연결 성공");

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
                    contents: $('#content > div.b_view > div.v_con').find('*').text().trim(),
                    img: mainurl +"/"+ $('#content > div.b_view > div.v_con > p > img').attr('src')
                }]

                app.get("/content_data", (req, res) => {
                    res.send(data);
                });
            }
        }
    )
} */

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
                    contents: $('#content > div.b_view > div.v_con').find('*').text().trim(),
                    img: mainurl + $('#content > div.b_view > div.v_con').find('img').attr('src')
                }]

                app.get("/" + params.page +"/notice", (req, res) => {
                    res.send(data);
                });

                res.redirect("http://localhost:3000/"+ params.page +"/notice");
            }
        }
    )


});

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

                app.get("/all_board/" + params.page +"/board", (req, res) => {
                    res.send(result);
                });

                res.redirect("http://localhost:3000/all_board/"+ params.page +"/board");
            }
        }
    )

});





main_notice()
big_size_notice()







app.listen(3000, () => {});