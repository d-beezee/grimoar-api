import { config } from "@src/config";
import { sign } from "@src/features/jwt/sign";
import User from "@src/models/User";
import { Request, Response } from "express";

import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(config.google.clientId);

const route = async (req: Request, res: Response) => {
  const { accessToken } = req.body;

  try {
    const payload = await client.getTokenInfo(accessToken);

    if (!payload) {
      res.status(401).json({ message: "Token non valido" });
      return;
    }
    const { email } = payload;

    if (!email) {
      res.status(401).json({ message: "Token non valido" });
      return;
    }

    const user = await userGetOrCreate(email);

    const token = sign({ email });
    const cookie = `${user.email}||${user.getCrypted()}`;

    // Restituisci il token al client
    res
      .cookie("auth", cookie, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 28 * 24 * 60 * 60 * 1000,
        signed: true,
      })
      .json({ token });
  } catch (error) {
    console.error("Errore durante la verifica del token Google:", error);
    res.status(401).json({ message: "Token non valido" });
  }

  async function userGetOrCreate(email: string) {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const newUser = new User({ email });
      await newUser.save();
      return newUser;
    }

    return existingUser;
  }
};

export default route;
