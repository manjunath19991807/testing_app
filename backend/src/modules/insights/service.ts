import OpenAI from "openai";
import { DatasetModel } from "../datasets/model.js";
import { DatasetRowModel } from "../datasets/service.js";

export function getMockInsights() {
  return {
    insights: [
      "Revenue peaked in March after a strong month-over-month increase.",
      "Referral leads appear to convert better than paid leads.",
      "Some date values are missing and should be cleaned before deeper analysis."
    ],
    chartSuggestions: ["Revenue by month", "Lead source share"]
  };
}

export async function generateInsights(userId: string, datasetId: string) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.trim() === "") {
    return getMockInsights();
  }

  const openai = new OpenAI({ apiKey });

  const dataset = await DatasetModel.findOne({ _id: datasetId, userId }).lean();
  
  if (!dataset) {
    throw new Error("Dataset not found. Cannot generate insights.");
  }

  const rows = await DatasetRowModel.find({ datasetId })
    .limit(10)
    .lean();

  const dataSample = rows.map((r) => r.data);

  const prompt = `
You are a data analysis assistant. I will provide you with the schema and a sample of a dataset. 
Analyze the sample data and provide some meaningful business insights and suggest 1-2 chart types that would best visualize this data.

Schema (columns):
${JSON.stringify(dataset.columns, null, 2)}

Sample Data (first 10 rows):
${JSON.stringify(dataSample, null, 2)}

Respond ONLY with a strictly formatted JSON object matching this exact schema:
{
  "insights": ["insight 1", "insight 2", "insight 3"],
  "chartSuggestions": ["Chart suggestion 1", "Chart suggestion 2"]
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message.content;
    if (content) {
      return JSON.parse(content);
    }
    return {
      insights: ["AI returned an empty response. Please try generating again."],
      chartSuggestions: []
    };
  } catch (error) {
    console.error("OpenAI API generation failed:", error);
    return {
      insights: [
        "Insight generation failed due to an AI error.",
        "Please check your OPENAI_API_KEY is valid and try again."
      ],
      chartSuggestions: []
    };
  }
}
