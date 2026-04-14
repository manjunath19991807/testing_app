import { SavedChart } from "../types";

type SavedChartCardProps = {
  chart: SavedChart;
};

export function SavedChartCard({ chart }: SavedChartCardProps) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
        background: "var(--surface-soft)"
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <strong>{chart.title}</strong>
          <p className="muted" style={{ marginBottom: 0 }}>
            {chart.chartType} · X: {chart.xAxis} · Y: {chart.yAxis}
          </p>
        </div>
        <span className="badge">Saved</span>
      </div>
    </div>
  );
}
