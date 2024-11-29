import User from "@src/models/User";
import { operations } from "@src/schema";
import { Request, Response } from "express";

const route = async (
  req: Request,
  res: Response<
    operations["delete-users-me"]["responses"]["200"]["content"]["application/json"]
  >
) => {
  if (!req?.user?.email)
    return res.status(400).json({ message: "Bad request" });
  const currentUser = User.findOne({ email: req.user.email });
  if (!currentUser) return res.status(404).json({ message: "User not found" });
  await currentUser.deleteOne();

  res.json({
    message: "User deleted",
  });
};

export default route;
