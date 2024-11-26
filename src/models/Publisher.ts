import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPublisher extends Document {
  name: string;
}

interface PublisherModel extends Model<IPublisher> {}

const userSchema = new Schema<IPublisher>({
  name: String,
});

const Publisher = mongoose.model<IPublisher, PublisherModel>(
  "Publisher",
  userSchema
);
export default Publisher;
