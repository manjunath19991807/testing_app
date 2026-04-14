import { Card } from "../../../components/ui/Card";
import { GenerateInsightButton } from "../components/GenerateInsightButton";
import { InsightPanel } from "../components/InsightPanel";
import { useGenerateInsight } from "../hooks/useGenerateInsight";

export function InsightsPage() {
  const { insightSet } = useGenerateInsight();

  return (
    <div className="stack">
      <section className="hero-card">
        <span className="badge">AI feature</span>
        <h2 style={{ marginBottom: 8 }}>Generate insights from structured dataset summaries</h2>
        <p style={{ marginTop: 0, color: "var(--muted)", maxWidth: 740 }}>
          A strong implementation sends a compact summary to the model instead of the whole
          CSV. That gives you better cost control, clearer prompts, and safer handling.
        </p>
        <GenerateInsightButton />
      </section>

      <div className="section-grid">
        <InsightPanel insightSet={insightSet} />

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
