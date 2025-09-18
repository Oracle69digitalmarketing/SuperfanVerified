import mongoose from 'mongoose';

const gatedContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  minFanScore: { type: Number, default: 0 },
  contentUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('GatedContent', gatedContentSchema);
