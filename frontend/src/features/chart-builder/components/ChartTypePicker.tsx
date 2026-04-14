import { ChartType } from "../types";

type ChartTypePickerProps = {
  value: ChartType;
  onChange: (value: ChartType) => void;
};

const chartTypes: ChartType[] = ["bar", "line", "pie"];

export function ChartTypePicker({ value, onChange }: ChartTypePickerProps) {
  return (
    <div className="stack" style={{ gap: 8 }}>
      <span style={{ fontWeight: 700 }}>Chart type</span>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {chartTypes.map((chartType) => (
          <button
            key={chartType}
            type="button"
            onClick={() => onChange(chartType)}
            style={{
              padding: "11px 16px",
              borderRadius: 999,
              border: "1px solid var(--border)",
              background: value === chartType ? "var(--primary)" : "white",
              color: value === chartType ? "white" : "var(--text)",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            {chartType}
          </button>
        ))}
      </div>
    </div>
  );
}
