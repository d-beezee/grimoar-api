import { config } from "@src/config";
import { sign } from "@src/features/jwt/sign";
import User from "@src/models/User";
import { Express } from "express";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(config.google.clientId);

const route = (app: Express) => {
  app.post("/auth/google", async (req, res) => {
    const { idToken } = req.body;

    try {
      const payload = await client.getTokenInfo(idToken);

      if (!payload) {
        res.status(401).json({ message: "Token non valido" });
        return;
      }
      const { email } = payload;

      if (!email) {
        res.status(401).json({ message: "Token non valido" });
        return;
      }

      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        const newUser = new User({ email });
        await newUser.save();
      }

      const token = sign({ email });

      // Restituisci il token al client
      res.json({ token });
    } catch (error) {
      console.error("Errore durante la verifica del token Google:", error);
      res.status(401).json({ message: "Token non valido" });
    }
  });
};

export default route;
