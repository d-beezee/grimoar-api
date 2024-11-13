import { config } from "@src/config";
import jwt from "jsonwebtoken";

const sign = (user: { email: string }) => {
  return jwt.sign({ email: user.email }, config.jwt.secret, {
    expiresIn: "1h",
  });
};

export { sign };
