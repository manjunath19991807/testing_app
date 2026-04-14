type DashboardLimitBannerProps = {
  currentCount: number;
};

export function DashboardLimitBanner({ currentCount }: DashboardLimitBannerProps) {
  return (
    <div
      style={{
        padding: 14,
        marginBottom: 14,
        borderRadius: "var(--radius-sm)",
        background: "var(--accent-soft)",
        color: "#8a5800",
        fontWeight: 700
      }}
    >
      {currentCount} of 3 dashboard chart slots used.
    </div>
  );
}
