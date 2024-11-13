import { Request, Response } from "express";

const route = (req: Request, res: Response) => {
  res.json({ message: "Sei autenticato" });
};
export default route;
