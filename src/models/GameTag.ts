import mongoose, { Document, Model, Schema } from "mongoose";

export interface IGameTag extends Document {
  name: string;
}

interface GameTagModel extends Model<IGameTag> {}

const userSchema = new Schema<IGameTag>({
  name: String,
});

const GameTag = mongoose.model<IGameTag, GameTagModel>("GameTag", userSchema);
export default GameTag;
