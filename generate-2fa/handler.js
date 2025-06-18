const connect = require('./connectDB.js');
const mongoose = require('mongoose');
const { authenticator } = require("otplib");
const QRCode = require("qrcode");
const crypto = require("crypto-js");

function encrypt(text) {
  return crypto.AES.encrypt(text, process.env.KEY_ENCRYPT).toString();
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

  const { username } = event.body;

  if (!username) {
    return context.status(400).headers({ "Access-Control-Allow-Origin": "*" }).fail("Missing username");
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

    const secret = authenticator.generateSecret();
    const otpAuth = authenticator.keyuri(username, "PoC-SecureApp", secret);
    const qrDataURL = await QRCode.toDataURL(otpAuth);

    const encryptedSecret = encrypt(secret);
    const gendate = Date.now();

    const user = await userModel.findOneAndUpdate(
      { username },
      {
        $set: {
          mfa: encryptedSecret,
          gendate,
          expired: false
        },
      },
      { new: true }
    );
    if (!user) {
      return context.status(404).headers({ "Access-Control-Allow-Origin": "*" }).fail("User not found");
    }

    return context.status(200).headers({ "Access-Control-Allow-Origin": "*" }).succeed({ username, qrcode: qrDataURL })

  } catch (err) {
    return context.status(500).headers({ "Access-Control-Allow-Origin": "*" }).fail("Erreur: " + err.message);
  }
};
