import cors from "cors";
import express from "express";
import { registerRoutes } from "./routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(cors());
  app.use(express.json());

  registerRoutes(app);
  app.use(errorHandler);

  return app;
}
