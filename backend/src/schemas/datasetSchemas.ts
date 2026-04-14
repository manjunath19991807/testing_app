import { z } from "zod";

export const uploadDatasetSchema = z.object({
  name: z.string().min(1),
  fileUrl: z.string().url().optional()
});

