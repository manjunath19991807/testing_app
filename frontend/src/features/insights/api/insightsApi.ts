import { InsightSet } from "../types";
import { postJson } from "../../../lib/apiClient";

export const insightsApi = {
  async generate(datasetId: string): Promise<InsightSet> {
    const response = await postJson<
      { result: InsightSet },
      { datasetId: string }
    >("/insights", { datasetId });
    return response.result;
  },
};
