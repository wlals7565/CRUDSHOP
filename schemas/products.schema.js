const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  // 상품명
  title: String,
  // 작성자
  author: String,
  // 작성 내용
  comment: String,
  // 0 -> FOR_SALE, 1 -> SOLD_OUT
  isSoldOut: {
    type: Boolean,
    default: false,
  },
  // 작성 날짜
  createdAt: {
    type: Date,
    default: () => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' })),
  },
  password: String,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
