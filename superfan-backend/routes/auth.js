// routes/auth.js
import express from "express";
import passport from "passport";
import { createTokensForUser } from "../controllers/tokenController.js";

const router = express.Router();

// ===== SPOTIFY =====
router.get(
  "/spotify",
  passport.authenticate("spotify", { scope: ["user-read-email", "user-read-private"] })
);

router.get(
  "/spotify/callback",
  passport.authenticate("spotify", { session: false, failureRedirect: "/login" }),
  async (req, res) => {
    // req.user is the DB user (from handleUser)
    const tokens = await createTokensForUser(req.user);
    // redirect to frontend with tokens
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
    return res.redirect(redirectUrl);
  }
);

// ===== GOOGLE =====
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => res.redirect("/dashboard"));

// ===== FACEBOOK =====
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => res.redirect("/dashboard"));

// ===== TWITTER =====
router.get("/twitter", passport.authenticate("twitter"));
router.get("/twitter/callback", passport.authenticate("twitter", { failureRedirect: "/login" }), (req, res) => res.redirect("/dashboard"));

export default router;
