// routes/auth.js
import express from "express";
import passport from "passport";
import { createTokensForUser } from "../controllers/tokenController.js";

const router = express.Router();

/**
 * Helper: finalize login and redirect with tokens
 */
const handleAuthSuccess = async (req, res) => {
  try {
    const tokens = await createTokensForUser(req.user);
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
    return res.redirect(redirectUrl);
  } catch (err) {
    console.error("Auth Success Error:", err);
    return res.redirect(`${process.env.FRONTEND_URL}/auth/failure`);
  }
};

// ===== SPOTIFY =====
router.get(
  "/spotify",
  passport.authenticate("spotify", { scope: ["user-read-email", "user-read-private"] })
);

router.get(
  "/spotify/callback",
  passport.authenticate("spotify", { session: false, failureRedirect: "/login" }),
  handleAuthSuccess
);

// ===== GOOGLE =====
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  handleAuthSuccess
);

// ===== FACEBOOK =====
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: "/login" }),
  handleAuthSuccess
);

// ===== TWITTER =====
router.get("/twitter", passport.authenticate("twitter"));

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { session: false, failureRedirect: "/login" }),
  handleAuthSuccess
);

export default router;
