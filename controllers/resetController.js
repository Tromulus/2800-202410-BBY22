const { resetPassword, passwordReset, User } = require('../public/js/resetPassword');

const submitForgotPassword = async (req, res) => {
    const email = req.body.email;
    try {
        await passwordReset(email);
        res.render('checkYourEmail');
    } catch (error) {
        console.log(error);
        res.status(500).send("Failed to send password reset email.");
    }
};

const displayPasswordResetForm = async (req, res) => {
    const { token, id } = req.query;
    console.log(token);
    try {
        if (!token || !id) {
            throw new Error("Missing token or user ID.");
        }
        res.render('newPasswordForm', { token, id });
    } catch (error) {
        res.status(400).send("Error: " + error.message);
    }
};

const updatePassword = async (req, res) => {
    const { userId, token, password, repeatPassword } = req.body;
    try {
        if (password !== repeatPassword) {
            throw new Error("Passwords do not match.");
        }
        const result = await resetPassword(userId, token, password);
        const user = await User.findById(userId);
        res.render('resetSucceed', { user });
    } catch (error) {
        res.status(500).send("Failed to reset password: " + error.message);
    }
};

module.exports = {
    submitForgotPassword,
    displayPasswordResetForm,
    updatePassword
};
