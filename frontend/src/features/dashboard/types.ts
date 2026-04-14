import { ChartType } from "../chart-builder/types";

export type SavedChart = {
  id: string;
  datasetId: string;
  title: string;
  chartType: ChartType;
  xAxis: string;
  yAxis: string;
  aggregation?: "sum" | "count" | "average";
};
