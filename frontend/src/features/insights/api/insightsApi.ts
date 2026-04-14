import { InsightSet } from "../types";
import { postJson } from "../../../lib/apiClient";

export const insightsApi = {
  async generate(): Promise<InsightSet> {
    try {
      const response = await postJson<{ result: InsightSet }, { datasetId: string }>(
        "/insights",
        { datasetId: "demo-dataset" }
      );

      return response.result;
    } catch {
      return {
        insights: [
          "Revenue peaked in March after a 24% increase over February.",
          "Paid ads drove the most leads, but referral leads converted more efficiently.",
          "One region shows missing transaction dates and should be cleaned before forecasting."
        ],
        chartSuggestions: ["Revenue by month", "Lead source share"]
      };
    }
  }
};
