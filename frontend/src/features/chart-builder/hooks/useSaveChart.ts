import { useState } from "react";
import { chartApi } from "../api/chartApi";
import { SaveChartInput } from "../types";

export function useSaveChart() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function save(input: SaveChartInput) {
    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      await chartApi.saveChart(input);
      setSuccessMessage("Chart saved to dashboard.");
      return true;
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save chart.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  return { save, isSaving, error, successMessage };
}
