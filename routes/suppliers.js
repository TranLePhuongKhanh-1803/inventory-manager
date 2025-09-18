const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { isLoggedIn, isAdmin } = require('../middlewares/auth');

// Hiển thị danh sách nhà cung cấp (chỉ user login)
router.get('/', isLoggedIn, supplierController.index);

// Thêm nhà cung cấp
router.get('/new', isLoggedIn, supplierController.newForm);
router.post('/', isLoggedIn, supplierController.create);

// Sửa nhà cung cấp
router.get('/:id/edit', isLoggedIn, supplierController.editForm);
router.put('/:id', isLoggedIn, supplierController.update);

// Xóa nhà cung cấp
router.delete('/:id', isLoggedIn, supplierController.delete);

module.exports = router;