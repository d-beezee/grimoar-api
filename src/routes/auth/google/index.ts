import { sign } from "@src/features/jwt/sign";
import { Express, Request, Response } from "express";
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

      const token = sign({ email: user.email });
      res.json({ token });
    }
  );
};

export default route;
