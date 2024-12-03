import { config } from "@src/config";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose, { Document, FilterQuery, Model, Schema } from "mongoose";

export interface IUser extends Document {
  _id: string;
  email: string;
  password?: string;
  image?: string;
  name: string;
  googleId?: string;
  facebookId?: string;
  validatePassword: (password: string) => Promise<boolean>;
  getCrypted: () => string;
  verifyCrypted: (hash: string) => boolean;
}

interface UserModel extends Model<IUser> {
  findOrCreate: (criteria: FilterQuery<IUser>) => Promise<IUser>;
  findByCookie: (cookie: string) => Promise<IUser>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, unique: true },
  name: String,
  image: String,
  password: String,
  googleId: String,
  facebookId: String,
});

// Cripta la password prima di salvare l'utente
userSchema.pre("save", async function (next) {
  if (!this.password) return next();
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Aggiunge un metodo per validare la password

userSchema.methods.validatePassword = async function (password: string) {
  if (this.password === undefined) return false;
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getCrypted = function () {
  const saltedEmail = `${this.email}${config.cookies.salt}`;
  const hmac = crypto.createHmac("sha256", config.cookies.key);
  hmac.update(saltedEmail);
  return hmac.digest("hex");
};

userSchema.methods.verifyCrypted = function (hash: string) {
  const crypted = this.getCrypted();
  return crypted === hash;
};

userSchema.statics.findByCookie = async function (cookie: string) {
  const [email, token] = cookie.split("||");

  const user = await this.findOne({ email });

  if (!user) {
    return null;
  }

  const isVerified = await user.verifyCrypted(token);

  if (!isVerified) {
    return null;
  }

  return user;
};

// Implementazione di findOrCreate
userSchema.statics.findOrCreate = async function (
  criteria: FilterQuery<IUser>
) {
  let user = await this.findOne(criteria);
  if (!user) {
    user = await this.create(criteria);
  }
  return user;
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;
