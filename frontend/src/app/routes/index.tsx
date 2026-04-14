import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { GuestRoute } from "../../features/auth/components/GuestRoute";
import { ProtectedRoute } from "../../features/auth/components/ProtectedRoute";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { SignupPage } from "../../features/auth/pages/SignupPage";
import { UploadPage } from "../../features/datasets/pages/UploadPage";
import { ChartBuilderPage } from "../../features/chart-builder/pages/ChartBuilderPage";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage";
import { InsightsPage } from "../../features/insights/pages/InsightsPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignupPage />
            </GuestRoute>
          }
        />
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/builder/:datasetId" element={<ChartBuilderPage />} />
          <Route path="/insights/:datasetId" element={<InsightsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
