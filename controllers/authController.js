
// importing objects from authServices
const { signup, login } = require('../services/authService');

const signUpController = async (req, res, next) => {
    try {
        await signup(req.body);
        req.session.authenticated = true;
        req.session.username = req.body.username;
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24;
        return res.redirect('/index');
        
    } catch (error) {
        next(error);
    }
};

const loginController = async (req, res, next) => {
    try {
        await login(req.body);
        req.session.authenticated = true;
        req.session.username = req.body.username;
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24;
        return res.redirect('/index');
    } catch (error) {
        console.error('Error: ', error.message);
        res.render('loginError', {errorMessage: error.message});
    }
};

const logoutController = (req, res) => {
    console.log("Logging out.");
    req.session.destroy();
    res.redirect("/");
};

module.exports = {
    signUpController,
    loginController,
    logoutController
};


// --------------------- < Copied from ResetPassword Website > ----------------------- //


// const {
//     signup,
//     requestPasswordReset,
//     resetPassword,
// } = require("../services/auth.service");

// const signUpController = async (req, res, next) => {
//     const signupService = await signup(req.body);
//     return res.json(signupService);
// };

// const resetPasswordRequestController = async (req, res, next) => {
//     const requestPasswordResetService = await requestPasswordReset(
//         req.body.email
//     );
//     return res.json(requestPasswordResetService);
// };

// const resetPasswordController = async (req, res, next) => {
//     const resetPasswordService = await resetPassword(
//         req.body.userId,
//         req.body.token,
//         req.body.password
//     );
//     return res.json(resetPasswordService);
// };

// module.exports = {
//     signUpController,
//     resetPasswordRequestController,
//     resetPasswordController,
// };