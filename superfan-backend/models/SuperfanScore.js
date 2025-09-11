// models/SuperfanScore.js
import mongoose from 'mongoose';

const SuperfanScoreSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    index: true,
  },
  artist: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  proof: {
    type: Object,
    required: true,
  },
  txHash: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

export default mongoose.model('SuperfanScore', SuperfanScoreSchema);
