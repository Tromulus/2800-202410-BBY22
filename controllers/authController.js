// importing objects from authServices
const { signup, login } = require("../services/authService");
const Joi = require("joi");

const signUpController = async (req, res, next) => {
  try {
    const { username, email, password, address, city, province, postal } = req.body;

    const schema = Joi.object({
      username: Joi.string()
      .alphanum()
      .min(3)
      .max(30)
      .required()
      .messages({
          'string.base': 'Username must be a string',
          'string.empty': 'Username is required',
          'string.alphanum': 'Username must only contain alphanumeric characters',
          'string.min': 'Username must be at least 3 characters long',
          'string.max': 'Username must be at most 30 characters long'
      }),
      email: Joi.string()
      .email({tlds: {allow: false}})
      .required()
      .messages({
          'string.base': 'Email must be a string',
          'string.empty': 'Email is required',
          'string.email': 'Email must be a valid email',
          'string.domain': 'Email must be a valid email'
      }),
      address: Joi.string().trim().required().messages({
          'any.required': 'Address is required.',
          'string.empty': 'Address cannot be empty.'
      }),
      city: Joi.string().trim().required().messages({
          'any.required': 'City is required.',
          'string.empty': 'City cannot be empty.'
      }),
      province: Joi.string().trim().required().messages({
          'any.required': 'Province is required.',
          'string.empty': 'Province cannot be empty.'
      }),
      postal: Joi.string().trim().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)
          .required().messages({
              'any.required': 'Postal code is required.',
              'string.empty': 'Postal code cannot be empty.',
              'string.pattern.base': 'Postal code must be a valid Canadian postal code.'
          })
  });
  
  const validationResult = schema.validate({ username, email, address, city, province, postal }, { abortEarly: false });
  if (validationResult.error != null) {
  let errorMessages = validationResult.error.details.map(detail => detail.message);
  res.redirect('/signup?errors=' + encodeURIComponent(JSON.stringify(errorMessages)));
  return;
  }

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
