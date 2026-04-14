import "dotenv/config";
import { createApp } from "./createApp.js";
import { connectDatabase } from "../lib/db.js";

const port = Number(process.env.PORT ?? 5001);
const app = createApp();

connectDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  });
