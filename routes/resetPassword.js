const express = require('express');
const router = express.Router();
const resetPassword = require('../routes/resetPassword'); 

// Display reset password form
router.get('/password-reset', async (req, res) => {
  const { token, id } = req.query;
  try {
    // Verify the token and ID
    if (!token || !id) {
      throw new Error("Missing token or user ID.");
    }
    // Render the reset password page with the token and ID
    res.render('newPasswordFrom', { token, id });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

router.post('/update-password', async (req, res) => {
    const { userId, token, password, repeatPassword } = req.body;
    try {
      if (password !== repeatPassword) {
        throw new Error("Passwords do not match.");
      }
      const result = await resetPassword(userId, token, password);
      res.send("Your password has been successfully reset.");
    } catch (error) {
      res.status(500).send("Failed to reset password: " + error.message);
    }
  });

module.exports = router;