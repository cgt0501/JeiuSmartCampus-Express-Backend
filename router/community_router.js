const express = require('express');
const router = express.Router();
const community = require('../controller/community_control');
const multer = require("multer");

// 사진 중복 방지를 위해 랜덤한 숫자 생성
function random() {
    return Math.floor(Math.random() * 100000000000)
}

// storage 설정
const profile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './resource/community_img/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: (req, file, cb) => {
        cb(null, random() + '-' + file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
});

//FileFilter 설정
const fileFilter = (req, file, cb) => {
    // mime type 체크하여 원하는 타입만 필터링
    if (file === "") {
        cb(null, false);
    } else {
        cb(null, true);
    }
};

const community_upload = multer({storage: profile, fileFilter});

router.post('/write', community_upload.single('community_image'), community.write);
router.get('/list/:table/:page', community.list);
router.get('/read/:table/:id', community.read);
router.post('/update-content', community.update);
router.post('/update-photo', community_upload.single('community_image'), community.update_img);
router.get('/delete/:table/:id', community.contents_delete);

module.exports = router;