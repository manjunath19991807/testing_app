import cors from "cors";
import express from "express";
import { registerRoutes } from "./routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  const allowedOrigins = new Set([
    process.env.CLIENT_URL ?? "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
  ]);

  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Origin not allowed by CORS"));
      },
    }),
  );
  app.use(express.json());

  registerRoutes(app);
  app.use(errorHandler);

  return app;
}
