const bcrypt = require("bcrypt");
const Joi = require("joi");
const User = require("../../models/user");

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