const express = require('express');
const router = express.Router();
const { resetPassword, passwordReset } = require('../public/js/resetPassword'); 
// this is for testing.
router.get('/loginin', (req, res) => {
  res.render('testGenerateToken'); 
});

router.post('/submit-forgot-password', async (req, res) => {
  const email = req.body.email;
  try {
      await passwordReset(email);
      res.send("If an account with that email was found, we have sent a link to reset your password.");
  } catch (error) {
      console.log(error);
      res.status(500).send("Failed to send password reset email.");
  }
});



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