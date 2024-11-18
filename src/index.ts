import cookieParser from "cookie-parser";
import express from "express";
import * as OpenApiValidator from "express-openapi-validator";
import passport from "passport";
import { config } from "./config";
import "./config/passport";
import connect from "./features/db";
import googleAuth from "./routes/auth/google";
import passwordAuth from "./routes/auth/password";
import verify from "./routes/auth/verify";
import protectedRoute from "./routes/protected";
import register from "./routes/register";
import root from "./routes/root";

const authenticated = passport.authenticate("jwt", { session: false });
const app = express();

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.header("origin"));
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(cookieParser(config.cookies.key));
app.use(express.json());
app.use(passport.initialize());

app.get("/reference", (req, res) => {
  res.sendFile("reference/api.yaml", { root: "./src" });
});

app.use(
  OpenApiValidator.middleware({
    apiSpec: "./src/reference/api.yaml",
    validateRequests: true,
    validateResponses: true,
  })
);

app.get("/", root);
app.post("/register", register);
app.post("/auth/verify", verify);
app.post("/auth/password", passwordAuth);
app.post("/auth/google", googleAuth);
app.get("/protected", authenticated, protectedRoute);

connect();

export default app;

// Se l'app è eseguita in locale, avvia il server
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Server in ascolto su http://localhost:${config.port}`);
  });
}
