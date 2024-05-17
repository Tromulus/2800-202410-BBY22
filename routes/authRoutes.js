const express = require('express');
const { signUpController, loginController, logoutController } = require('../controllers/authController');

const router = express.Router();

router.get('/signup', (req, res) => res.render('signup'));
router.post('/createUser', signUpController);

router.get('/login', (req, res) => res.render('login'));
router.post('/submitUser', loginController);

router.get('/robots', (req, res) => res.render('robots'));
router.get('/robot_details/:id', (req,res) => {
    res.render('robot_details', {robot: req.params.id});
});

router.get('/logout', logoutController);

router.get('/index', (req, res) => {
    // Check if the user is authenticated (logged in)
    if (req.session.authenticated) {
        // Pass the username to the index.ejs template
        res.render('index', { username: req.session.username });
    } else {
        // If the user is not authenticated, redirect to the login page
        res.redirect('/login');
    }
});

module.exports = router;