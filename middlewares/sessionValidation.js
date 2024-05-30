//niko wang - sessionValidation middleware will be used in some routes.
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
