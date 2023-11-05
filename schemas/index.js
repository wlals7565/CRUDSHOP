const mongoose = require("mongoose");
// MongoDB Atlas에서 얻은 연결 문자열을 사용

//connect()는 몽고디비 접속 함수 
const connect = () => {
  const uri = `mongodb+srv://${process.env.ID}:${process.env.PASS}@project.hlmjkj6.mongodb.net/${process.env.DB || ""}?retryWrites=true&w=majority`;
  mongoose.connect(uri);

  //TODO: 지우기
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB Atlas");
  //
  });
};

module.exports = connect;
