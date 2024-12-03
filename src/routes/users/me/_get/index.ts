import User from "@src/models/User";
import { operations } from "@src/schema";
import { Request, Response } from "express";

const route = async (
  req: Request,
  res: Response<
    | operations["get-users-me"]["responses"]["200"]["content"]["application/json"]
    | operations["get-users-me"]["responses"]["400"]["content"]["application/json"]
    | operations["get-users-me"]["responses"]["404"]["content"]["application/json"]
  >
) => {
  if (!req?.user?.email) {
    res.status(400).json({ message: "Bad request" });
    return;
  }
  const currentUser = await User.findOne({ email: req.user.email });
  if (!currentUser) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({
    name: currentUser.name,
    email: currentUser.email,
    image: currentUser.image || "https://place-hold.it/100",
  });
};

export default route;
