import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

async function connect() {
  const mongod = await MongoMemoryServer.create();
  return mongoose
    .connect(mongod.getUri())
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

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected. Reconnecting...");
  connect();
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

export default connect;
