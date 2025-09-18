const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/supplierController');
const { isLoggedIn } = require('../middlewares/auth');

router.get('/suppliers', ctrl.index);
router.get('/suppliers/new', isLoggedIn, ctrl.newForm);
router.post('/suppliers', isLoggedIn, ctrl.create);
router.get('/suppliers/:id/edit', isLoggedIn, ctrl.editForm);
router.put('/suppliers/:id', isLoggedIn, ctrl.update);
router.delete('/suppliers/:id', isLoggedIn, ctrl.delete);

module.exports = router;