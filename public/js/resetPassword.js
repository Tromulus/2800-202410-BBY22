const User = require('../models/user.js');
const crypto = require("crypto");
const bcrypt = require('bcrypt');

//token
const Token = require("../models/token.js");
////////


//Generate a random token using crypto API
const passwordReset = async(email) => {
    const user = await User.findONe({email});
    if (!user) {
        throw new Error("User does not exist");
    }
    let token = await Token.findOne({userId: user._id});
    if (token) {
        await token.deleteOne();
    }
    let resetToken = crypto.randomBytes(32).toString("hex");
    const hashToken = await bcrypt.hash(resetToken, 12);
    await new Token({
        userId: user._id,
        token: hashToken,
        createdAt: Date.now(),
    }).save();


  const link = `${url}/passwordReset?token=${resetToken}&id=${user._id}`;
  sendEmail(user.email,"Password Reset Request",{name: user.username,link: link,},"");
  return link;
};
////////