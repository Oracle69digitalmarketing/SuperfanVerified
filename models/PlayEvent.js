import mongoose from 'mongoose';

const playEventSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artist: { type: String, required: true },
    delta: { type: Number, default: 0 },
    source: { type: String, default: 'unknown' },
  },
  { timestamps: true }
);

const PlayEvent = mongoose.model('PlayEvent', playEventSchema);
export default PlayEvent;
