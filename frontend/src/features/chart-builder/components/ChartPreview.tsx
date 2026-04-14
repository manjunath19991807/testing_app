import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartConfig, ChartPreviewDatum } from "../types";

type ChartPreviewProps = {
  config: ChartConfig;
  data: ChartPreviewDatum[];
  isLoading?: boolean;
};

export function ChartPreview({ config, data, isLoading }: ChartPreviewProps) {
  if (isLoading) {
    return <p className="muted">Loading preview...</p>;
  }

  if (!data || data.length === 0) {
    return <p className="muted">Click "Preview chart" to load data</p>;
  }
  return (
    <div
      style={{
        minHeight: 280,
        borderRadius: "var(--radius-sm)",
        border: "1px dashed var(--border)",
        padding: 18,
        display: "grid",
        alignContent: "space-between",
        gap: 18,
        background:
          "linear-gradient(180deg, rgba(15,118,110,0.08), rgba(255,255,255,0.8))",
      }}
    >
      <div>
        <strong>{config.chartType.toUpperCase()} preview</strong>
        <p className="muted" style={{ marginBottom: 0 }}>
          X: {config.xAxis} · Y: {config.yAxis}
        </p>
      </div>
      <div style={{ minHeight: 240, width: "100%" }}>
        <ResponsiveContainer width="100%" height={240}>
          {renderPreviewChart(config, data)}
        </ResponsiveContainer>
      </div>
      <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>
        This is a schema-driven preview based on your selected fields. Real
        aggregated chart values should come from a dedicated backend chart-data
        endpoint later.
      </p>
    </div>
  );
}

function renderPreviewChart(config: ChartConfig, data: ChartPreviewDatum[]) {
  if (config.chartType === "line") {
    return (
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(29, 36, 51, 0.08)" strokeDasharray="4 4" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          name={config.yAxis}
          stroke="#0f766e"
          strokeWidth={3}
          dot={{ r: 4 }}
        />
      </LineChart>
    );
  }

  if (config.chartType === "pie") {
    return (
      <PieChart>
        <Tooltip />
        <Legend />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={44}
          outerRadius={84}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.label}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    );
  }

  return (
    <BarChart data={data}>
      <CartesianGrid stroke="rgba(29, 36, 51, 0.08)" strokeDasharray="4 4" />
      <XAxis dataKey="label" tickLine={false} axisLine={false} />
      <YAxis tickLine={false} axisLine={false} />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="value"
        name={config.yAxis}
        radius={[10, 10, 0, 0]}
        fill="#0f766e"
      />
    </BarChart>
  );
}

const PIE_COLORS = ["#0f766e", "#f59e0b", "#1d4ed8", "#ef4444", "#7c3aed"];
