import { config } from "@src/config";
import { Express, Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

const route = (app: Express) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    (req: Request, res: Response) => {
      const user = req.user as any;
      const token = jwt.sign({ id: user.id }, config.jwt.secret, {
        expiresIn: "1h",
      });
      res.json({ token });
    }
  );
};

export default route;
