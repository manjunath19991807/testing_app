import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "./env.js";

type StoredFileResult = {
  storageProvider: "local" | "s3";
  fileKey: string | null;
  fileUrl: string | null;
};

let s3Client: S3Client | null = null;

function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({
      region: env.awsRegion,
      credentials:
        env.awsAccessKeyId && env.awsSecretAccessKey
          ? {
              accessKeyId: env.awsAccessKeyId,
              secretAccessKey: env.awsSecretAccessKey,
            }
          : undefined,
    });
  }

  return s3Client;
}

export async function storeCsvFile(input: {
  userId: string;
  datasetId: string;
  fileName: string;
  buffer: Buffer;
  contentType?: string;
}): Promise<StoredFileResult> {
  if (env.storageProvider === "s3") {
    if (!env.awsRegion || !env.awsS3Bucket) {
      throw new Error(
        "S3 storage is enabled but AWS_REGION or AWS_S3_BUCKET is missing.",
      );
    }

    const safeName = input.fileName.replace(/\s+/g, "-");
    const fileKey = `datasets/${input.userId}/${input.datasetId}/${safeName}`;

    await getS3Client().send(
      new PutObjectCommand({
        Bucket: env.awsS3Bucket,
        Key: fileKey,
        Body: input.buffer,
        ContentType: input.contentType ?? "text/csv",
      }),
    );

    return {
      storageProvider: "s3",
      fileKey,
      fileUrl: `https://${env.awsS3Bucket}.s3.${env.awsRegion}.amazonaws.com/${fileKey}`,
    };
  }

  return {
    storageProvider: "local",
    fileKey: null,
    fileUrl: null,
  };
}
