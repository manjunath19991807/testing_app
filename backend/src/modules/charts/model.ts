import { Schema, model } from "mongoose";

const dashboardChartSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    datasetId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    chartType: {
      type: String,
      enum: ["bar", "line", "pie"],
      required: true
    },
    xAxis: {
      type: String,
      required: true
    },
    yAxis: {
      type: String,
      required: true
    },
    aggregation: {
      type: String,
      enum: ["sum", "count", "average"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const DashboardChartModel = model("DashboardChart", dashboardChartSchema);
