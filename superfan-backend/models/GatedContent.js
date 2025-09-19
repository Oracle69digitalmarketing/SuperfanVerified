// models/GatedContent.js
import mongoose from "mongoose";

const gatedContentSchema = new mongoose.Schema(
  {
    // 🎯 Core content info
    title: { type: String, required: true },
    description: { type: String, default: "" },
    contentUrl: { type: String, required: true },

    // 🧾 Fan requirements
    minFanScore: { type: Number, default: 0 },           // minimum fan streak required
    requiredFanTier: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Legend"],
      default: "Bronze",
    },

    // 🔐 Verification requirements
    requireXionDave: { type: Boolean, default: false },  // must be XIONDave verified
    requireZKTLS: { type: Boolean, default: false },     // must be ZKTLS verified

    // 🎁 Access rewards
    accessPoints: { type: Number, default: 0 },          // points granted on first unlock

    // 📅 Timestamps
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // adds updatedAt automatically
);

export default mongoose.model("GatedContent", gatedContentSchema);
