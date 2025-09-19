import express from "express";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

// ----------------------------
// Mark XION Dave verified
// ----------------------------
router.post(
  "/verify/xion",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.xionDaveVerified = true;
      user.daveProofId = req.body.proofId || null;
      await user.save();

      res.json({ message: "XION Dave verified", user });
    } catch (err) {
      console.error("XION Dave verify error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// ----------------------------
// Mark ZKTLS verified
// ----------------------------
router.post(
  "/verify/zktls",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });

      user.zktlsVerified = true;
      await user.save();

      res.json({ message: "ZKTLS verified", user });
    } catch (err) {
      console.error("ZKTLS verify error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
