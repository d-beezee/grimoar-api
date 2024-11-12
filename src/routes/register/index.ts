import { config } from "@src/config";
import User from "@src/models/User";
import { Express, Request, Response } from "express";
import jwt from "jsonwebtoken";

const route = (app: Express) => {
  app.post("/register", async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username e password sono richiesti" });
      return;
    }

    try {
      // Verifica se l'utente esiste già
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(409).json({ message: "Username già in uso" });
        return;
      }

      // Crea un nuovo utente
      const newUser = new User({ username, password });
      await newUser.save();

      // Genera un token JWT
      const token = jwt.sign({ id: newUser._id }, config.jwt.secret, {
        expiresIn: "1h",
      });

      res
        .status(201)
        .json({ token, message: "Registrazione completata con successo" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Errore interno del server", error });
      return;
    }
  });
};

export default route;
