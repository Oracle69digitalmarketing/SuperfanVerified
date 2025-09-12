import express from "express";
import passport from "passport";

const router = express.Router();

// Step 1: Redirect to Spotify for login
router.get("/spotify", passport.authenticate("spotify", {
  scope: ["user-read-email", "user-read-private", "playlist-read-private"],
}));

// Step 2: Callback from Spotify
router.get(
  "/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful login
    res.redirect("/dashboard"); 
  }
);

export default router;
