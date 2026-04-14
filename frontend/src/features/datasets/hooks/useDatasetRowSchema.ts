import { useState } from "react";
import { datasetApi } from "../../datasets/api/datasetApi";

type ChartDatum = { label: string; value: number };

export function useChartData() {
  const [data, setData] = useState<ChartDatum[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchChartData(params: {
    datasetId: string;
    xAxis: string;
    yAxis?: string;
    aggregation?: "sum" | "avg" | "count";
  }) {
    setIsLoading(true);
    setError("");

    try {
      const result = await datasetApi.getChartData(params);
      setData(result);
    } catch (err) {
      setError("Failed to load chart data");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    data,
    isLoading,
    error,
    fetchChartData,
  };
}
