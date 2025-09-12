import express from "express";
import passport from "passport";

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
