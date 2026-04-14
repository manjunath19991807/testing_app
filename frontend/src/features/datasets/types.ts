import { DatasetColumn } from "../../types/common";

export type DatasetSchema = {
  datasetId: string;
  name: string;
  rowCount: number;
  columns: DatasetColumn[];
};
export type DataChartSchema = {
  label: string;
  value: number;
};
