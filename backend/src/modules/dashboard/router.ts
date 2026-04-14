import { Router } from "express";
import { getSavedCharts } from "../charts/service.js";
import { getDashboardLimit } from "./service.js";

export const dashboardRouter = Router();

dashboardRouter.get("/", async (request, response, next) => {
  try {
    const charts = await getSavedCharts(request.authUser!.id);

    response.json({
      charts,
      limit: getDashboardLimit()
    });
  } catch (error) {
    next(error);
  }
});
