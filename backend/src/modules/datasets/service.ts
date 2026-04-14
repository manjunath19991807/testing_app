import { Express } from "express";
import { storeCsvFile } from "../../lib/storage.js";
import { DatasetColumn, DatasetRecord } from "../../types/api.js";
import { DatasetParseError } from "./errors.js";
import { DatasetModel } from "./model.js";

import { parse } from "csv-parse";
import { Readable } from "stream";
import { Types } from "mongoose";

import fs from "fs";

import mongoose, { Schema } from "mongoose";

const DatasetRowSchema = new Schema(
  {
    datasetId: {
      type: mongoose.Types.ObjectId,
      index: true,
    },
    data: Schema.Types.Mixed,
  },
  { timestamps: false },
);

export const DatasetRowModel = mongoose.model("DatasetRow", DatasetRowSchema);

export async function getDatasets(userId: string): Promise<DatasetRecord[]> {
  const datasets = await DatasetModel.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return datasets.map((dataset) => ({
    datasetId: String(dataset._id),
    userId: dataset.userId,
    name: dataset.name,
    storageProvider: dataset.storageProvider,
    fileKey: dataset.fileKey,
    fileUrl: dataset.fileUrl,
    rowCount: dataset.rowCount,
    columns: dataset.columns,
  }));
}

type ChartAggregation = "sum" | "avg" | "count";

interface GetChartDataParams {
  datasetId: string;
  xAxis: string;
  yAxis?: string;
  aggregation: ChartAggregation;
}

export async function getChartData({
  datasetId,
  xAxis,
  yAxis,
  aggregation,
}: GetChartDataParams) {
  const objectId = new Types.ObjectId(datasetId);

  // 🧠 Decide aggregation operator
  let groupStage: any;

  if (aggregation === "count") {
    groupStage = { $sum: 1 };
  } else if (aggregation === "avg") {
    groupStage = { $avg: `$data.${yAxis}` };
  } else {
    // default sum
    groupStage = { $sum: `$data.${yAxis}` };
  }

  const pipeline: any[] = [
    {
      $match: {
        datasetId: objectId,
      },
    },

    // Convert values
    {
      $addFields: {
        xValue: {
          $ifNull: [
            {
              $dateFromString: {
                dateString: `$data.${xAxis}`,
                onError: null,
              },
            },
            `$data.${xAxis}`, // fallback (string/category)
          ],
        },
        yValue:
          aggregation === "count"
            ? 1
            : {
              $convert: {
                input: `$data.${yAxis}`,
                to: "double",
                onError: null,
                onNull: null,
              },
            },
      },
    },

    {
      $match: {
        xValue: { $ne: null },
        ...(aggregation !== "count" && { yValue: { $ne: null } }),
      },
    },

    {
      $group: {
        _id: "$xValue",
        value: groupStage,
      },
    },

    {
      $project: {
        label: "$_id",
        value: 1,
        _id: 0,
      },
    },

    {
      $sort: { label: 1 },
    },

    {
      $limit: 100,
    },
  ];

  const result = await DatasetRowModel.aggregate(pipeline);

  return result;
}

