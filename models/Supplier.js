const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    phone: String,
    code: { type: String, unique: true } // mã nhà cung cấp
});

module.exports = mongoose.model('Supplier', supplierSchema);