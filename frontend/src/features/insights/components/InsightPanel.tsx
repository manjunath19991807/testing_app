import { Card } from "../../../components/ui/Card";
import { InsightSet } from "../types";
import { InsightCard } from "./InsightCard";

type InsightPanelProps = {
  insightSet: InsightSet | null;
};

export function InsightPanel({ insightSet }: InsightPanelProps) {
  return (
    <Card title="Suggested Response Shape" subtitle="Keep it structured for better rendering.">
      {insightSet ? (
        <div className="stack">
          {insightSet.insights.map((insight) => (
            <InsightCard key={insight} insight={insight} />
          ))}
          <div>
            <strong>Suggested charts</strong>
            <ul style={{ paddingLeft: 18, lineHeight: 1.8 }}>
              {insightSet.chartSuggestions.map((suggestion) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="muted" style={{ margin: 0 }}>No insights generated yet.</p>
      )}
    </Card>
  );
}
