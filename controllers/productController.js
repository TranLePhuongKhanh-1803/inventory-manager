const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

exports.index = async(req, res) => {
    const { supplier, q } = req.query;
    const filter = {};
    if (supplier) filter.supplierId = supplier;
    if (q) filter.name = new RegExp(q, 'i');

    const [products, suppliers] = await Promise.all([
        Product.find(filter).populate('supplierId').lean(),
        Supplier.find().sort('name').lean()
    ]);

    res.render('index', { products, suppliers, selectedSupplier: supplier || '', q: q || '' });
};

exports.newForm = async(req, res) => {
    const suppliers = await Supplier.find().sort('name').lean();
    res.render('products/form', { product: {}, suppliers, action: '/products', method: 'POST' });
};

exports.create = async(req, res) => {
    await Product.create(req.body);
    res.redirect('/');
};

exports.editForm = async(req, res) => {
    const product = await Product.findById(req.params.id).lean();
    const suppliers = await Supplier.find().sort('name').lean();
    res.render('products/form', { product, suppliers, action: `/products/${req.params.id}?_method=PUT`, method: 'POST' });
};

exports.update = async(req, res) => {
    await Product.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/');
};

exports.delete = async(req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/');
};