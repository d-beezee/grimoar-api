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
import gamesRoute from "./routes/games";
import gamesByIdRoute from "./routes/games/id/_get";
import getVoteByGame from "./routes/games/id/votes/_get";
import voteGameById from "./routes/games/id/votes/_post";
import protectedRoute from "./routes/protected";
import register from "./routes/register";
import root from "./routes/root";
import deleteMe from "./routes/users/me/_delete";

const authenticated = passport.authenticate("jwt", {
  session: false,
  failureRedirect: "/unauthorized",
});

const app = express();

app.use(function (req, res, next) {
  if (req.headers.origin)
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.options("*", (req, res) => {
  res.status(204).send(); // Risposta vuota, codice di successo
});
app.use(cookieParser(config.cookies.key));
app.use(express.json());
app.use(passport.initialize());

app.get("/unauthorized", (req, res) => {
  res.status(401).json({ message: "Non autorizzato" });
});
app.get("/reference", (req, res) => {
  res.sendFile("reference/api.yaml", { root: "./src" });
});

app.use(
  OpenApiValidator.middleware({
    apiSpec: "./src/reference/api.yaml",
    validateRequests: true,
    validateResponses: {
      onError: (err, json, req) => {
        console.error(err);
        throw err;
      },
    },
  })
);

app.get("/", root);
app.post("/register", register);
app.post("/auth/verify", verify);
app.post("/auth/password", passwordAuth);
app.post("/auth/google", googleAuth);
app.get("/protected", authenticated, protectedRoute);
app.get("/games", authenticated, gamesRoute);
app.get("/games/:id", authenticated, gamesByIdRoute);
app.post("/games/:id/votes", authenticated, voteGameById);
app.get("/games/:id/votes", authenticated, getVoteByGame);
app.delete("/users/me", authenticated, deleteMe);

connect();

export default app;

// Se l'app è eseguita in locale, avvia il server
if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Server in ascolto su http://localhost:${config.port}`);
  });
}
