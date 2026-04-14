type InsightCardProps = {
  insight: string;
};

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border)",
        background: "rgba(255,255,255,0.65)"
      }}
    >
      {insight}
    </div>
  );
}
