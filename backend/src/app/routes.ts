import { Express } from "express";
import { authMiddleware } from "./middlewares/authMiddleware.js";
import { authRouter } from "../modules/auth/router.js";
import { chartsRouter } from "../modules/charts/router.js";
import { dashboardRouter } from "../modules/dashboard/router.js";
import { datasetsRouter } from "../modules/datasets/router.js";
import { insightsRouter } from "../modules/insights/router.js";

export function registerRoutes(app: Express) {
  app.get("/api/health", (_request, response) => {
    response.json({
      status: "ok",
      service: "csv-analytics-backend"
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/datasets", authMiddleware, datasetsRouter);
  app.use("/api/charts", authMiddleware, chartsRouter);
  app.use("/api/dashboard", authMiddleware, dashboardRouter);
  app.use("/api/insights", authMiddleware, insightsRouter);
}
