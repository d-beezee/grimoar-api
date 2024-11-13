import express from "express";
import * as OpenApiValidator from "express-openapi-validator";
import passport from "passport";
import { config } from "./config";
import "./config/passport";
import connect from "./features/db";
import google from "./routes/auth/google";
import passwordAuth from "./routes/auth/password";
import protectedRoute from "./routes/protected";
import register from "./routes/register";
import root from "./routes/root";

const authenticated = passport.authenticate("jwt", { session: false });
const app = express();
app.use(express.json());
app.use(passport.initialize());

google(app);

app.get("/", root);
app.post("/register", register);
app.post("/auth/password", passwordAuth);
app.get("/protected", authenticated, protectedRoute);

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
