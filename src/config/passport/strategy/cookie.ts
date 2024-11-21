import passport from "passport";
import { Strategy as CookieStrategy } from "passport-cookie";
import User from "../../../models/User";

const strategy = new CookieStrategy(
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
);

passport.use(strategy);
