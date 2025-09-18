const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { isLoggedIn } = require('../middlewares/auth');

// Hiển thị danh sách sản phẩm
router.get('/', productController.index);

// Thêm sản phẩm
router.get('/new', isLoggedIn, productController.newForm);
router.post('/', isLoggedIn, productController.create);

// Sửa sản phẩm
router.get('/:id/edit', isLoggedIn, productController.editForm);
router.put('/:id', isLoggedIn, productController.update);

// Xóa sản phẩm
router.delete('/:id', isLoggedIn, productController.delete);

module.exports = router;