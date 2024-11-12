import express, { Request, Response } from "express";
import passport from "passport";
import "./config/passport";
import connect from "./features/db";
import google from "./routes/auth/google";
import register from "./routes/register";

const app = express();
app.use(express.json());
app.use(passport.initialize());

google(app);
register(app);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello" });
});
app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response) => {
    res.json({ message: "Sei autenticato!" });
  }
);

connect();

export default app;
