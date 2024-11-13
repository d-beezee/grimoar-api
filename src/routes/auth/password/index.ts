import { sign } from "@src/features/jwt/sign";
import { Express, Request, Response } from "express";
import passport from "passport";

const route = (app: Express) => {
  app.post("/auth/password", (req: Request, res: Response, next) => {
    passport.authenticate(
      "local",
      { session: false },
      (err: any, user: any, info: any) => {
        if (err || !user) {
          return res.status(400).json({
            message: info ? info.message : "Login failed",
            user: user,
          });
        }

        const token = sign({ email: user.email });

        // Invia il token al client
        return res.json({ message: "Login successful", token });
      }
    )(req, res, next);
  });
};

export default route;
