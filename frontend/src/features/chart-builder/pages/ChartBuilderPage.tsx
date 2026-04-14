import { useEffect, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { EmptyState } from "../../../components/ui/EmptyState";
import { AxisSelector } from "../components/AxisSelector";
import { ChartPreview } from "../components/ChartPreview";
import { ChartTypePicker } from "../components/ChartTypePicker";
import { SaveChartButton } from "../components/SaveChartButton";
import { useChartConfig } from "../hooks/useChartConfig";
import { useLatestDataset } from "../../datasets/hooks/useLatestDataset";
import { useSaveChart } from "../hooks/useSaveChart";
import { useChartData } from "../../datasets/hooks/useDatasetRowSchema";

export function ChartBuilderPage() {
  const { config, updateConfig } = useChartConfig();
  const { dataset, isLoading } = useLatestDataset();
  const { save, isSaving, error, successMessage } = useSaveChart();
  const { data, isLoading: isPreviewLoading, fetchChartData } = useChartData();

  const [draftConfig, setDraftConfig] = useState(config);

  const columnOptions = dataset?.columns.map((column) => column.name) ?? [];
  const numericColumnOptions =
    dataset?.columns
      .filter((column) => column.type === "number")
      .map((column) => column.name) ?? [];
  const canBuildChart = Boolean(dataset && columnOptions.length > 0);
  async function handlePreviewChart() {

    if (!dataset) return;

    // ✅ commit draft → actual config
    updateConfig(draftConfig);

    await fetchChartData({
      datasetId: dataset.datasetId,
      xAxis: draftConfig.xAxis,
      yAxis: draftConfig.yAxis,
      aggregation: "sum",
    });
  }

  useEffect(() => {
    if (columnOptions.length === 0) {
      return;
    }

    // Fix context config if invalid
    if (
      !columnOptions.includes(config.xAxis) ||
      !numericColumnOptions.includes(config.yAxis)
    ) {
      updateConfig({
        xAxis: columnOptions.includes(config.xAxis) ? config.xAxis : columnOptions[0],
        yAxis: numericColumnOptions.includes(config.yAxis) ? config.yAxis : (numericColumnOptions[0] ?? columnOptions[0]),
      });
    }

    // Enforce valid bounds on draftConfig to prevent sending hidden invalid values
    setDraftConfig((prev) => {
      const isXValid = columnOptions.includes(prev.xAxis);
      const isYValid = numericColumnOptions.includes(prev.yAxis);

      if (isXValid && isYValid) return prev;

      return {
        ...prev,
        xAxis: isXValid ? prev.xAxis : columnOptions[0],
        yAxis: isYValid ? prev.yAxis : (numericColumnOptions[0] ?? columnOptions[0]),
      };
    });
  }, [columnOptions, numericColumnOptions, config.xAxis, config.yAxis, updateConfig]);

  async function handleSaveChart() {
    if (!dataset) {
      return;
    }

    const didSave = await save({
      datasetId: dataset.datasetId,
      title: `${config.yAxis} by ${config.xAxis}`,
      chartType: config.chartType,
      xAxis: config.xAxis,
      yAxis: config.yAxis,
      aggregation: "sum",
    });

    if (didSave) {
      window.dispatchEvent(new Event("dashboard-charts-updated"));
    }
  }

  return (
    <div className="stack">
      <section className="hero-card">
        <span className="badge">Step 2 · Chart builder</span>
        <h2 style={{ marginBottom: 8 }}>Build a chart from detected columns</h2>
        <p style={{ marginTop: 0, color: "var(--muted)", maxWidth: 720 }}>
          Users should choose X axis, Y axis, and chart type. The preview should
          update immediately and the save action should enforce the 3-chart
          dashboard limit.
        </p>
      </section>

      <div className="section-grid">
        <Card
          title="Controls"
          subtitle="This will become a form backed by server data."
        >
          {isLoading ? (
            <p className="muted" style={{ margin: 0 }}>
              Loading dataset columns...
            </p>
          ) : canBuildChart ? (
            <div className="stack">
              <div className="badge">{dataset?.name}</div>
              <AxisSelector
                label="X axis"
                value={draftConfig.xAxis}
                options={columnOptions}
                onChange={(value) =>
                  setDraftConfig((prev) => ({ ...prev, xAxis: value }))
                }
              />

              <AxisSelector
                label="Y axis"
                value={draftConfig.yAxis}
                options={numericColumnOptions}
                onChange={(value) =>
                  setDraftConfig((prev) => ({ ...prev, yAxis: value }))
                }
              />
              <ChartTypePicker
                value={config.chartType}
                onChange={(value) => updateConfig({ chartType: value })}
              />
              {error ? (
                <p style={{ margin: 0, color: "var(--danger)" }}>{error}</p>
              ) : null}
              {successMessage ? (
                <p style={{ margin: 0, color: "var(--primary)" }}>
                  {successMessage}
                </p>
              ) : null}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button onClick={handlePreviewChart}>
                  {isPreviewLoading ? "Loading..." : "Preview chart"}
                </Button>
                <SaveChartButton
                  onClick={handleSaveChart}
                  disabled={isSaving || !config.xAxis || !config.yAxis}
                />
              </div>
            </div>
          ) : (
            <EmptyState
              title="Upload a dataset first"
              message="The chart builder now reads real uploaded columns. Start from the upload page, then come back here."
            />
          )}
        </Card>

        <Card
          title="Chart Preview"
          subtitle="Use Recharts here once data binding is ready."
        >
          {canBuildChart ? (
            <ChartPreview
              config={config}
              data={data}
              isLoading={isPreviewLoading}
            />
          ) : (
            <EmptyState
              title="No preview yet"
              message="Once a dataset is uploaded, this preview can reflect the selected X and Y axes."
            />
          )}
        </Card>
      </div>
    </div>
  );
}
