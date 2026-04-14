import { SaveChartInput } from "../types";
import { postJson } from "../../../lib/apiClient";
import { SavedChart } from "../../dashboard/types";

export const chartApi = {
  async saveChart(input: SaveChartInput): Promise<SavedChart> {
    const response = await postJson<{ chart: SavedChart }, SaveChartInput>(
      "/charts",
      input,
    );
    return response.chart;
  },
};
