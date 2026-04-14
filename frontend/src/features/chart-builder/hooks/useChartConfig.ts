import { useState } from "react";
import { ChartConfig } from "../types";

const initialConfig: ChartConfig = {
  chartType: "bar",
  xAxis: "month",
  yAxis: "revenue"
};

export function useChartConfig() {
  const [config, setConfig] = useState<ChartConfig>(initialConfig);

  return {
    config,
    updateConfig(patch: Partial<ChartConfig>) {
      setConfig((currentConfig) => ({
        ...currentConfig,
        ...patch
      }));
    }
  };
}
