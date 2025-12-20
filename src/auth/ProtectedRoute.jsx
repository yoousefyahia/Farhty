import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="p-5">جاري التحقق من المستخدم...</div>;

  if (!user) return <Navigate to="/login" />;

  return children;
}