export async function parseUploadedCsv(file: Express.Multer.File, userId: string) {
  if (!file.originalname.toLowerCase().endsWith(".csv")) {
    throw new Error("Only CSV files are supported.");
  }

  const BATCH_SIZE = 10000;
  const MAX_CONCURRENT_WRITES = 5;

  let batch: any[] = [];
  let rowCount = 0;
  let headers: string[] | null = null;

  const writeQueue: Promise<any>[] = [];

  const stream = Readable.from(file.buffer.toString("utf8")); // ✅ NO BUFFER
  const parser = parse({
    columns: true,
    skip_empty_lines: true,
    trim: true,
    cast: (value, context) => {
      if (context.header) return value;
      // Convert to number if possible
      if (value !== "" && !isNaN(Number(value))) {
        return Number(value);
      }
      return value;
    },
  });

  let datasetDoc: any = null;
  const sampleRows: any[] = [];
  let typesInferred = false;

  for await (const record of stream.pipe(parser)) {
    // capture headers
    if (!headers) {
      headers = Object.keys(record);
    }

    if (!typesInferred) {
      sampleRows.push(record);
      rowCount++;

      if (sampleRows.length === 1000) {
        const columns = headers.map((header) => ({
          name: header,
          type: inferColumnType(sampleRows.map((r) => r[header])),
        }));

        datasetDoc = await DatasetModel.create({
          userId,
          name: file.originalname,
          rowCount: 0,
          columns,
        });

        typesInferred = true;

        for (const sample of sampleRows) {
          batch.push({
            insertOne: {
              document: {
                datasetId: datasetDoc._id,
                data: sample,
              },
            },
          });
        }
      }
      continue;
    }

    rowCount++;
    batch.push({
      insertOne: {
        document: {
          datasetId: datasetDoc._id,
          data: record,
        },
      },
    });

    if (batch.length >= BATCH_SIZE) {
      writeQueue.push(DatasetRowModel.bulkWrite(batch, { ordered: false }));
      batch = [];

      if (writeQueue.length >= MAX_CONCURRENT_WRITES) {
        await Promise.all(writeQueue);
        writeQueue.length = 0;
      }
    }
  }

  if (!typesInferred && sampleRows.length > 0) {
    const columns = headers!.map((header) => ({
      name: header,
      type: inferColumnType(sampleRows.map((r) => r[header])),
    }));

    datasetDoc = await DatasetModel.create({
      userId,
      name: file.originalname,
      rowCount: 0,
      columns,
    });

    for (const sample of sampleRows) {
      batch.push({
        insertOne: {
          document: {
            datasetId: datasetDoc._id,
            data: sample,
          },
        },
      });
    }
  }

  if (batch.length > 0) {
    writeQueue.push(DatasetRowModel.bulkWrite(batch, { ordered: false }));
  }

  if (writeQueue.length > 0) {
    await Promise.all(writeQueue);
  }

  if (!datasetDoc) {
    throw new Error("Empty CSV");
  }

  datasetDoc.rowCount = rowCount;

  const storedFile = await storeCsvFile({
    userId,
    datasetId: datasetDoc.id,
    fileName: file.originalname,
    buffer: file.buffer,
    contentType: file.mimetype,
  });

  datasetDoc.storageProvider = storedFile.storageProvider;
  datasetDoc.fileKey = storedFile.fileKey;
  datasetDoc.fileUrl = storedFile.fileUrl;

  await datasetDoc.save();

  return {
    datasetId: datasetDoc.id,
    userId,
    name: file.originalname,
    storageProvider: storedFile.storageProvider,
    fileKey: storedFile.fileKey,
    fileUrl: storedFile.fileUrl,
    rowCount,
    columns: datasetDoc.columns,
  };
}

// export async function parseUploadedCsv(file, userId) {
//   if (!file.originalname.toLowerCase().endsWith(".csv")) {
//     throw new Error("Only CSV files are supported.");
//   }

//   const stream = Readable.from(file.buffer.toString("utf8"));

//   const parser = parse({
//     columns: true,
//     skip_empty_lines: true,
//     trim: true,
//   });

//   const BATCH_SIZE = 1000;
//   let batch = [];
//   let rowCount = 0;
//   let headers = null;

//   // 👉 first pass inference sample
//   const sampleRows = [];

//   for await (const record of stream.pipe(parser)) {
//     if (!headers) {
//       headers = Object.keys(record);
//     }

//     if (sampleRows.length < 1000) {
//       sampleRows.push(record);
//     }

//     rowCount++;
//   }

//   if (!headers) {
//     throw new Error("Empty CSV");
//   }

//   // infer types using sample only (important)
//   const columns = headers.map((header) => ({
//     name: header,
//     type: inferColumnType(sampleRows.map((r) => r[header])),
//   }));

//   // create dataset first
//   const datasetDoc = await DatasetModel.create({
//     userId,
//     name: file.originalname,
//     rowCount: 0, // update later
//     columns,
//   });

//   // 🔁 SECOND PASS (actual insert)
//   const stream2 = Readable.from(file.buffer.toString("utf8"));
//   const parser2 = parse({
//     columns: true,
//     skip_empty_lines: true,
//     trim: true,
//   });

//   for await (const record of stream2.pipe(parser2)) {
//     batch.push({
//       insertOne: {
//         document: {
//           datasetId: datasetDoc._id,
//           data: record,
//         },
//       },
//     });

