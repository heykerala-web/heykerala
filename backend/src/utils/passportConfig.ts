import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import User from "../models/User";


// GOOGLE LOGIN FIXED
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        // 1️ FIND USER BY EMAIL FIRST
        let user = await User.findOne({ email });

        if (user) {
          // 2 If Google ID not linked → link it
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // 3️ If no user exists → create new Google user
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email,
          provider: "google",
        });

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// FACEBOOK LOGIN FIXED
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID!,
      clientSecret: process.env.FACEBOOK_APP_SECRET!,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/facebook/callback`,
      profileFields: ["id", "displayName", "emails"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        // 1️ Check if email already exists
        let user = await User.findOne({ email });

        if (user) {
          // 2️ Link Facebook ID if missing
          if (!user.facebookId) {
            user.facebookId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // 3️ Create new user
        user = await User.create({
          facebookId: profile.id,
          name: profile.displayName,
          email,
          provider: "facebook",
        });

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;


