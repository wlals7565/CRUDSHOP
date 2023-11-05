const express = require('express');
const {getProducts, getProductDetail, postProduct, patchProduct, deleteProduct} = require('../controllers/products');

const router = express.Router();

//라우터 설정
router.get('/all', getProducts);

router.get('/:id', getProductDetail);

router.post('/', postProduct);

router.patch('/:id', patchProduct);

router.delete('/:id', deleteProduct);

module.exports = router;