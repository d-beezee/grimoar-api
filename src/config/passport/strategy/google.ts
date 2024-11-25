import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "../..";
import User from "../../../models/User";

const google = new GoogleStrategy(
  {
    clientID: config.google.clientId,
    clientSecret: config.google.clientSecret,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOrCreate({
        googleId: profile.id,
        email:
          profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : undefined,
      });
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  }
);

passport.use(google);
