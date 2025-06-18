import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    mfa: String,
    generate: Number,
    expired: { type: Boolean, default: false }
});

export default mongoose.model('User', schema);