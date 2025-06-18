const connect = require('./connectDB.js');
const mongoose = require('mongoose');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const { authenticator } = require("otplib");
const crypto = require('crypto-js');

function generatePassword(length = 24) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

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
  
  try {
    const { username } = event.body;
    if (!username) return context.status(400).headers({ "Access-Control-Allow-Origin": "*" }).fail("Missing username");

    await connect();

    const passwordPlain = generatePassword();
    const passwordHash = encrypt(passwordPlain);

    const qrData = JSON.stringify({ username, password: passwordPlain });
    const qr = await qrcode.toDataURL(qrData);

    const gendate = Date.now();

    const userSchema =  new mongoose.Schema({
      username: { type: String, unique: true },
      password: String,
      mfa: String,
      gendate: Number,
      expired: { type: Boolean, default: false }
  });

    const userModel = mongoose.models.User || mongoose.model('User', userSchema);

    const user = new userModel({
        username,
        password: passwordHash,
        gendate,
        expired: 0
      }
    );
    await user.save();

    return context.status(200).headers({ "Access-Control-Allow-Origin": "*" }).succeed({
      qrcode: qr,
      gendate
    });

  } catch (err) {
    return context.status(500).headers({ "Access-Control-Allow-Origin": "*" }).fail("Erreur: " + err.message);
  }
};
