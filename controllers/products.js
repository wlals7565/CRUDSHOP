const Product = require("../schemas/products.schema")
//확인
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({createdAt: -1});
        return res.status(200).json(products);
    } catch (error) {
        console.error('데이터를 가져오는데 에러가 발생했습니다:', error);
        return res.status(500).json({ message: '데이터를 가져오는데 에러가 발생했습니다.' });
    }
};

exports.getProductDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('상품을 찾을 수 없음');
        }
        return res.status(200).json(product);
    } catch (error) {
        console.error('상품 조회 중 오류 발생:', error);
        return res.status(500).json({ message: '상품 조회 중 오류 발생' });
    }
};

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
        return res.status(500).json({ message: '업데이트 중 오류 발생' });
    }
};

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
        return res.status(500).json({ message: '삭제 중 오류 발생' });
    }
};


/*
exports.getProducts = async (req, res) => {
    try{
        const products = await Product.find({});
        return res.status(200).json(products);
    }
    catch{
        return res.status(500).json("데이터를 가져오는데 에러가 발생했습니다.");
    }
};
//확인
exports.getProductDetail = async (req, res) => {
    try {   
        const product = await Product.findOne({
            _id: req.params.id
        });
        return res.status(200).json(product);
    } 
    catch {
    return res.send("error");
    }
};
//확인
exports.postProduct =  async (req, res) => {
    try {
        if (req.body.title === undefined || req.body.author === undefined || req.body.comment === undefined || req.body.password === undefined) {
            return res.status(400).json({ message: "필수 필드 중 하나 이상이 누락되었습니다." });
            
        }
        const newProduct = new Product({
            title: req.body.title,
            author: req.body.author,
            comment: req.body.comment,
            password: req.body.password
        });
        await newProduct.save();
        res.status(200).json({message: "판매 상품이 등록되었습니다."});
    } catch (error) {
        return res.json({message: "상품 추가 중 오류 발생:"});
    }
};

//확인
exports.patchProduct = async (req, res) => {
    try {
        const condition = { _id: req.params.id };
        const updateData = req.body;

        // 업데이트할 필드를 명시적으로 지정합니다.
        const allowedFields = ['title', 'comment', 'isSoldOut'];
        const validUpdates = {};

        // 클라이언트가 보낸 데이터 중에서 기존 필드만 업데이트합니다.
        allowedFields.forEach(field => {
            if (updateData.hasOwnProperty(field)) {
                validUpdates[field] = updateData[field];
            }
        });

         // 비밀번호 체크
         const product = await Product.findById(req.params.id);
         if (!product) {
            return res.status(404).send('상품을 찾을 수 없음');
         }
 
         if (updateData.password !== product.password) {
            return res.status(401).send('비밀번호가 일치하지 않음');
         }

        const updatedProduct = await Product.findByIdAndUpdate(condition, validUpdates, { new: true });

        if (updatedProduct) {
            return res.status(200).json({message: "상품 수정을 성공하셨습니다"});
        } else {
            return res.status(404).send('상품을 찾을 수 없음');
        }
    } catch (error) {
        console.error('업데이트 중 오류 발생:', error);
        return res.status(500).send('error');  
    }
};

//필요
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
        return res.status(500).send('error');
    }
};
*/