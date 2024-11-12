import { config } from "@src/config";
import mongoose from "mongoose";

async function connect() {
  // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
  return mongoose
    .connect(config.db.url)
    .then(() => {
      if (!mongoose?.connection?.db)
        throw new Error("MongoDB connection failed");
      return mongoose.connection.db.admin().command({ ping: 1 });
    })
    .then(() => {
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    });
}

export default connect;
