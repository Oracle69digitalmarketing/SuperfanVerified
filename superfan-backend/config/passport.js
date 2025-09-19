// config/passport.js
import 'dotenv/config'; // ← must be first
import passport from "passport";
import { Strategy as SpotifyStrategy } from "passport-spotify";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as TwitterStrategy } from "passport-twitter";
import { handleUser } from "../controllers/userController.js";

// Debug env variables (temporary)
console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID);
console.log('FACEBOOK_CLIENT_ID:', process.env.FACEBOOK_APP_ID);

// ===== SPOTIFY =====
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await handleUser(profile, "spotify");
      return done(null, user);
    }
  )
);

// ===== GOOGLE =====
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await handleUser(profile, "google");
      return done(null, user);
    }
  )
);

// ===== FACEBOOK =====
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID, // ← use env variable exactly as in .env
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "emails", "name"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await handleUser(profile, "facebook");
      return done(null, user);
    }
  )
);

// ===== TWITTER =====
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
    },
    async (token, tokenSecret, profile, done) => {
      const user = await handleUser(profile, "twitter");
      return done(null, user);
    }
  )
);

export default passport;
