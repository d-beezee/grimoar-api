import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../../../models/User";

const strategy = new LocalStrategy(
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

    return cb(null, { ...user, _id: user.id });
  }
);

passport.use(strategy);
