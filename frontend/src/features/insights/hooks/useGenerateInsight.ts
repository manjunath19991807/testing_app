import { useEffect, useState } from "react";
import { insightsApi } from "../api/insightsApi";
import { InsightSet } from "../types";

export function useGenerateInsight() {
  const [insightSet, setInsightSet] = useState<InsightSet | null>(null);

  useEffect(() => {
    insightsApi.generate().then(setInsightSet);
  }, []);

  return { insightSet };
}
