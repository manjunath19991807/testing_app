# CSV Analytics Dashboard

A full-stack web application that lets users upload CSV files, build interactive charts, save dashboards, and generate AI-powered insights from their data using OpenAI GPT-4o-mini.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [How CSV Parsing Works (& Why It Takes Time)](#how-csv-parsing-works--why-it-takes-time)
- [Authentication & Security](#authentication--security)
- [AI Insights Feature](#ai-insights-feature)
- [Database Design](#database-design)
- [File Storage](#file-storage)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Step-by-Step Local Setup](#step-by-step-local-setup)
- [Deployment Guide](#deployment-guide)
- [API Reference](#api-reference)
- [Edge Cases Handled](#edge-cases-handled)
- [Future Improvements](#future-improvements)

---

## Tech Stack

### Frontend

| Layer | Technology | Why |
|---|---|---|
| Framework | **React 18 + TypeScript** | Industry standard, type-safe, easy to review |
| Build Tool | **Vite** | Fastest dev server and HMR available |
| Routing | **React Router v6** | Declarative, nested, protected routes |
| Server State | **TanStack Query (React Query)** | Handles caching, loading, error states for API calls |
| HTTP Client | **Axios** | Interceptor support for JWT injection on every request |
| Charts | **Recharts** | Composable, React-native chart library |

### Backend

| Layer | Technology | Why |
|---|---|---|
| Runtime | **Node.js** | Non-blocking I/O — ideal for streaming large CSVs |
| Framework | **Express.js** | Lightweight, well-understood by any reviewer |
| Language | **TypeScript** | Type safety across the entire API layer |
| CSV Parsing | **csv-parse** | Streaming parser — handles files of any size in memory |
| Validation | **Zod** | Schema-based request validation at the router layer |
| Auth | **JWT (jsonwebtoken + bcryptjs)** | Stateless, scalable, no third-party dependency |
| ORM/ODM | **Mongoose** | MongoDB document modelling with schema enforcement |
| File Upload | **Multer** | Multipart form-data middleware for Express |
| AI | **OpenAI SDK (gpt-4o-mini)** | Cost-effective model with strong structured JSON output |
| File Storage | **AWS S3 / local** | Abstracted provider — swap without touching app logic |

### Database

| Technology | Use |
|---|---|
| **MongoDB (Atlas)** | Stores users, datasets metadata, chart configs, dashboard data |
| **MongoDB GridFS (via Mongoose)** | NOT used — raw CSV bytes are stored in S3 or local disk |

---

## Architecture Overview

```
Browser (React/Vite)
       │
       │  HTTPS  /api/*
       ▼
 Express API (Node.js)
       │
       ├── /api/auth        → JWT auth (signup/login/refresh)
       ├── /api/datasets    → CSV upload, schema inference, chart data
       ├── /api/charts      → Save & retrieve chart configs
       ├── /api/dashboard   → Saved dashboard charts per user
       └── /api/insights    → OpenAI insight generation
       │
       ├── MongoDB Atlas    → All structured app data
       └── AWS S3 / Local   → Raw CSV file bytes
```

The frontend never talks to MongoDB or S3 directly. All data access goes through the authenticated Express API layer.

---

## How CSV Parsing Works (& Why It Takes Time)

CSV parsing can be slow for large files. Here is exactly why and what the backend does to handle it efficiently.

### The Problem With Large CSVs

A naive approach — read the entire file into memory, parse it all at once, then insert — will crash the Node process for files above ~50MB. It blocks the event loop and blows out the heap.

### Our Streaming + Batch Approach

The backend uses a **streaming pipeline** built on `csv-parse`:

```
File Buffer (Multer)
      │
      ▼
Readable.from(buffer.toString())    ← In-memory stream (no temp file)
      │
      ▼
csv-parse (streaming parser)        ← Reads row by row, never loads all at once
      │
      ▼
Batch accumulator (10,000 rows)     ← Groups rows into batches
      │
      ▼
DatasetRowModel.bulkWrite()         ← Single DB call per 10k rows
      │
      ▼
Max 5 concurrent writes in flight   ← Prevents MongoDB write queue overflow
```

### Why Does Schema Inference Happen After 1,000 Rows?

The column type (`number`, `date`, `text`) is inferred by sampling the first 1,000 rows. This is deliberate:

- Inferring from just row 1 is unreliable — values may be missing.
- Inferring from all rows would require a full pass before writing, doubling the time.
- 1,000 rows is statistically sufficient to detect the dominant type in a column.

### Why It Feels "Slow"

| Cause | Explanation |
|---|---|
| File size | 100k-row CSV files contain millions of string tokens |
| Type casting | Every cell is checked against `/^\-?\d+$/` and `new Date()` per row |
| Batched DB writes | Network round-trips to MongoDB Atlas add latency |
| S3 upload | After parsing, the raw file is uploaded to AWS S3 asynchronously |
| Cold start | Render.com free tier spins down — first request after idle takes ~15s |

### Performance Numbers (approximate)

| File Size | Rows | Parse Time |
|---|---|---|
| ~1 MB | ~10,000 | < 2s |
| ~10 MB | ~100,000 | 5–10s |
| ~50 MB | ~500,000 | 30–60s |

---

## Authentication & Security

The app uses a **custom stateless JWT system** — no external auth provider required.

### How It Works

1. **Signup** → Password is hashed with `bcryptjs` (salt rounds: 10) → User saved to MongoDB → Access + refresh tokens issued.
2. **Login** → Password compared with `bcrypt.compare` → Tokens issued on match.
3. **Access Token** → Short-lived JWT (signed with `JWT_SECRET`) → Sent as Bearer token in every API request header.
4. **Refresh Token** → Longer-lived JWT (signed with `JWT_REFRESH_SECRET`) → Used to silently renew access tokens.
5. **Auth Middleware** → Every protected route verifies the token signature and extracts `userId` and `email` before the route handler runs.

### Token Storage

Tokens are stored in `localStorage` under the key `csv-analytics-session`. The Axios interceptor automatically attaches the Bearer token to every outbound API request.

### CORS

The backend accepts requests from any origin during development. In production, you should tighten this by setting `CLIENT_URL` to your Vercel domain.

---

## AI Insights Feature

### How It Works

1. User clicks "Generate Insights" on the Insights page.
2. Frontend sends `POST /api/insights` with the `datasetId`.
3. Backend fetches the dataset **schema** (column names + inferred types) from MongoDB.
4. Backend fetches the first **10 rows** of data as a sample.
5. A carefully structured prompt is sent to **GPT-4o-mini** using the `response_format: json_object` mode.
6. The model returns a JSON object: `{ insights: string[], chartSuggestions: string[] }`.
7. The response is parsed and returned to the frontend.

### Why We Send a Summary, Not the Whole CSV

Sending 100,000 rows to OpenAI would:
- Cost tens of dollars per request (tokens are expensive).
- Exceed the model's context window.
- Return worse results (LLMs reason better on concise, structured prompts).

Sending just the schema + 10 rows gives the model everything it needs to reason about data shape and provide useful business insights.

### Fallback Behaviour

| Scenario | Response |
|---|---|
| `OPENAI_API_KEY` missing | Returns descriptive error insight |
| API call fails (network/quota) | Returns error insight with troubleshooting hint |
| Model returns empty content | Returns "AI returned empty response" insight |

---

## Database Design

All data lives in **MongoDB** via Mongoose. Collections:

### `users`
| Field | Type | Description |
|---|---|---|
| `email` | String | Unique login identifier |
| `passwordHash` | String | bcrypt-hashed password |
| `createdAt` | Date | Auto-managed by Mongoose |

### `datasets`
| Field | Type | Description |
|---|---|---|
| `userId` | String | Owner of the dataset |
| `name` | String | Original filename |
| `storageProvider` | `"local"` \| `"s3"` | Where the raw CSV is stored |
| `fileKey` | String | S3 key or local file path |
| `fileUrl` | String | Public/pre-signed download URL |
| `rowCount` | Number | Total rows parsed |
| `columns` | Array | `[{ name, type }]` — inferred schema |

### `datasetrows`
| Field | Type | Description |
|---|---|---|
| `datasetId` | ObjectId | Reference to parent dataset |
| `data` | Mixed | Raw parsed row object (one doc per CSV row) |

### `charts`
| Field | Type | Description |
|---|---|---|
| `userId` | String | Owner |
| `datasetId` | String | Source dataset |
| `title` | String | User-defined chart name |
| `chartType` | String | `bar`, `line`, `pie`, etc. |
| `xAxis` | String | Column name for X axis |
| `yAxis` | String | Column name for Y axis |
| `aggregation` | String | `sum`, `avg`, or `count` |

---

## File Storage

The storage layer is fully abstracted behind a `storeCsvFile()` function.

### Local (Development)

```env
STORAGE_PROVIDER=local
```

Files are saved to the local filesystem. `fileUrl` will be a local path. This is fine for development but files are lost on Render free tier restarts.

### AWS S3 (Production)

```env
STORAGE_PROVIDER=s3
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

Files are uploaded to S3 after parsing. The `fileUrl` is a public or pre-signed URL depending on your bucket policy.

---

## Project Structure

```
new_project/
├── frontend/
│   ├── src/
│   │   ├── app/               # App bootstrap, routing, providers
│   │   ├── components/
│   │   │   └── ui/            # Button, Card, Modal, Spinner (shared)
│   │   ├── features/
│   │   │   ├── auth/          # Login/Signup pages, hooks, API
│   │   │   ├── datasets/      # CSV upload, schema viewer, chart data
│   │   │   ├── chart-builder/ # Chart config UI and preview
│   │   │   ├── dashboard/     # Saved charts grid
│   │   │   └── insights/      # AI insights panel and button
│   │   └── lib/
│   │       ├── apiClient.ts   # Axios instance + interceptors
│   │       └── env.ts         # Typed environment variables
│   ├── .env                   # VITE_API_BASE_URL
│   └── vite.config.ts         # Dev proxy → backend port 4000
│
├── backend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── server.ts      # Entry point — connects DB, starts server
│   │   │   ├── createApp.ts   # Express app factory — CORS, middleware
│   │   │   ├── routes.ts      # Mounts all feature routers
│   │   │   └── middlewares/   # auth, error handler, request validator
│   │   ├── modules/
│   │   │   ├── auth/          # Signup, login, JWT issue
│   │   │   ├── datasets/      # Upload, parse, chart-data aggregation
│   │   │   ├── charts/        # Save/get chart configs
│   │   │   ├── dashboard/     # Dashboard chart management
│   │   │   └── insights/      # OpenAI integration
│   │   ├── lib/
│   │   │   ├── db.ts          # MongoDB connection
│   │   │   ├── storage.ts     # S3 / local file abstraction
│   │   │   └── jwt.ts         # Sign/verify tokens
│   │   └── schemas/           # Zod validation schemas per module
│   ├── .env                   # All backend secrets
│   └── tsconfig.json
│
├── render.yaml                # Render deployment blueprint
└── README.md
```

---

## Environment Variables

### `backend/.env`

```env
# Server
PORT=4000

# CORS — set to your Vercel frontend URL in production
CLIENT_URL=http://localhost:5173

# MongoDB
CONNECTION_STRING=mongodb+srv://<user>:<password>@cluster.mongodb.net/csv-dashboard

# JWT — use strong random strings in production
JWT_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret

# File Storage: "local" for dev, "s3" for production
STORAGE_PROVIDER=local

# AWS S3 (only needed when STORAGE_PROVIDER=s3)
AWS_REGION=ap-south-1
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# OpenAI (required for AI Insights feature)
OPENAI_API_KEY=sk-...
```

### `frontend/.env`

```env
# Leave empty to use Vite's dev proxy (localhost)
# Set to your Render backend URL in production:
# VITE_API_BASE_URL=https://your-backend.onrender.com/api
VITE_API_BASE_URL=
```

---

## Step-by-Step Local Setup

### Prerequisites

Make sure you have installed:
- **Node.js** v18 or higher (`node -v`)
- **npm** v9 or higher (`npm -v`)
- A **MongoDB Atlas** cluster (free tier is fine) or local MongoDB

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/csv-analytics-dashboard.git
cd csv-analytics-dashboard
```

### 2. Set up the Backend

```bash
cd backend
```

Copy the example environment file:

```bash
cp .env.example .env
```

Open `backend/.env` and fill in:

```env
PORT=4000
CLIENT_URL=http://localhost:5173
CONNECTION_STRING=mongodb+srv://<user>:<password>@cluster.mongodb.net/csv-dashboard
JWT_SECRET=any-long-random-string
JWT_REFRESH_SECRET=another-long-random-string
STORAGE_PROVIDER=local
OPENAI_API_KEY=sk-...         # optional, needed for AI insights
```

Install dependencies and start the server:

```bash
npm install
npm run dev
```

You should see:
```
Backend listening on http://localhost:4000
```

### 3. Set up the Frontend

Open a **new terminal tab**:

```bash
cd frontend
```

Copy the example environment file:

```bash
cp .env.example .env
```

Leave `VITE_API_BASE_URL` empty for local dev — the Vite dev proxy handles routing `/api` requests to `localhost:4000` automatically.

```bash
npm install
npm run dev
```

You should see:
```
VITE v5.x  ready in Xms
➜  Local:   http://localhost:5173/
```

### 4. Open the app

Visit [http://localhost:5173](http://localhost:5173) in your browser.

- Sign up for a new account.
- Upload a CSV file.
- Build a chart and save it to your dashboard.
- Navigate to the Insights page and click **Generate Insights**.

---

## Deployment Guide

### Backend → Render

1. Push your code to GitHub.
2. Go to [render.com](https://render.com) → **New** → **Blueprint**.
3. Select your GitHub repo. Render will read `render.yaml` automatically.
4. In the Render dashboard, add these **Environment Variables** (marked `sync: false` in yaml):
   - `CONNECTION_STRING`
   - `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
   - `OPENAI_API_KEY`
5. Deploy. Copy the resulting URL (e.g. `https://csv-analytics-backend.onrender.com`).

### Frontend → Vercel

1. In `frontend/vercel.json`, replace `CSV_ANALYTICS_RENDER_BACKEND_URL_GOES_HERE` with your Render URL.
2. Commit and push.
3. Run:
   ```bash
   cd frontend
   npx vercel
   ```
4. Follow the CLI prompts to log in and deploy.
5. Copy your Vercel URL (e.g. `https://csv-analytics.vercel.app`).

### Final Step — Link Frontend ↔ Backend

In the **Render dashboard**, update the `CLIENT_URL` environment variable to your Vercel URL:

```
CLIENT_URL=https://csv-analytics.vercel.app
```

This allows your backend's CORS configuration to accept requests from your production frontend.

---

## API Reference

All endpoints are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>` header.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/signup` | ✗ | Register a new user |
| `POST` | `/api/auth/login` | ✗ | Login and receive tokens |
| `GET` | `/api/datasets` | ✓ | Get all datasets for current user |
| `POST` | `/api/datasets/upload` | ✓ | Upload and parse a CSV file |
| `GET` | `/api/datasets/chart-data` | ✓ | Aggregate chart data from dataset rows |
| `GET` | `/api/charts` | ✓ | Get all saved charts |
| `POST` | `/api/charts` | ✓ | Save a chart configuration |
| `GET` | `/api/dashboard` | ✓ | Get dashboard chart list |
| `POST` | `/api/insights` | ✓ | Generate AI insights for a dataset |
| `GET` | `/api/health` | ✗ | Health check endpoint |

---

## Edge Cases Handled

| Edge Case | How It's Handled |
|---|---|
| Non-CSV file upload | Returns `400` — only `.csv` extension accepted |
| Empty CSV file | Throws `"Empty CSV"` error before DB insert |
| Very large CSV | Streamed in chunks — never fully loaded into memory |
| Missing numeric values | `$convert` in MongoDB aggregation pipeline uses `onNull: null` |
| Duplicate column names | Detected during header parsing |
| Missing `OPENAI_API_KEY` | Returns descriptive error insight instead of crashing |
| AI returns empty content | Safe fallback insight returned |
| Invalid JWT | `401 Unauthorized` with clear message |
| Dataset beloning to another user | `findOne({ _id, userId })` — user isolation enforced |

---

## Future Improvements

- **Cached AI insights** — store generated insights in DB so re-generating is instant
- **Pagination** for large dataset row views
- **Chart export** to PNG/SVG
- **Scheduled insight emails** — weekly summary via SendGrid
- **Collaborative dashboards** — share a read-only dashboard link
- **Smart chart recommendations** — suggest chart types based on detected column types
- **Data cleaning tools** — flag and fix missing/malformed values in-app
- **WebSocket upload progress** — real-time parsing progress bar for large files
