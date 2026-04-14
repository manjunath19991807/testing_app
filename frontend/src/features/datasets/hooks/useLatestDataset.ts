import { useEffect, useState } from "react";
import { datasetApi } from "../api/datasetApi";
import { DatasetSchema } from "../types";

const latestDatasetKey = "csv-analytics-latest-dataset-id";

export function useLatestDataset() {
  const [dataset, setDataset] = useState<DatasetSchema | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const latestDatasetId = window.localStorage.getItem(latestDatasetKey) ?? undefined;

    datasetApi
      .getSchema(latestDatasetId)
      .then((nextDataset) => {
        setDataset(nextDataset);

        if (nextDataset?.datasetId) {
          window.localStorage.setItem(latestDatasetKey, nextDataset.datasetId);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { dataset, isLoading };
}
