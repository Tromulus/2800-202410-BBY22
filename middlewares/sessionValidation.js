function isValidSession(req) {
    return req.session && req.session.authenticated;
}

function sessionValidation(req, res, next) {
    if (isValidSession(req)) {
        next();
    } else {
        res.redirect('/login');
    }
}

module.exports = sessionValidation;
