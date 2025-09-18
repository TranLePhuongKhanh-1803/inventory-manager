require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const supplierRoutes = require('./routes/suppliers');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err.message));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 hours
}));

// Expose current user to views
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    res.locals.title = 'Inventory Manager';
    next();
});

// Routes
app.use('/', authRoutes); // /login, /register, /logout
app.use('/', indexRoutes); // index page /
app.use('/products', productRoutes); // CRUD sản phẩm
app.use('/suppliers', supplierRoutes); // CRUD nhà cung cấp

// 404
app.use((req, res) => res.status(404).render('404', { url: req.originalUrl }));

// Start server
app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));