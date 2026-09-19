import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import AppShell from "./layouts/AppShell";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TrackingPage from "./pages/TrackingPage";
import FeedbackPage from "./pages/FeedbackPage";
import QualityPage from "./pages/QualityPage";
import AssemblerStationPage from "./pages/AssemblerStationPage";
import AssemblerBenchPage from "./pages/AssemblerBenchPage";
import LogisticsPage from "./pages/LogisticsPage";

function RoleHomeRedirect() {
  const { user, homeFor } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.roleId === "assembler" && !user.stationId) {
    return <Navigate to="/app/assembler/station" replace />;
  }
  return <Navigate to={homeFor(user.roleId)} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppShell />
              </RequireAuth>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="tracking" element={<TrackingPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="quality" element={<QualityPage />} />
            <Route path="logistics" element={<LogisticsPage />} />
            <Route path="assembler/station" element={<AssemblerStationPage />} />
            <Route path="assembler/bench" element={<AssemblerBenchPage />} />
          </Route>
          <Route path="/" element={<RoleHomeRedirect />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
