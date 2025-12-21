import React, { createContext, useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import api from "../api/axois";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      api
        .get("/admin/me")
        .then((res) => setUser(res.data.data))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // memoize الـ value لتجنب rerender غير ضروري
  const contextValue = useMemo(() => ({ user, setUser, loading }), [user, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
