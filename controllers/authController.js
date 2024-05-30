// importing objects from authServices
const { signup, login } = require("../public/js/authService");

const signUpController = async (req, res, next) => {
  try {
    await signup(req.body);
    req.session.authenticated = true;
    req.session.username = req.body.username;
    req.session.cookie.maxAge = 1000 * 60 * 60 * 24;
    return res.redirect("/robots");
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
    return res.redirect("/robots");
  } catch (error) {
    console.error("Error: ", error.message);
    res.render("loginError", { errorMessage: error.message });
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
  logoutController,
};