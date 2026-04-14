import { DatasetSchema } from "../types";
import { getJson, postFormData, postJson } from "../../../lib/apiClient";

export const datasetApi = {
  async getSchema(datasetId?: string): Promise<DatasetSchema | null> {
    try {
      const response = await getJson<{ datasets: DatasetSchema[] }>(
        "/datasets",
      );
      if (datasetId) {
        return (
          response.datasets.find(
            (dataset) => dataset.datasetId === datasetId,
          ) ?? null
        );
      }

      return response.datasets[0] ?? null;
    } catch {
      return null;
    }
  },

  async getChartData(params: {
    datasetId?: string;
    xAxis?: string;
    yAxis?: string;
    aggregation?: "sum" | "avg" | "count";
  }): Promise<{ label: string; value: number }[]> {
    try {
      if (!params.datasetId || !params.xAxis) {
        return [];
      }

      const query = new URLSearchParams({
        datasetId: params.datasetId,
        xAxis: params.xAxis,
        ...(params.yAxis && { yAxis: params.yAxis }),
        aggregation: params.aggregation || "sum",
      });

      const response = await getJson<{
        data: { label: string; value: number }[];
      }>(`/datasets/chart-data?${query.toString()}`);

      return response.data;
    } catch {
      return [];
    }
  },

  async upload(file: File): Promise<DatasetSchema> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await postFormData<{ dataset: DatasetSchema }>(
      "/datasets/upload",
      formData,
    );
    return response.dataset;
  },
};
