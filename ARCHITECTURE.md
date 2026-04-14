# React App Architecture for CSV Analytics Dashboard

This project should be built as a full-stack app, but with a frontend structure that stays clean as features grow.

## Recommended Stack

- Frontend: React + TypeScript + Vite
- Routing: React Router
- Server state: TanStack Query
- Forms: React Hook Form + Zod
- Charts: Recharts
- Auth + database + storage: Supabase
- Backend/API: Node/Express or Supabase Edge Functions
- CSV parsing: server-side with `csv-parse` or `papaparse`
- AI: OpenAI API for insight generation
- Deployment:
  - Frontend on Vercel
  - Backend on Render or Railway
  - Supabase for Postgres/Auth/Storage

## Why This Architecture

- React + TypeScript is expected and easy to explain in an internship review.
- Feature-based frontend folders scale better than page/component dumping.
- Server-side CSV parsing is safer and cleaner for validation, typing, and persistence.
- Supabase reduces time spent building auth, file storage, and private user data access.
- Separate frontend and backend is easier to reason about in interviews than a tangled monolith.

## Frontend Folder Structure

```text
frontend/
  public/
  src/
    app/
      providers/
        QueryProvider.tsx
        RouterProvider.tsx
        ThemeProvider.tsx
      routes/
        index.tsx
        routeGuards.tsx
      store/
        uiStore.ts
      styles/
        globals.css
        tokens.css
      App.tsx
      main.tsx

    components/
      ui/
        Button.tsx
        Card.tsx
        Modal.tsx
        Select.tsx
        Spinner.tsx
        EmptyState.tsx
        ErrorState.tsx
      layout/
        AppShell.tsx
        Sidebar.tsx
        Topbar.tsx
        PageHeader.tsx

    features/
      auth/
        api/
          authApi.ts
        components/
          LoginForm.tsx
          SignupForm.tsx
          ProtectedRoute.tsx
        hooks/
          useAuth.ts
        pages/
          LoginPage.tsx
          SignupPage.tsx
        types.ts

      datasets/
        api/
          datasetApi.ts
        components/
          UploadZone.tsx
          FilePreviewCard.tsx
          ParsingSummary.tsx
          DatasetTable.tsx
        hooks/
          useUploadDataset.ts
          useDatasetSchema.ts
        pages/
          UploadPage.tsx
        utils/
          formatColumnType.ts
        types.ts

      chart-builder/
        api/
          chartApi.ts
        components/
          AxisSelector.tsx
          ChartPreview.tsx
          ChartTypePicker.tsx
          AggregationSelector.tsx
          SaveChartButton.tsx
        hooks/
          useChartConfig.ts
          useChartPreview.ts
        pages/
          ChartBuilderPage.tsx
        utils/
          chartTransformers.ts
          validateChartConfig.ts
        types.ts

      dashboard/
        api/
          dashboardApi.ts
        components/
          DashboardGrid.tsx
          SavedChartCard.tsx
          DashboardLimitBanner.tsx
        hooks/
          useDashboardCharts.ts
          useSaveDashboardChart.ts
        pages/
          DashboardPage.tsx
        types.ts

      insights/
        api/
          insightsApi.ts
        components/
          InsightPanel.tsx
          InsightCard.tsx
          GenerateInsightButton.tsx
        hooks/
          useGenerateInsight.ts
        pages/
          InsightsPage.tsx
        types.ts

    lib/
      apiClient.ts
      env.ts
      supabase.ts
      queryKeys.ts
      date.ts
      logger.ts

    utils/
      formatters.ts
      validators.ts
      download.ts

    types/
      api.ts
      common.ts

    test/
      setup.ts
      mocks/
```

## How to Think About Each Layer

### `app/`

Application bootstrapping only.

- providers
- routing
- global CSS
- app-wide state

Do not put feature logic here.

### `components/`

Reusable building blocks shared across multiple features.

Examples:

- buttons
- cards
- modal
- shell layout

If a component is specific to one feature, keep it inside that feature.

### `features/`

This is the most important design choice.

Each product area owns:

- its own API calls
- hooks
- components
- types
- page entrypoints

This makes the code easier to explain in interviews because each folder maps directly to a business capability.

### `lib/`

Shared technical utilities:

- API client
- Supabase client
- env parsing
- query keys

### `utils/` and `types/`

Only keep truly shared helpers/types here. Avoid turning this into a junk drawer.

## Recommended Pages

- `/login`
- `/signup`
- `/dashboard`
- `/upload`
- `/builder/:datasetId`
- `/insights/:datasetId`

