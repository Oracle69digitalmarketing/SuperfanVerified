// models/GatedContent.js
import mongoose from "mongoose";

const gatedContentSchema = new mongoose.Schema(
  {
    // 📝 Content metadata
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    contentType: {
      type: String,
      enum: ["text", "image", "video", "link", "nft", "other"],
      default: "text",
    },
    contentUrl: { type: String, trim: true }, // could be CDN, IPFS, etc.

    // 🔐 Access control
    requiredTier: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Legend"],
      default: "Bronze",
    },
    requiredPoints: { type: Number, default: 0 },
    requiredRewards: [{ type: String }], // e.g. badges, streak milestones

    // 📊 Engagement tracking
    views: { type: Number, default: 0 },
    claimedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // 👤 Ownership / Admin
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("GatedContent", gatedContentSchema);
