const request = require("request");
const iconv = require("iconv-lite");
const cheerio = require("cheerio");

let noticeContents = (req, res) => {
    const params = req.params;

    request(
        {
            url: "https://jeiu.ac.kr/board/view.asp?sn=" + params.page + "&page=1&search=&SearchString=&BoardID=00001",
            method: "GET",
            encoding: null,
        },
        (error, response, body) => {
            if (response.statusCode === 200) {

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

                // 크롤링 결과를 json으로 전송
                res.send(data);
            }
        }
    )
    console.log("[GET] 알림: " + params.page + "번 게시글을 크롤링하였습니다.");
};

let noticeList = (req, res) => {
    const params = req.params;

    request(
        {
            url: "https://jeiu.ac.kr/board/list.asp?Page=" + params.page + "&search=&SearchString=&BoardID=00001",
            method: "GET",
            encoding: null,
        },
        (error, response, body) => {
            if (response.statusCode === 200) {

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
                    const number = $(td).find('.Number').first().text().trim();
                    const code = path.substring(12, 17);
                    let tag;
                    let color;

                    if (title.includes('장학')) {
                        tag = '장학';
                        color = 'background: ' + '#FF3B30';
                    } else if (title.includes('학사') || title.includes('입학') || title.includes('수강') || title.includes('전과') || title.includes('재입학')) {
                        tag = '학사';
                        color = 'background: ' + '#FFCC00';
                    } else if (title.includes('공고') || title.includes('코로나') || title.includes('교내')) {
                        tag = '교내';
                        color = 'background: ' + '#34C759';
                    } else {
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

                // 크롤링 결과를 전송
                res.json(result);
            }
        }
    )
    console.log("[GET] 알림: " + params.page + "번 게시판을 크롤링하였습니다.");
}
module.exports = {
    noticeContents: noticeContents,
    noticeList: noticeList
};