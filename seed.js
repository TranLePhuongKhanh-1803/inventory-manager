require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');
const User = require('./models/User');

async function seed() {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await Supplier.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    const s1 = await Supplier.create({ name: 'Acme Pharma', address: 'Hanoi', phone: '0123456789' });
    const s2 = await Supplier.create({ name: 'HealthCorp', address: 'HCM', phone: '0987654321' });

    await Product.create({ name: 'Paracetamol 500mg', price: 10, quantity: 100, supplierId: s1._id });
    await Product.create({ name: 'Vitamin C 1000', price: 5, quantity: 200, supplierId: s2._id });

    const hash = await bcrypt.hash('password123', 10);
    await User.create({ username: 'admin', passwordHash: hash, email: 'admin@example.com', phone: '0123456789', role: 'admin' });

    console.log('Seed done');
    process.exit();
}

seed().catch(err => { console.error(err);
    process.exit(1); });