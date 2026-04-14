import multer from "multer";
import { Router } from "express";
import { getChartData, getDatasets, parseUploadedCsv } from "./service.js";
import { DatasetModel } from "./model.js";

export const datasetsRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

datasetsRouter.get("/", async (request, response, next) => {
  try {
    const datasets = await getDatasets(request.authUser!.id);

    response.json({
      datasets,
    });
  } catch (error) {
    next(error);
  }
});

datasetsRouter.get("/chart-data", async (req, res, next) => {
  try {
    const { datasetId, xAxis, yAxis, aggregation } = req.query as {
      datasetId?: string;
      xAxis?: string;
      yAxis?: string;
      aggregation?: "sum" | "avg" | "count";
    };

    // ✅ Basic validation
    if (!datasetId || !xAxis) {
      return res.status(400).json({
        message: "datasetId and xAxis are required",
      });
    }

    // 🔐 Ownership check
    const dataset = await DatasetModel.findOne({
      _id: datasetId,
      userId: req.authUser!.id,
    });

    if (!dataset) {
      return res.status(404).json({
        message: "Dataset not found",
      });
    }

    // 🚀 Call service
    const data = await getChartData({
      datasetId,
      xAxis,
      yAxis,
      aggregation: aggregation || "sum",
    });

    res.json({
      data,
    });
  } catch (error) {
    next(error);
  }
});
datasetsRouter.post(
  "/upload",
  upload.single("file"),
  async (request, response, next) => {
    try {
      if (!request.file) {
        return response.status(400).json({
          message: "Please upload a CSV file.",
        });
      }

      const dataset = await parseUploadedCsv(
        request.file,
        request.authUser!.id,
      );

      return response.status(201).json({
        message: "Dataset uploaded successfully.",
        dataset,
      });
    } catch (error) {
      return next(error);
    }
  },
);
