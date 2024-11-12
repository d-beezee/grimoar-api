import express, { Request, Response } from "express";
import mongoose from "mongoose";
import passport from "passport";
import { config } from "./config";
import "./config/passport";
import connect from "./features/db";
import google from "./routes/auth/google";
import register from "./routes/register";

const app = express();
app.use(express.json());
app.use(passport.initialize());

google(app);
register(app);

app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req: Request, res: Response) => {
    res.json({ message: "Sei autenticato!" });
  }
);

connect()
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on http://localhost:${config.port}`);
    });
  })
  .catch((err) => {
    console.dir(err);

    mongoose.connection.close();
  });
