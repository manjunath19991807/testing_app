import cors from "cors";
import express from "express";
import { registerRoutes } from "./routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  // Build the allowed origins list INSIDE the function so that
  // process.env is read AFTER dotenv/config has loaded in server.ts
  const allowedOrigins = [
    process.env.CLIENT_URL,       // Production Vercel URL
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
  ].filter(Boolean) as string[];

  // CORS must be registered before all routes
  app.use(
    cors({
      origin(origin, callback) {
        // Allow server-to-server requests (Postman, curl, Render health checks)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`CORS: origin "${origin}" is not allowed.`));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerRoutes(app);
  app.use(errorHandler);

  return app;
}
