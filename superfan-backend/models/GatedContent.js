import mongoose from "mongoose";

const gatedContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  minFanScore: { type: Number, default: 0 },
  contentUrl: { type: String, required: true },
  requiredFanTier: { type: String, enum: ["Bronze", "Silver", "Gold", "Legend"], default: "Bronze" },
  requireXionDave: { type: Boolean, default: false },
  requireZKTLS: { type: Boolean, default: false },
  accessPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("GatedContent", gatedContentSchema);
