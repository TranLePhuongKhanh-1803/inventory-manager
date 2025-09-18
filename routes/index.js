const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

router.get('/', async(req, res) => {
    try {
        const suppliers = await Supplier.find().sort('name').lean();

        let query = {};

        // Nếu chọn nhà cung cấp
        if (req.query.supplier && req.query.supplier !== '') {
            query.supplierId = req.query.supplier;
        }

        // Nếu nhập từ khóa tìm kiếm
        if (req.query.q && req.query.q.trim() !== '') {
            query.name = { $regex: req.query.q.trim(), $options: 'i' };
        }

        // Lấy sản phẩm theo query
        const products = await Product.find(query).populate('supplierId').lean();

        res.render('index', {
            products,
            suppliers,
            selectedSupplier: req.query.supplier || '',
            q: req.query.q || '',
            currentUser: req.session.user || null
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading products');
    }
});

module.exports = router;