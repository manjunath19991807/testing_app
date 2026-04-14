import { Card } from "../../../components/ui/Card";
import { InsightSet } from "../types";
import { InsightCard } from "./InsightCard";

type InsightPanelProps = {
  insightSet: InsightSet | null;
  isLoading?: boolean;
};

export function InsightPanel({ insightSet, isLoading }: InsightPanelProps) {
  return (
    <Card title="AI Insights" subtitle="Generated from your dataset using GPT-4o-mini.">
      {isLoading ? (
        <div className="stack" style={{ gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                padding: 18,
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                background: "rgba(255,255,255,0.4)",
                height: 48,
                animation: "pulse 1.5s ease-in-out infinite",
                opacity: 0.6,
              }}
            />
          ))}
          <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:0.8} }`}</style>
        </div>
      ) : insightSet ? (
        <div className="stack">
          {insightSet.insights.map((insight) => (
            <InsightCard key={insight} insight={insight} />
          ))}
          {insightSet.chartSuggestions.length > 0 && (
            <div>
              <strong>Suggested charts</strong>
              <ul style={{ paddingLeft: 18, lineHeight: 1.8 }}>
                {insightSet.chartSuggestions.map((suggestion) => (
                  <li key={suggestion}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <p className="muted" style={{ margin: 0 }}>
          No insights generated yet. Select a dataset and hit &quot;Generate Insights&quot;.
        </p>
      )}
    </Card>
  );
}
