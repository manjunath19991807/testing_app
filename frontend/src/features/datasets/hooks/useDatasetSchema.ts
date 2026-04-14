import { useEffect, useState } from "react";
import { datasetApi } from "../api/datasetApi";
import { DatasetSchema } from "../types";

const latestDatasetKey = "csv-analytics-latest-dataset-id";

export function useDatasetSchema() {
  const [schema, setSchema] = useState<DatasetSchema | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    datasetApi
      .getSchema()
      .then((nextSchema) => {
        setSchema(nextSchema);
      })
      .catch(() => {
        setSchema(null);
      });
  }, []);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setError("");

    try {
      const nextSchema = await datasetApi.upload(file);
      setSchema(nextSchema);
      window.localStorage.setItem(latestDatasetKey, nextSchema.datasetId);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return { schema, error, isUploading, uploadFile };
}
