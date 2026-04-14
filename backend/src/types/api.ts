export type ApiMessageResponse = {
  message: string;
};

export type DatasetColumn = {
  name: string;
  type: "number" | "date" | "text";
};

export type DatasetRecord = {
  datasetId: string;
  userId: string;
  name: string;
  storageProvider?: "local" | "s3";
  fileKey?: string | null;
  fileUrl?: string | null;
  rowCount: number;
  columns: DatasetColumn[];
};

export type SavedChartRecord = {
  id: string;
  userId: string;
  datasetId: string;
  title: string;
  chartType: "bar" | "line" | "pie";
  xAxis: string;
  yAxis: string;
  aggregation: "sum" | "count" | "average";
};
