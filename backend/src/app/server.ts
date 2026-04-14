import "dotenv/config";
import { createApp } from "./createApp.js";
import { connectDatabase } from "../lib/db.js";

// Render injects PORT automatically. Fallback to 5001 for local dev.
const port = Number(process.env.PORT ?? 5001);
const app = createApp();

connectDatabase()
  .then(() => {
    // Bind to 0.0.0.0 — required by Render (not just localhost)
    app.listen(port, "0.0.0.0", () => {
      console.log(`Backend listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
