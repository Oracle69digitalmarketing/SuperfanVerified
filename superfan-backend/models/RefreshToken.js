// models/RefreshToken.js
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false },
  replacedBy: { type: String, default: null }, // token rotation
}, { timestamps: true });

export default mongoose.model('RefreshToken', schema);
