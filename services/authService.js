const bcrypt = require("bcrypt");
const Joi = require("joi");
const User = require("../models/user");

const signup = async (data) => {
  const { username, email, password, address, city, province, postal } = data;
  
  const hashedPassword = await bcrypt.hash(password, 12);
  try {
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      address,
      city,
      province,
      postal,
    });
    await newUser.save();
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal server error");
    return;
  }
  return true;
};

const login = async (data) => {
  const { username, password } = data;

  const schema = Joi.string().max(20).required();
  const validationResult = schema.validate(username);
  if (validationResult.error) {
    throw new Error(validationResult.error.details[0].message);
  }

  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found.");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Incorrect password.");
  }
};

module.exports = { signup, login };

// ------------------------------- < From ResetPassword Website > ---------------------------------- //

// const JWT = require("jsonwebtoken");
// const User = require("../models/User.model");
// const Token = require("../models/Token.model");
// const sendEmail = require("../utils/email/sendEmail");
// const crypto = require("crypto");
// const bcrypt = require("bcrypt");

// const signup = async (data) => {
//     let user = await User.findOne({ email: data.email });
//     if (user) {
//         throw new Error("Email already exist");
//     }
//     user = new User(data);
//     const token = JWT.sign({ id: user._id }, JWTSecret);
//     await user.save();
//     return (data = {
//         userId: user._id,
//         email: user.email,
//         name: user.name,
//         token: token,
//     });
// };

// // --------------

// const requestPasswordReset = async (email) => {

//     const user = await User.findOne({ email });

//     if (!user) throw new Error("User does not exist");
//     let token = await Token.findOne({ userId: user._id });
//     if (token) await token.deleteOne();
//     let resetToken = crypto.randomBytes(32).toString("hex");
//     const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

//     await new Token({
//         userId: user._id,
//         token: hash,
//         createdAt: Date.now(),
//     }).save();

//     const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
//     sendEmail(user.email, "Password Reset Request", { name: user.name, link: link, }, "./template/requestResetPassword.handlebars");
//     return link;
// };

// // -------------------

// const resetPassword = async (userId, token, password) => {
//     let passwordResetToken = await Token.findOne({ userId });
//     if (!passwordResetToken) {
//         throw new Error("Invalid or expired password reset token");
//     }
//     const isValid = await bcrypt.compare(token, passwordResetToken.token);
//     if (!isValid) {
//         throw new Error("Invalid or expired password reset token");
//     }
//     const hash = await bcrypt.hash(password, Number(bcryptSalt));
//     await User.updateOne(
//         { _id: userId },
//         { $set: { password: hash } },
//         { new: true }
//     );
//     const user = await User.findById({ _id: userId });
//     sendEmail(
//         user.email,
//         "Password Reset Successfully",
//         {
//             name: user.name,
//         },
//         "./template/resetPassword.handlebars"
//     );
//     await passwordResetToken.deleteOne();
//     return true;
// };
