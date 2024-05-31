const express = require('express');
const { signUpController, loginController, logoutController } = require('../controllers/authController');

const router = express.Router();

router.get('/signup', (req, res) => res.render('signup'));
router.post('/createUser', signUpController);

router.get('/login', (req, res) => res.render('login'));
router.post('/submitUser', loginController);

router.get('/logout', logoutController);

module.exports = router;