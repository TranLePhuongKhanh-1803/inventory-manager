const Supplier = require('../models/Supplier');

exports.index = async(req, res) => {
    const suppliers = await Supplier.find().sort('name').lean();
    res.render('suppliers/index', { suppliers });
};

exports.newForm = (req, res) => res.render('suppliers/form', { supplier: {}, action: '/suppliers', method: 'POST' });

exports.create = async(req, res) => {
    await Supplier.create(req.body);
    res.redirect('/suppliers');
};

exports.editForm = async(req, res) => {
    const supplier = await Supplier.findById(req.params.id).lean();
    if (!supplier) return res.redirect('/suppliers');
    res.render('suppliers/form', { supplier, action: `/suppliers/${supplier._id}?_method=PUT`, method: 'POST' });
};

exports.update = async(req, res) => {
    await Supplier.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/suppliers');
};

exports.delete = async(req, res) => {
    await Supplier.findByIdAndDelete(req.params.id);
    res.redirect('/suppliers');
};