//     if (batch.length >= BATCH_SIZE) {
//       await DatasetRowModel.bulkWrite(batch, { ordered: false });
//       batch = [];
//     }
//   }

//   if (batch.length > 0) {
//     await DatasetRowModel.bulkWrite(batch, { ordered: false });
//   }

//   datasetDoc.rowCount = rowCount;

//   // upload to S3
//   const storedFile = await storeCsvFile({
//     userId,
//     datasetId: datasetDoc.id,
//     fileName: file.originalname,
//     buffer: file.buffer,
//     contentType: file.mimetype,
//   });

//   datasetDoc.storageProvider = storedFile.storageProvider;
//   datasetDoc.fileKey = storedFile.fileKey;
//   datasetDoc.fileUrl = storedFile.fileUrl;

//   await datasetDoc.save();

//   return {
//     datasetId: datasetDoc.id,
//     userId,
//     name: file.originalname,
//     storageProvider: storedFile.storageProvider,
//     fileKey: storedFile.fileKey,
//     fileUrl: storedFile.fileUrl,
//     rowCount,
//     columns,
//   };
// }

// export async function parseUploadedCsv(
//   file: Express.Multer.File,
//   userId: string
// ): Promise<DatasetRecord> {
//   if (!file.originalname.toLowerCase().endsWith(".csv")) {
//     throw new DatasetParseError("Only CSV files are supported.");
//   }

//   const content = file.buffer.toString("utf8").trim();

//   if (!content) {
//     throw new DatasetParseError("The uploaded CSV file is empty.");
//   }

//   let records: Record<string, string>[];

//   try {
//     records = parse(content, {
//       columns: true,
//       skip_empty_lines: true,
//       trim: true
//     }) as Record<string, string>[];
//   } catch {
//     throw new DatasetParseError("The CSV file is malformed and could not be parsed.");
//   }

//   if (records.length === 0) {
//     throw new DatasetParseError("The CSV file has no data rows.");
//   }

//   const headers = Object.keys(records[0] ?? {});

//   if (headers.length === 0) {
//     throw new DatasetParseError("The CSV file is missing headers.");
//   }

//   const uniqueHeaders = new Set(headers.map((header) => header.trim().toLowerCase()));

//   if (uniqueHeaders.size !== headers.length) {
//     throw new DatasetParseError("The CSV file contains duplicate headers.");
//   }

//   const columns = headers.map((header) => ({
//     name: header,
//     type: inferColumnType(records.map((record) => record[header]))
//   }));

//   const datasetDoc = new DatasetModel({
//     userId,
//     name: file.originalname,
//     rowCount: records.length,
//     columns
//   });

//   const storedFile = await storeCsvFile({
//     userId,
//     datasetId: datasetDoc.id,
//     fileName: file.originalname,
//     buffer: file.buffer,
//     contentType: file.mimetype
//   });

//   datasetDoc.storageProvider = storedFile.storageProvider;
//   datasetDoc.fileKey = storedFile.fileKey;
//   datasetDoc.fileUrl = storedFile.fileUrl;
//   await datasetDoc.save();

//   return {
//     datasetId: datasetDoc.id,
//     userId,
//     name: file.originalname,
//     storageProvider: storedFile.storageProvider,
//     fileKey: storedFile.fileKey,
//     fileUrl: storedFile.fileUrl,
//     rowCount: records.length,
//     columns
//   };
// }

function inferColumnType(values: any[]): DatasetColumn["type"] {
  const filteredValues = values.filter((value) => value !== null && value !== undefined && value !== "");

  if (filteredValues.length === 0) {
    return "text";
  }

  let isNumber = true;
  let isDate = true;

  for (const value of filteredValues) {
    if (typeof value === "number") {
      isDate = false;
    } else if (typeof value === "string") {
      isNumber = false;
      const date = new Date(value);
      if (isNaN(date.getTime()) || /^-?\d+$/.test(value)) {
        isDate = false;
      }
    } else if (value instanceof Date) {
      isNumber = false;
    } else {
      isNumber = false;
      isDate = false;
    }
  }

  if (isNumber) return "number";
  if (isDate) return "date";

  return "text";
}
