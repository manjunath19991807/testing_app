import { useEffect, useState } from "react";
import { dashboardApi } from "../api/dashboardApi";
import { SavedChart } from "../types";

export function useDashboardCharts() {
  const [charts, setCharts] = useState<SavedChart[]>([]);

  async function refresh() {
    const nextCharts = await dashboardApi.getCharts();
    setCharts(nextCharts);
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      refresh();
    };

    window.addEventListener("dashboard-charts-updated", handleRefresh);

    return () => {
      window.removeEventListener("dashboard-charts-updated", handleRefresh);
    };
  }, []);

  return { charts, refresh };
}
