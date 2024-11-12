import bcrypt from "bcryptjs";
import mongoose, { Document, FilterQuery, Model, Schema } from "mongoose";

export interface IUser extends Document {
  username?: string;
  password?: string;
  googleId?: string;
  facebookId?: string;
  validatePassword: (password: string) => Promise<boolean>;
}

interface UserModel extends Model<IUser> {
  findOrCreate: (criteria: FilterQuery<IUser>) => Promise<IUser>;
}

const userSchema = new Schema<IUser>({
  username: { type: String, unique: true },
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

// Funzione per validare la password
userSchema.methods.validatePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
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
