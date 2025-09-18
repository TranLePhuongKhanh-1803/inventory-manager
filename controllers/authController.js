const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.showRegister = (req, res) => res.render('auth/register', { error: null });
exports.showLogin = (req, res) => res.render('auth/login', { error: null });

exports.register = async(req, res) => {
    try {
        const { username, password, email, phone } = req.body;
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) return res.render('auth/register', { error: 'Username or email exists' });

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ username, passwordHash: hash, email, phone, role: 'user' });
        req.session.user = { id: user._id, username: user.username, email: user.email, role: user.role };
        res.redirect('/');
    } catch (err) {
        res.render('auth/register', { error: err.message });
    }
};

exports.login = async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.render('auth/login', { error: 'Invalid credentials' });
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.render('auth/login', { error: 'Invalid credentials' });
        req.session.user = { id: user._id, username: user.username, email: user.email, role: user.role };
        res.redirect('/');
    } catch (err) {
        res.render('auth/login', { error: err.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => res.redirect('/'));
};

// forgot password skeleton (prints token to console)
exports.showForgot = (req, res) => res.render('auth/forgot', { message: null, error: null });
exports.forgot = async(req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.render('auth/forgot', { error: 'Email not found', message: null });
        const token = (Math.random() * 1e9 | 0).toString(36);
        console.log(`Reset token for ${email}: ${token}`);
        res.render('auth/forgot', { message: 'Reset token created (check server log)', error: null });
    } catch (err) {
        res.render('auth/forgot', { message: null, error: err.message });
    }
};