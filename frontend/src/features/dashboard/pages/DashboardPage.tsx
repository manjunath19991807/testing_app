import { Card } from "../../../components/ui/Card";
import { EmptyState } from "../../../components/ui/EmptyState";
import { DashboardGrid } from "../components/DashboardGrid";
import { DashboardLimitBanner } from "../components/DashboardLimitBanner";
import { useDashboardCharts } from "../hooks/useDashboardCharts";

export function DashboardPage() {
  const { charts } = useDashboardCharts();

  return (
    <div className="stack">
      <section className="hero-card">
        <p style={{ margin: 0, color: "var(--muted)" }}>Personal workspace</p>
        <h2 style={{ marginBottom: 8 }}>Your dashboard starts empty by design</h2>
        <p style={{ marginTop: 0, color: "var(--muted)", maxWidth: 720 }}>
          This is a good first-run experience: explain what the user can do next instead of
          showing a blank page with no guidance.
        </p>
      </section>

      <div className="section-grid">
        <Card title="Saved Charts" subtitle="Persist these per user and per dataset.">
          {charts.length === 0 ? (
            <EmptyState
              title="No charts saved yet"
              message="After uploading a dataset and building a chart, save up to three charts here."
            />
          ) : (
            <DashboardGrid charts={charts} />
          )}
        </Card>

        <Card title="Product Notes" subtitle="Useful talking points for your internship review.">
          <DashboardLimitBanner currentCount={charts.length} />
          <ul style={listStyle}>
            <li>Limit dashboard to 3 saved charts for focus and simpler state management.</li>
            <li>Scope saved charts to the authenticated user.</li>
            <li>Restore dashboard state on refresh and future login.</li>
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
