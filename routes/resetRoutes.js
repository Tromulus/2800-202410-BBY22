const express = require('express');
const router = express.Router();
const resetController = require('../controllers/resetController');

router.get('/loginin', (req, res) => {
    res.render('testGenerateToken');
});

router.post('/submit-forgot-password', resetController.submitForgotPassword);
router.get('/passwordReset', resetController.displayPasswordResetForm);
router.post('/update-password', resetController.updatePassword);

module.exports = router;
