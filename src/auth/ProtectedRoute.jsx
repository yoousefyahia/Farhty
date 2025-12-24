import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import Loading from "../components/Loading"; 

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loading message="جاري التحميل..." />;

  if (!user) return <Navigate to="/login" />;

  return children;
}
