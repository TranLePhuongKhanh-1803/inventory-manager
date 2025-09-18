const Supplier = require('../models/Supplier');

module.exports.validateProduct = async(req, res, next) => {
    const { name, price, quantity, supplierId } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) errors.push('Name phải >= 2 ký tự');
    if (isNaN(price) || Number(price) < 0) errors.push('Price phải >= 0');
    if (isNaN(quantity) || Number(quantity) < 0) errors.push('Quantity phải >= 0');
    if (!supplierId) errors.push('Supplier là bắt buộc');

    if (errors.length > 0) {
        // load lại danh sách suppliers để re-render form
        const suppliers = await Supplier.find();
        return res.status(400).render('products/form', {
            product: req.body,
            suppliers,
            errors
        });
    }


    next();
};