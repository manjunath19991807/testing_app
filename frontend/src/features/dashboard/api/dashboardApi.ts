import { SavedChart } from "../types";
import { getJson } from "../../../lib/apiClient";

export const dashboardApi = {
  async getCharts(): Promise<SavedChart[]> {
    try {
      const response = await getJson<{ charts: SavedChart[] }>("/dashboard");
      return response.charts;
    } catch {
      return [];
    }
  }
};
