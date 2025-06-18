const connect = require('./connectDB.js');
const mongoose = require('mongoose');
const { authenticator } = require("otplib");
const crypto = require("crypto-js");
const fs = require('fs');

function decrypt (password) {
    const bytes = crypto.AES.decrypt(password, process.env.KEY_ENCRYPT)
    return bytes.toString(crypto.enc.Utf8)
}

module.exports = async (event, context) => {
  // Handle CORS preflight request
  if (event.method === "OPTIONS") {
    return context
      .status(200)
      .headers({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      })
      .succeed();
  }

  const { username, password, code2fa } = event.body;

  if (!username) {
    return context.status(400).headers({ "Access-Control-Allow-Origin": "*" }).fail("Missing fields");
  }

  try {
    await connect();

    const userSchema =  new mongoose.Schema({
        username: { type: String, unique: true },
        password: String,
        mfa: String,
        gendate: Number,
        expired: { type: Boolean, default: false }
    });

    const userModel = mongoose.models.User || mongoose.model('User', userSchema);

    const user = await userModel.findOne({ username });

    if (!user) {
      return context.status(404).headers({ "Access-Control-Allow-Origin": "*" }).fail("Username or password incorrect");
    }

    const sixMonth = 6 * 30 * 24 * 60 * 60 * 1000; // 6 months in milliseconds
    if (user.expired || (Date.now() - user.gendate) > sixMonth) {
      // Transformer expired en true
      return context.status(403).headers({ "Access-Control-Allow-Origin": "*" }).fail("Account expired, please generate new credentials");
    }

    const decryptedPassword = decrypt(user.password);
    if (decryptedPassword !== password) {
      return context.status(404).headers({ "Access-Control-Allow-Origin": "*" }).fail("Username or password incorrect");
    }

    const secret = decrypt(user.mfa);
    const isValid2FA = authenticator.check(code2fa, secret);
    if (!isValid2FA) {
      return context.status(401).headers({ "Access-Control-Allow-Origin": "*" }).fail("Invalid 2FA code");
    }

    return context.status(200).headers({ "Access-Control-Allow-Origin": "*" }).succeed({ success: true, message: "Login successful" });

  } catch (err) {
    return context.status(500).headers({ "Access-Control-Allow-Origin": "*" }).fail("Erreur: " + err.message);
  }
};
