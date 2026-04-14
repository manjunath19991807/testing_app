import { z } from "zod";

export const generateInsightSchema = z.object({
  datasetId: z.string().min(1)
});

