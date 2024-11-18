import passport from "passport";
import { Strategy as CookieStrategy } from "passport-cookie";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { config } from ".";
import User from "../models/User";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function verify(email, password, cb) {
      const user = await User.findOne({ email });
      if (!user) {
        return cb(null, false, { message: "Incorrect email or password." });
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        return cb(null, false, { message: "Incorrect email or password." });
      }

      return cb(null, user);
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.jwt.secret,
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findOne({ email: jwtPayload.email });
        if (user) return done(null, user);
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: "http://grimoar-api.vercel.app/auth/google/callback",
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
  )
);

passport.use(
  new CookieStrategy(
    {
      cookieName: "auth",
      signed: true,
    },
    function (token: string, done: any) {
      User.findByCookie(token).then((user) => {
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);
