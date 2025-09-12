import passport from "passport";
import SpotifyStrategy from "passport-spotify";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import TwitterStrategy from "passport-twitter";
import User from "../models/User.js";

// ===== HANDLER FUNCTION =====
async function handleUser(profile, accessToken, refreshToken, provider, done) {
  try {
    let email = null;
    if (profile.emails && profile.emails.length > 0) {
      email = profile.emails[0].value;
    }

    let user = await User.findOne({ provider, providerId: profile.id });

    if (!user) {
      user = await User.create({
        provider,
        providerId: profile.id,
        displayName: profile.displayName || profile.username,
        email,
        accessToken,
        refreshToken,
        profile,
      });
    } else {
      // Update tokens on login
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}

// ===== STRATEGIES =====
passport.use(new SpotifyStrategy({
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: process.env.SPOTIFY_CALLBACK_URL,
}, (at, rt, exp, profile, done) => handleUser(profile, at, rt, "spotify", done)));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (at, rt, profile, done) => handleUser(profile, at, rt, "google", done)));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ["id", "displayName", "emails"],
}, (at, rt, profile, done) => handleUser(profile, at, rt, "facebook", done)));

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: process.env.TWITTER_CALLBACK_URL,
}, (at, rt, profile, done) => handleUser(profile, at, rt, "twitter", done)));

// ===== SESSIONS =====
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
