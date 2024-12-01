import mongoose, { Document, Model, Schema } from "mongoose";
import { IGame } from "./Game";
import { IUser } from "./User";

export interface IVote extends Document {
  value: number;
  game: IGame;
  user: IUser;
}

interface VoteModel extends Model<IVote> {}

const userSchema = new Schema<IVote>({
  value: Number,
  game: { type: Schema.Types.ObjectId, ref: "Game" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Vote = mongoose.model<IVote, VoteModel>("Vote", userSchema);
export default Vote;
