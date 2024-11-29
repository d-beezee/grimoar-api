import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  db: {
    url: process.env.DB_URL || "mongodb://localhost:27017/your_db",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your_jwt_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
    clientSecret:
      process.env.GOOGLE_CLIENT_SECRET || "YOUR_GOOGLE_CLIENT_SECRET",
  },
  cookies: {
    key: process.env.COOKIE_KEY || "your_cookie_key",
    salt: process.env.COOKIE_SALT || "your_cookie_salt",
  },
};

export { config };
