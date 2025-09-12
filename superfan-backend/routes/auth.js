import express from "express";
import passport from "passport";
// routes/token.js
import express from 'express';
import { refresh, revoke } from '../controllers/tokenController.js';
const router = express.Router();

router.post('/refresh', refresh);
router.post('/revoke', revoke);

export default router;

// routes/auth.js (callback section)
import express from 'express';
import passport from 'passport';
import { createTokensForUser } from '../controllers/tokenController.js';

const router = express.Router();

// Spotify callback
router.get('/spotify/callback', passport.authenticate('spotify', { session: false, failureRedirect: '/login' }), async (req, res) => {
  // req.user is the DB user (from handleUser)
  const tokens = await createTokensForUser(req.user);
  // Option A: redirect to frontend with tokens (URL length limited)
  const redirectUrl = `${process.env.FRONTEND_URL}/auth/success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
  return res.redirect(redirectUrl);
});

const router = express.Router();

// ===== SPOTIFY =====
router.get("/spotify", passport.authenticate("spotify", { scope: ["user-read-email", "user-read-private"] }));
router.get("/spotify/callback", passport.authenticate("spotify", { failureRedirect: "/login" }), (req, res) => res.redirect("/dashboard"));

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
