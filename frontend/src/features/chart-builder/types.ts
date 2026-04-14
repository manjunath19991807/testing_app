export type ChartType = "bar" | "line" | "pie";

export type ChartConfig = {
  chartType: ChartType;
  xAxis: string;
  yAxis: string;
};

export type ChartPreviewDatum = {
  label: string;
  value: number;
};

export type SaveChartInput = {
  datasetId: string;
  title: string;
  chartType: ChartType;
  xAxis: string;
  yAxis: string;
  aggregation: "sum" | "count" | "average";
};
