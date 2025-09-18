const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const { isLoggedIn } = require('../middlewares/auth');

router.get('/', ctrl.index); // homepage shows products
router.get('/products/new', isLoggedIn, ctrl.newForm);
router.post('/products', isLoggedIn, ctrl.create);
router.get('/products/:id/edit', isLoggedIn, ctrl.editForm);
router.put('/products/:id', isLoggedIn, ctrl.update);
router.delete('/products/:id', isLoggedIn, ctrl.delete);

module.exports = router;