import { z } from "zod";

export const saveChartSchema = z.object({
  datasetId: z.string().min(1),
  title: z.string().min(1),
  chartType: z.enum(["bar", "line", "pie"]),
  xAxis: z.string().min(1),
  yAxis: z.string().min(1),
  aggregation: z.enum(["sum", "count", "average"]).default("sum")
});

