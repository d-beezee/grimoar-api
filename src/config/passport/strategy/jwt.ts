import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { config } from "../..";
import User from "../../../models/User";

const strategy = new JwtStrategy(
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
);
passport.use(strategy);
