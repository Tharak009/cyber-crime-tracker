import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import SafetyTipsPage from "./pages/public/SafetyTipsPage";
import LoginPage from "./pages/public/LoginPage";
import RegisterPage from "./pages/public/RegisterPage";
import ReportCrimePage from "./pages/public/ReportCrimePage";
import CitizenDashboardPage from "./pages/citizen/CitizenDashboardPage";
import OfficerDashboardPage from "./pages/officer/OfficerDashboardPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ProfilePage from "./pages/ProfilePage";
import ThemeToggle from "./components/common/ThemeToggle";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/safety-tips" element={<SafetyTipsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/report-crime" element={<ReportCrimePage />} />
        <Route
          path="/profile"
          element={(
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/citizen"
          element={
            <ProtectedRoute roles={["ROLE_CITIZEN"]}>
              <CitizenDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/officer"
          element={
            <ProtectedRoute roles={["ROLE_OFFICER"]}>
              <OfficerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ROLE_ADMIN"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
