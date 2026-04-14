import { Schema, model } from "mongoose";

const datasetColumnSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["number", "date", "text"],
      required: true
    }
  },
  { _id: false }
);

const datasetSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    storageProvider: {
      type: String,
      enum: ["local", "s3"],
      default: "local"
    },
    fileKey: {
      type: String,
      default: null
    },
    fileUrl: {
      type: String,
      default: null
    },
    rowCount: {
      type: Number,
      required: true
    },
    columns: {
      type: [datasetColumnSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export const DatasetModel = model("Dataset", datasetSchema);
