const mongoose = require('mongoose');
let conn = null;

async function connect() {
  if (conn == null) {
    conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  }
  return conn;
}

module.exports = connect;
