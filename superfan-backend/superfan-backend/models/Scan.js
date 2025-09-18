// models/Scan.js
import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artist: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Scan', scanSchema);
