import mongoose, { Document, Model, Schema } from "mongoose";

export interface IGame extends Document {
  name: string;
  publishYear: number;
  description: string;
  image: string;
}

interface GameModel extends Model<IGame> {}

const userSchema = new Schema<IGame>({
  name: String,
  publishYear: Number,
  description: String,
  image: String,
});

const Game = mongoose.model<IGame, GameModel>("Game", userSchema);
export default Game;
