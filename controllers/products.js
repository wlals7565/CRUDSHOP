const Product = require("../schemas/products.schema")
//상품 목록 조회
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({createdAt: -1});
        return res.status(200).json(products);
    } catch (error) {
        console.error('상품 목록 조회 중 오류 발생:', error);
        return res.status(500).json({ message: '상품 목록 조회 중 오류 발생' });
    }
};
//상품 상세 조회
exports.getProductDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('상품을 찾을 수 없음');
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error('상품 상세 조회 중 오류 발생:', error);
        return res.status(500).json({ message: '상품 상세 조회 중 오류 발생' });
    }
};
//상품 작성
exports.postProduct = async (req, res) => {
    try {
        const { title, author, comment, password } = req.body;
        if (!title || !author || !comment || !password) {
            return res.status(400).json({ message: '필수 필드 중 하나 이상이 누락되었습니다.' });
        }
        
        const newProduct = new Product({
            title,
            author,
            comment,
            password,
        });

        await newProduct.save();
        return res.status(200).json({ message: '판매 상품이 등록되었습니다.' });
    } catch (error) {
        console.error('상품 추가 중 오류 발생:', error);
        return res.status(500).json({ message: '상품 추가 중 오류 발생' });
    }
};
//상품 수정
exports.patchProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updateData = req.body;

        // 비밀번호 체크
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('상품을 찾을 수 없음');
        }

        if (updateData.password !== product.password) {
            return res.status(401).send('비밀번호가 일치하지 않음');
        }

        const validUpdates = {};

        if (updateData.title) {
            validUpdates.title = updateData.title;
        }

        if (updateData.comment) {
            validUpdates.comment = updateData.comment;
        }

        if (updateData.isSoldOut !== undefined) {
            validUpdates.isSoldOut = updateData.isSoldOut;
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, validUpdates, { new: true });

        if (updatedProduct) {
            return res.status(200).json({ message: '상품 수정을 성공하셨습니다' });
        } else {
            return res.status(404).send('상품을 찾을 수 없음');
        }
    } catch (error) {
        console.error('업데이트 중 오류 발생:', error);
        return res.status(500).json({ message: '상품 업데이트 중 오류 발생' });
    }
};
//상품 삭제
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const password = req.body.password;

        // 비밀번호 체크
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('상품을 찾을 수 없음');
        }

        if (password !== product.password) {
            return res.status(401).send('비밀번호가 일치하지 않음');
        }

        // 상품 삭제
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (deletedProduct) {
            return res.status(200).json({ message: '상품 삭제를 성공하셨습니다' });
        } else {
            return res.status(404).send('상품을 찾을 수 없음');
        }
    } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        return res.status(500).json({ message: '상품 삭제 중 오류 발생' });
    }
};