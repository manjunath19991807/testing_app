type InsightCardProps = {
  insight: string;
};

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <div
      style={{
        padding: "14px 18px",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border)",
        background: "rgba(255,255,255,0.65)",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        lineHeight: 1.6,
      }}
    >
      <span style={{ color: "var(--primary)", fontWeight: 700, flexShrink: 0 }}>✦</span>
      <span>{insight}</span>
    </div>
  );
}
