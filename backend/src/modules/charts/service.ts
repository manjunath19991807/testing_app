import { SavedChartRecord } from "../../types/api.js";
import { DashboardChartModel } from "./model.js";

export function canSaveDashboardChart(existingChartCount: number) {
  return existingChartCount < 3;
}

export async function getSavedCharts(userId: string): Promise<SavedChartRecord[]> {
  const charts = await DashboardChartModel.find({ userId }).sort({ createdAt: -1 }).lean();

  return charts.map((chart) => ({
    id: String(chart._id),
    userId: chart.userId,
    datasetId: chart.datasetId,
    title: chart.title,
    chartType: chart.chartType,
    xAxis: chart.xAxis,
    yAxis: chart.yAxis,
    aggregation: chart.aggregation
  }));
}

export async function saveChart(
  input: Omit<SavedChartRecord, "id">
): Promise<{ canSave: boolean; chart: SavedChartRecord | null }> {
  const existingChartCount = await DashboardChartModel.countDocuments({
    userId: input.userId
  });

  if (!canSaveDashboardChart(existingChartCount)) {
    return {
      canSave: false,
      chart: null
    };
  }

  const chart = await DashboardChartModel.create(input);

  return {
    canSave: true,
    chart: {
      id: chart.id,
      userId: chart.userId,
      datasetId: chart.datasetId,
      title: chart.title,
      chartType: chart.chartType,
      xAxis: chart.xAxis,
      yAxis: chart.yAxis,
      aggregation: chart.aggregation
    }
  };
}
