import express from "express";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

// ----------------------------
// Social login / callback
// ----------------------------
router.get(
  "/:provider",
  (req, res, next) => {
    const provider = req.params.provider;
    if (!["spotify", "google", "facebook", "twitter"].includes(provider)) {
      return res.status(400).json({ error: "Unsupported provider" });
    }
    passport.authenticate(provider, { scope: ["email", "profile"] })(req, res, next);
  }
);

// ----------------------------
// Social callback handler
// ----------------------------
router.get(
  "/:provider/callback",
  passport.authenticate(["spotify", "google", "facebook", "twitter"], {
    session: false,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      // Always include verification flags
      const payload = {
        id: user._id,
        name: user.name,
        walletAddress: user.walletAddress,
        fanTier: user.fanTier,
        points: user.points,
        xionDaveVerified: user.xionDaveVerified || false,
        zktlsVerified: user.zktlsVerified || false,
      };

      // Send JWT or session token
      res.json({ user: payload, token: req.userToken });
    } catch (err) {
      console.error("Auth callback error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
