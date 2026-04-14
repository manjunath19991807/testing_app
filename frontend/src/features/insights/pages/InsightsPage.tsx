import { Card } from "../../../components/ui/Card";
import { GenerateInsightButton } from "../components/GenerateInsightButton";
import { InsightPanel } from "../components/InsightPanel";
import { useGenerateInsight } from "../hooks/useGenerateInsight";
import { useLatestDataset } from "../../datasets/hooks/useLatestDataset";

export function InsightsPage() {
  const { dataset, isLoading: isDatasetLoading } = useLatestDataset();
  const { insightSet, isLoading, error, generate } = useGenerateInsight(dataset?.datasetId);

  return (
    <div className="stack">
      <section className="hero-card">
        <span className="badge">AI feature</span>
        <h2 style={{ marginBottom: 8 }}>Generate insights from your dataset</h2>
        <p style={{ marginTop: 0, color: "var(--muted)", maxWidth: 740 }}>
          Click the button below to analyse your uploaded CSV using AI. It will identify
          trends, anomalies, and chart suggestions automatically.
        </p>

        {isDatasetLoading ? (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Loading your dataset…</p>
        ) : !dataset ? (
          <p style={{ color: "var(--error, #f87171)", fontSize: 14 }}>
            No dataset uploaded yet. Please upload a CSV file first.
          </p>
        ) : (
          <GenerateInsightButton
            isLoading={isLoading}
            onClick={generate}
          />
        )}

        {error && (
          <p style={{ color: "var(--error, #f87171)", fontSize: 14, marginTop: 8 }}>
            {error}
          </p>
        )}
      </section>

      <div className="section-grid">
        <InsightPanel insightSet={insightSet} isLoading={isLoading} />

        <Card title="Why This AI Feature Works" subtitle="This is the story to tell in your README.">
          <ul style={listStyle}>
            <li>Useful immediately after upload.</li>
            <li>Grounded in real user data.</li>
            <li>More trustworthy than generic chatbot answers.</li>
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
