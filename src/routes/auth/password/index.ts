import { sign } from "@src/features/jwt/sign";
import { IUser } from "@src/models/User";
import { NextFunction, Request, Response } from "express";
import passport from "passport";

const route = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: any, user: IUser, info: any) => {
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : "Login failed",
          user: user,
        });
      }

      const token = sign({ email: user.email });
      const cookie = `${user.email}||${user.getCrypted()}`;

      // Invia il token al client
      return res
        .cookie("auth", cookie, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 28 * 24 * 60 * 60 * 1000,
          signed: true,
        })
        .json({ message: "Login successful", token });
    }
  )(req, res, next);
};
export default route;
