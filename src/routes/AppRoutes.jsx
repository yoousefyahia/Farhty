import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../auth/ProtectedRoute";
import DashboardSkeleton from "../components/DashboardSkeleton";

// صفحات المسابقات
import CompetitionsPage from "../pages/CompetitionsPage";
import ContestDetailsPage from "../pages/ContestDetailsPage";
import ContestResultsPage from "../pages/ContestResultsPage";

export default function AppRoutes() {
  const { loading } = useContext(AuthContext);

  if (loading) return <DashboardSkeleton />;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* مسار الداشبورد الرئيسي */}
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* المسابقات */}
        <Route path="/contests" element={<ProtectedRoute><CompetitionsPage /></ProtectedRoute>} />
        <Route path="/contests/:id/details" element={<ProtectedRoute><ContestDetailsPage /></ProtectedRoute>} />
        <Route path="/contests/:id/results" element={<ProtectedRoute><ContestResultsPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
