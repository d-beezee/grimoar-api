import { sign } from "@src/features/jwt/sign";
import User from "@src/models/User";
import { Request, Response } from "express";

const route = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email e password sono richiesti" });
    return;
  }

  try {
    // Verifica se l'utente esiste già
    const existingUser = await User.exists({ email });
    if (existingUser) {
      res.status(409).json({ message: "Email già in uso" });
      return;
    }

    // Crea un nuovo utente
    const newUser = new User({ email, password });
    await newUser.save();

    // Genera un token JWT
    const token = sign({ email });
    res
      .status(201)
      .json({ token, message: "Registrazione completata con successo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore interno del server", error });
    return;
  }
};

export default route;
