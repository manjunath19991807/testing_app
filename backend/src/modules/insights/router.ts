import { Router } from "express";
import { validateRequest } from "../../app/middlewares/validateRequest.js";
import { generateInsightSchema } from "../../schemas/insightSchemas.js";
import { getMockInsights } from "./service.js";

export const insightsRouter = Router();

insightsRouter.post("/", validateRequest(generateInsightSchema), (request, response) => {
  response.status(202).json({
    message: "Insight generation route scaffolded",
    received: request.body,
    result: getMockInsights()
  });
});
