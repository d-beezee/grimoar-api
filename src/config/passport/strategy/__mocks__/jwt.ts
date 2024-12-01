import passport from "passport";
import { Strategy as CustomStrategy } from "passport-custom";

const strategy = new CustomStrategy(function (req, callback) {
  const user = {
    _id: "000000000000000000000000",
    email: "example@example.com",
  };
  req.user = user;
  callback(null, user);
});

passport.use("jwt", strategy);
