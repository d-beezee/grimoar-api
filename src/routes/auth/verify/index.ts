import { sign } from "@src/features/jwt/sign";
import { IUser } from "@src/models/User";
import { NextFunction, Request, Response } from "express";
import passport from "passport";

const route = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "cookie",
    { session: false },
    (err: any, user: IUser, info: any) => {
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : "Login failed",
          user: user,
        });
      }

      const token = sign({ email: user.email });

      // Invia il token al client
      return res.json({ message: "Verify successful", token });
    }
  )(req, res, next);
};

export default route;
