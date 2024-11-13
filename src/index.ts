import express, { Request, Response } from "express";
import * as OpenApiValidator from "express-openapi-validator";
import passport from "passport";
import { config } from "./config";
import "./config/passport";
import connect from "./features/db";
import google from "./routes/auth/google";
import passwordAuth from "./routes/auth/password";
import register from "./routes/register";

const app = express();
app.use(express.json());
app.use(passport.initialize());

google(app);
register(app);
passwordAuth(app);

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

app.use(
  OpenApiValidator.middleware({
    apiSpec: "./src/reference/api.yaml",
    validateRequests: true,
    validateResponses: true,
  })
);

export default app;

// Se l'app è eseguita in locale, avvia il server
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Server in ascolto su http://localhost:${config.port}`);
  });
}
