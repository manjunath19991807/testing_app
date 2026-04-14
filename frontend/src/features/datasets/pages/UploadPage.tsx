import { Card } from "../../../components/ui/Card";
import { UploadZone } from "../components/UploadZone";
import { ParsingSummary } from "../components/ParsingSummary";
import { useDatasetSchema } from "../hooks/useDatasetSchema";

export function UploadPage() {
  const { schema, error, isUploading, uploadFile } = useDatasetSchema();

  return (
    <div className="stack">
      <section className="hero-card">
        <span className="badge">Step 1 · Upload dataset</span>
        <h2 style={{ marginBottom: 8 }}>Upload a CSV and inspect the detected schema</h2>
        <p style={{ marginTop: 0, color: "var(--muted)", maxWidth: 700 }}>
          This page should accept a CSV, send it to the backend, and display inferred
          column names and types with graceful error states.
        </p>
        <UploadZone onSelectFile={uploadFile} isUploading={isUploading} />
      </section>

      <div className="section-grid">
        <ParsingSummary schema={schema} error={error} />

        <Card
          title="Edge Cases"
          subtitle="These should have visible UI states, not hidden console errors."
        >
          <ul style={listStyle}>
            <li>Empty file</li>
            <li>Malformed CSV</li>
            <li>Missing headers</li>
            <li>Duplicate column names</li>
            <li>Unsupported type</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

const listStyle = {
  margin: 0,
  paddingLeft: 18,
  lineHeight: 1.8
} as const;
