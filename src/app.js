// 서버를 만들기 위해 제공하는 라이브러리
const Express = require("express");

// DB 연동을 ORM 기반으로 제공하는 라이브러리
const {Sequelize, DataTypes} = require('sequelize');

// JSON 파싱을 위한 라이브러리
const bodyParser = require("body-parser");

// DB URL 값 
const URL = "sqlite::memory:"

// DB 객체 생성
const sequelize = new Sequelize(URL);

// DB에 저장되는 모델 정의 : User 모델 
// User 모델은 사용자 정보를 저장하며 id, name, room을 저장
const User = sequelize.define('user', {
    // ID 필드는 Primary Key 이면서 자동으로 1씩 증가되면서 저장하는 특성을 갖도록 한다.
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    // 이름
    name: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    // 방번호
    room: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// 위에는 단순히 User 테이블을 어떻게 관리할 지에 대해서 정의만 한 것으로,
// 최초에는 USER 테이블 조차 존재하지 않으므로, 정상적으로 동작하지 않음.
// 아래의 함수를 실행해야만 비로소, DB에 USER 테이블이 만들어져서 사용이 가능.
User.sync();

// 서버 객체 생성
const server = new Express();

// 서버 내용 구성
// 우선 편의를 위해, 응답을 받으면 알아서 JSON 파싱을 해주도록 정의 
server.use(bodyParser.json());

// 제공하기 위한 API 구성
// API (1) : 테스트 목적, 단순히 서버가 살아있는지 확인하기 위해 사용
server.get(
    '/', 
    (req, res) => {
        res.send('Hello World!');
    }
);

// API (2): User 추가
server.put(
    '/user',
    async (req, res) => {
        let result = await User
            .create({
                name: req.body.name,
                room: req.body.room
            })
            .then(result => {
                res.send(result);
            })
            .catch(
                (error) => {
                    res.send('User를 추가할 수 없습니다.');
                    res.send(`(${error})`);
                }
            );
    }
);

// API (3): User 조회
server.get(
    '/user/:id',
    async (req, res) => {
        let result = await User
            .findOne({ 
                where: { id: req.id }
            })
            .then(result => {
                res.send(result);
            })
            .catch(
                (error) => {
                    res.send('요청하신 User를 찾을 수 없습니다.');
                    res.send(`(${error})`);
                }
            );
    }
);

// API (4): User 삭제
server.delete(
    '/user/:id',
    async (req, res) => {
        let result = await User
            .destroy({ 
                where: { id: req.id }
            })
            .then(result => {
                res.send(result);
            })
            .catch(
                () => {
                    res.send('요청하신 User를 삭제할 수 없습니다.');
                    res.send(`(${error})`);
                }
            );
    }
);

// API (4): User 전체 조회
server.get(
    '/user',
    async (req, res) => {
        let result = await User
            .findAll()
            .catch(
                () => {
                    res.send('User를 조회할 수 없습니다.');
                    res.send(`(${error})`);
                }
            );
        
        res.send(result);
    }
);


// 서버 시작
const PORT = 3000;

server.listen(
    PORT, 
    () => {
        console.log(`Example app listening at http://localhost:${PORT}`);
    }
);