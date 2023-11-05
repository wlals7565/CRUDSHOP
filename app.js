const express = require("express");
const dotenv = require('dotenv');
const morgan = require('morgan');
const connect = require('./schemas');
const Product = require('./schemas/products.schema');
const path = require('path');
const productRouter = require('./routes/products.router');

//익스프레스 객체 할당
const app = express();

//env파일 상수 접근 가능
dotenv.config();

//개발 편하게 하는용도
app.use(morgan('dev'));

//정적 파일 가져오는 경로 설정 
app.use(express.static(path.join(__dirname, 'public')));

//프론트에서 보내는 정보 parsing해주게 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Json파싱 오류 (서버 마비 방지용)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
      res.status(400).json({ error: 'JSON 파싱 오류' });
  } else {
      next();
  }
});

app.use('/product', productRouter);



//DB연결
connect();

//TODO 지우기
//데이터 생성 되는지 확인
//  const newProduct = new Product({
//    title: "ijh",
//    author: 'ijh',
//    comment: 'ijh',
//    isSoldOut: true,
//  });

//  newProduct.save();

app.listen(8000, () => {
  console.log('서버연결 됨.');
});