# CSV Analytics Dashboard

Monorepo scaffold for an internship project with:

- `frontend/`: React + TypeScript app
- `backend/`: Express + TypeScript API

## Current Status

This repo is scaffolded for:

- authentication flows
- CSV upload/parsing flow
- chart builder flow
- saved dashboard flow
- AI insights flow
The app now includes:

- custom Express auth APIs
- MongoDB-backed authentication and app data
- JWT-based frontend session handling
- authenticated CSV upload and chart/dashboard flows
- AWS-ready storage abstraction for CSV files

Datasets and dashboard charts now persist in MongoDB. CSV file storage supports:

- `local` for development
- `s3` for AWS deployment

## Run Locally

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

## Backend Setup

1. Create a MongoDB database or use your existing Atlas cluster.
2. Copy `backend/.env.example` to `backend/.env`.
3. Set `CONNECTION_STRING`, `JWT_SECRET`, and `JWT_REFRESH_SECRET`.
4. For AWS file storage, set `STORAGE_PROVIDER=s3`, `AWS_REGION`, `AWS_S3_BUCKET`, and AWS credentials.
5. Start the backend.

## Suggested Implementation Sequence

1. Add AWS S3 bucket and IAM credentials for file uploads.
2. Persist AI insight history in PostgreSQL.
3. Add authenticated dataset upload from frontend to backend.
4. Parse CSV server-side and persist dataset metadata.
5. Build chart preview and save chart endpoints.
6. Add AWS deployment config for backend runtime.
7. Add AI insight generation from dataset summaries.
8. Deploy frontend and backend.

## Project Structure

```text
frontend/  React app
backend/   Express API
```

## Next Recommended Steps

1. Initialize dependencies in both apps.
2. Run the Postgres schema and configure backend env vars.
3. Build chart preview from parsed dataset metadata.
4. Persist AI insights fully in the database.
5. Add deployment config for AWS backend and S3 bucket permissions.
6. Deploy frontend and backend.
