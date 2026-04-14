export const env = {
  port: Number(process.env.PORT ?? 5001),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  connectionString: process.env.CONNECTION_STRING ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET ?? "change-me-refresh",
  storageProvider: process.env.STORAGE_PROVIDER ?? "local",
  awsRegion: process.env.AWS_REGION ?? "",
  awsS3Bucket: process.env.AWS_S3_BUCKET ?? "",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  openAiApiKey: process.env.OPENAI_API_KEY ?? ""
};
