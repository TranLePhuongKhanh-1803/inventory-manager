const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

exports.index = async(req, res) => {
    try {
        const suppliers = await Supplier.find().sort('name').lean();

        // Xây dựng query lọc sản phẩm
        let query = {};

        // Lọc theo nhà cung cấp
        if (req.query.supplier && req.query.supplier !== '') {
            query.supplierId = req.query.supplier;
        }

        // Tìm kiếm theo tên sản phẩm (case-insensitive)
        if (req.query.q && req.query.q.trim() !== '') {
            query.name = { $regex: req.query.q.trim(), $options: 'i' };
        }

        // Lấy danh sách sản phẩm, populate thông tin nhà cung cấp
        const products = await Product.find(query).populate('supplierId').lean();

        // Render view
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
};

// Form thêm sản phẩm
exports.newForm = async(req, res) => {
    const suppliers = await Supplier.find().sort('name').lean();
    res.render('products/form', {
        action: '/products',
        method: null,
        product: {},
        suppliers,
        error: null,
        currentUser: req.session.user || null
    });
};

// Tạo sản phẩm mới
exports.create = async(req, res) => {
    try {
        const { name, price, quantity, supplierId } = req.body;
        await Product.create({ name, price, quantity, supplierId });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        const suppliers = await Supplier.find().sort('name').lean();
        res.render('products/form', {
            action: '/products',
            method: null,
            product: req.body,
            suppliers,
            error: 'Error creating product',
            currentUser: req.session.user || null
        });
    }
};

// Form sửa sản phẩm
exports.editForm = async(req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).lean();
    const suppliers = await Supplier.find().sort('name').lean();
    res.render('products/form', {
        action: `/products/${id}`,
        method: 'PUT',
        product,
        suppliers,
        error: null,
        currentUser: req.session.user || null
    });
};

// Cập nhật sản phẩm
exports.update = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity, supplierId } = req.body;
        await Product.findByIdAndUpdate(id, { name, price, quantity, supplierId });
        res.redirect('/');
    } catch (err) {
        console.error(err);
        const suppliers = await Supplier.find().sort('name').lean();
        res.render('products/form', {
            action: `/products/${req.params.id}`,
            method: 'PUT',
            product: req.body,
            suppliers,
            error: 'Error updating product',
            currentUser: req.session.user || null
        });
    }
};

// Xóa sản phẩm
exports.delete = async(req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.send('Error deleting product');
    }
};