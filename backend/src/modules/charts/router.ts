import { Router } from "express";
import { validateRequest } from "../../app/middlewares/validateRequest.js";
import { saveChartSchema } from "../../schemas/chartSchemas.js";
import { saveChart } from "./service.js";

export const chartsRouter = Router();

chartsRouter.post(
  "/",
  validateRequest(saveChartSchema),
  async (request, response, next) => {
    try {
      const result = await saveChart({
        ...request.body,
        userId: request.authUser!.id,
      });

      // if (!result.canSave) {
      //   return response.status(400).json({
      //     message: "Dashboard chart limit reached. You can save up to 3 charts."
      //   });
      // }

      return response.status(201).json({
        message: "Chart saved successfully.",
        chart: result.chart,
        canSave: result.canSave,
      });
    } catch (error) {
      return next(error);
    }
  },
);
