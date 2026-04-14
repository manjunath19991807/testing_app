import { Card } from "../../../components/ui/Card";
import { formatColumnType } from "../utils/formatColumnType";
import { DatasetSchema } from "../types";

type ParsingSummaryProps = {
  schema: DatasetSchema | null;
  error?: string;
};

export function ParsingSummary({ schema, error }: ParsingSummaryProps) {
  return (
    <Card title="Detected Schema" subtitle="Render the parser response in a way users can understand quickly.">
      {error ? (
        <p style={{ margin: 0, color: "var(--danger)" }}>{error}</p>
      ) : schema ? (
        <div className="stack">
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span className="badge">{schema.name}</span>
            <span className="badge">{schema.rowCount} rows</span>
          </div>
          <div className="stack">
            {schema.columns.map((column) => (
              <div
                key={column.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "14px 16px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface-soft)",
                  border: "1px solid var(--border)"
                }}
              >
                <strong>{column.name}</strong>
                <span className="muted">{formatColumnType(column.type)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="muted" style={{ margin: 0 }}>No dataset uploaded yet.</p>
      )}
    </Card>
  );
}
