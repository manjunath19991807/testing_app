import { useState } from "react";
import { insightsApi } from "../api/insightsApi";
import { InsightSet } from "../types";

export function useGenerateInsight(datasetId: string | undefined) {
  const [insightSet, setInsightSet] = useState<InsightSet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!datasetId) {
      setError("No dataset found. Please upload a CSV file first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await insightsApi.generate(datasetId);
      setInsightSet(result);
    } catch {
      setError("Failed to generate insights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return { insightSet, isLoading, error, generate };
}
