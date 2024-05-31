const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/profile', profileController.getProfile);
router.post('/update/:email', profileController.updateProfile);

module.exports = router;