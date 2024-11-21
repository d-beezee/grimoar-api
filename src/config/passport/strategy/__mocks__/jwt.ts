import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";

const strategy = new CustomStrategy(function (req, callback) {
  const user = { email: "example@example.com" };
  req.user = user;
  callback(null, user);
});

passport.use("jwt", strategy);
