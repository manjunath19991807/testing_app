import { SavedChartCard } from "./SavedChartCard";
import { SavedChart } from "../types";

type DashboardGridProps = {
  charts: SavedChart[];
};

export function DashboardGrid({ charts }: DashboardGridProps) {
  return (
    <div className="stack">
      {charts.map((chart) => (
        <SavedChartCard key={chart.id} chart={chart} />
      ))}
    </div>
  );
}
