// middleware/requireLogin.js
module.exports = function requireLogin(req, res, next) {
    if (!req.session.user) {
        // Nếu chưa login, redirect về trang login
        return res.redirect('/login');
    }
    next();
};