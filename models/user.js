const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  address: String,
  city: String,
  province: String,
  postal: String,
});

module.exports = mongoose.model("User", userSchema);
