import { Router } from "express";
import { validateRequest } from "../../app/middlewares/validateRequest.js";
import { generateInsightSchema } from "../../schemas/insightSchemas.js";
import { generateInsights } from "./service.js";

export const insightsRouter = Router();

insightsRouter.post("/", validateRequest(generateInsightSchema), async (request, response, next) => {
  try {
    const userId = request.authUser!.id;
    const { datasetId } = request.body;

    const insights = await generateInsights(userId, datasetId);

    response.status(200).json({
      message: "Insights generated successfully",
      result: insights
    });
  } catch (error) {
    next(error);
  }
});
