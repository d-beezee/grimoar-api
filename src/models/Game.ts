import mongoose, { Document, Model, Schema } from "mongoose";
import { IGameTag } from "./GameTag";
import { IPublisher } from "./Publisher";

export interface IGame extends Document {
  name: string;
  publishYear: number;
  description: string;
  image: string;
  imageFull?: string;
  longDescription?: string;
  tags?: IGameTag[];
  publisher: IPublisher;
}

interface GameModel extends Model<IGame> {}

const userSchema = new Schema<IGame>({
  name: String,
  publishYear: Number,
  description: String,
  image: String,
  imageFull: String,
  longDescription: String,
  tags: [{ type: Schema.Types.ObjectId, ref: "GameTag" }],
  publisher: { type: Schema.Types.ObjectId, ref: "Publisher" },
});

const Game = mongoose.model<IGame, GameModel>("Game", userSchema);
export default Game;
