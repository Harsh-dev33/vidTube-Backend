import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import { app } from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 9999;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDb connections error", error);
    process.exit(1);
  });
