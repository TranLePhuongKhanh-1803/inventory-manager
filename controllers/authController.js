// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Hiển thị trang đăng ký
exports.showRegister = (req, res) => res.render('auth/register', { error: null });

// Hiển thị trang đăng nhập
exports.showLogin = (req, res) => res.render('auth/login', { error: null });

// Đăng ký người dùng
exports.register = async(req, res) => {
    try {
        const { username, password, email, phone } = req.body;

        // Kiểm tra trùng username hoặc email
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) {
            return res.render('auth/register', { error: 'Username hoặc email đã tồn tại' });
        }

        // Hash mật khẩu
        const hash = await bcrypt.hash(password, 10);

        // Tạo user mới (mặc định role = 'user')
        const user = await User.create({ username, passwordHash: hash, email, phone, role: 'user' });

        // Lưu session
        req.session.user = { id: user._id, username: user.username, email: user.email, role: user.role };
        res.redirect('/');
    } catch (err) {
        res.render('auth/register', { error: err.message });
    }
};

// Đăng nhập
exports.login = async(req, res) => {
    try {
        const { username, password } = req.body;

        // Tìm user theo username
        const user = await User.findOne({ username });
        if (!user) return res.render('auth/login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng' });

        // So sánh mật khẩu
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.render('auth/login', { error: 'Tên đăng nhập hoặc mật khẩu không đúng' });

        // Lưu session
        req.session.user = { id: user._id, username: user.username, email: user.email, role: user.role };
        res.redirect('/');
    } catch (err) {
        res.render('auth/login', { error: err.message });
    }
};

// Đăng xuất
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) console.error('Session destroy error:', err);
        res.redirect('/');
    });
};

// Hiển thị trang quên mật khẩu
exports.showForgot = (req, res) => res.render('auth/forgot', { message: null, error: null });

// Xử lý quên mật khẩu (skeleton)
exports.forgot = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.render('auth/forgot', { error: 'Email không tồn tại', message: null });

        // Sinh token tạm thời
        const token = (Math.random() * 1e9 | 0).toString(36);
        console.log(`Reset token cho ${email}: ${token}`);

        res.render('auth/forgot', { message: 'Reset token đã tạo (xem console)', error: null });
    } catch (err) {
        res.render('auth/forgot', { message: null, error: err.message });
    }
};