## Recommended Backend Services

Even if your question is about frontend, your frontend structure will be stronger if the backend contract is clean.

### Core backend modules

- `auth`
- `datasets`
- `csv-parser`
- `charts`
- `dashboard`
- `insights`

### Suggested backend folder structure

```text
backend/
  src/
    app/
      server.ts
      routes.ts
      middlewares/
        authMiddleware.ts
        errorHandler.ts
        validateRequest.ts

    modules/
      auth/
      datasets/
      csv-parser/
      charts/
      dashboard/
      insights/

    lib/
      supabaseAdmin.ts
      openai.ts
      logger.ts

    schemas/
      datasetSchemas.ts
      chartSchemas.ts
      insightSchemas.ts

    types/
```

## Database Design

Keep the schema simple and explainable.

### `profiles`

- `id`
- `email`
- `created_at`

### `datasets`

- `id`
- `user_id`
- `name`
- `file_path`
- `row_count`
- `status`
- `created_at`

### `dataset_columns`

- `id`
- `dataset_id`
- `name`
- `inferred_type`

### `dashboard_charts`

- `id`
- `user_id`
- `dataset_id`
- `title`
- `chart_type`
- `x_axis`
- `y_axis`
- `aggregation`
- `position`
- `created_at`

### `ai_insights`

- `id`
- `user_id`
- `dataset_id`
- `prompt_context`
- `result`
- `created_at`

## Best AI Feature Choice

Do not bolt AI on as a chatbot.

Choose: **"Generate 3 smart insights from my uploaded dataset"**

Why this is a strong choice:

- directly tied to user value
- easy to demo
- easier to evaluate than free-form chat
- shows product thinking
- works well with structured tabular data

### Example output

- top-performing category
- unusual spike or drop over time
- strongest source of leads or revenue

### Implementation idea

1. Backend computes a small dataset summary:
   - columns
   - types
   - row count
   - sample rows
   - aggregate stats for numeric/date columns
2. Send only the summary to the LLM, not the full CSV.
3. Return:
   - 3 key findings
   - 1 warning about data quality
   - 2 suggested charts

This is safer, cheaper, and easier to justify.

## Important Edge Cases

You should explicitly mention these in README and demo.

- empty CSV
- malformed CSV
- duplicate headers
- missing headers
- unsupported file type
- very large file upload
- date column mis-detection
- saving a fourth chart when max is 3
- user tries to access another user's dataset
- AI request on dataset with insufficient numeric/date structure

## Product Flow That Will Feel Strong in Review

1. User signs up
2. Lands on empty dashboard
3. CTA points to upload dataset
4. Upload succeeds and shows detected schema
5. User enters chart builder from that dataset
6. User previews chart and saves to dashboard
7. Dashboard persists after refresh/login
8. User clicks "Generate insights"
9. AI returns useful findings tied to the uploaded data

## Deployment Plan

Use a simple production setup you can explain clearly.

### Option I recommend

- Frontend: Vercel
- Backend API: Render
- Database/Auth/Storage: Supabase

### Why

- easiest path to public URL
- free/cheap tiers are fine for internship demo scale
- clear separation of concerns
- reliable auth and storage without building everything yourself

### Environment variables

Frontend:

- `VITE_API_BASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Backend:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `CLIENT_URL`
- `PORT`

## What to Say About Your Technical Decisions

These are the kinds of explanations reviewers like.

- "I used feature-based frontend architecture to keep domain logic close to the UI that uses it."
- "I moved CSV parsing to the server so validation, schema inference, and persistence happen in one trusted layer."
- "I used Supabase because it let me ship production auth, row-level security, and storage quickly without compromising user isolation."
- "I constrained AI to insight generation over structured summaries, which made the feature more useful and more reliable than generic chat."

## Suggested Build Order

1. Set up auth and protected routes
2. Build CSV upload and parsing pipeline
3. Store dataset metadata and inferred columns
4. Build chart builder with preview
5. Save up to 3 charts to dashboard
6. Persist dashboard and reload state
7. Add AI insights
8. Add error states and polish
9. Deploy
10. Record Loom and tighten README

## README Sections You Should Include

- project overview
- architecture decisions
- tech stack
- setup instructions
- deployment links
- tradeoffs
- edge cases handled
- AI feature explanation
- future improvements

## Future Improvements

These help demonstrate product thinking.

- scheduled email insights
- collaborative dashboards
- chart export
- stronger data cleaning tools
- smart chart recommendations based on column types
- caching AI insights per dataset
