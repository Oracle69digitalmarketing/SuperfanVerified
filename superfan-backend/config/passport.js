import passport from "passport";
import SpotifyStrategy from "passport-spotify";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import TwitterStrategy from "passport-twitter";

// ===== SPOTIFY =====
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: process.env.SPOTIFY_CALLBACK_URL,
    },
    (accessToken, refreshToken, expires_in, profile, done) => {
      const user = { provider: "spotify", profile, accessToken, refreshToken };
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
    (accessToken, refreshToken, profile, done) => {
      const user = { provider: "google", profile, accessToken, refreshToken };
      return done(null, user);
    }
  )
);

// ===== FACEBOOK =====
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ["id", "displayName", "emails"],
    },
    (accessToken, refreshToken, profile, done) => {
      const user = { provider: "facebook", profile, accessToken, refreshToken };
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
    (accessToken, refreshToken, profile, done) => {
      const user = { provider: "twitter", profile, accessToken, refreshToken };
      return done(null, user);
    }
  )
);

// ===== SESSION HANDLING =====
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

export default passport;
