const Supplier = require('../models/Supplier');

exports.index = async(req, res) => {
    try {
        const suppliers = await Supplier.find().sort('name').lean();
        res.render('suppliers/index', {
            suppliers,
            selectedSupplier: req.query.supplier || '',
            q: req.query.q || '',
            products: [],
            currentUser: req.session.user || null // <-- quan trọng
        });
    } catch (err) {
        console.error(err);
        res.send('Error loading suppliers');
    }
};

exports.newForm = (req, res) => {
    res.render('suppliers/form', {
        action: '/suppliers',
        supplier: {},
        error: null // <-- thêm dòng này
    });
};


exports.create = async(req, res) => {
    try {
        const { name, address, phone } = req.body;
        const last = await Supplier.findOne().sort({ code: -1 }).lean();
        const lastNum = last ? parseInt(last.code.replace('SUP', '')) : 0;
        const code = 'SUP' + String(lastNum + 1).padStart(3, '0');

        await Supplier.create({ name, address, phone, code });
        res.redirect('/suppliers');
    } catch (err) {
        console.error(err);
        res.send('Error creating supplier');
    }
};

exports.editForm = async(req, res) => {
    const { id } = req.params;
    const supplier = await Supplier.findById(id).lean();
    res.render('suppliers/form', {
        action: `/suppliers/${id}?_method=PUT`,
        supplier,
        error: null // <-- thêm dòng này
    });
};


exports.update = async(req, res) => {
    const { id } = req.params;
    const { name, address, phone } = req.body;
    await Supplier.findByIdAndUpdate(id, { name, address, phone });
    res.redirect('/suppliers');
};

exports.delete = async(req, res) => {
    const { id } = req.params;
    await Supplier.findByIdAndDelete(id);
    res.redirect('/suppliers');
};