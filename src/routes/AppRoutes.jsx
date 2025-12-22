import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../auth/ProtectedRoute";
import DashboardSkeleton from "../components/DashboardSkeleton"
export default function AppRoutes() {
  const { loading } = useContext(AuthContext);

if (loading)
  return <DashboardSkeleton />;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
