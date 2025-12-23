import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axois";
export default function Navbar({ toggleSidebar }) {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
const handleLogout = async () => {
  try {
    await api.post("/admin/logout"); 
  } catch (err) {
    console.error("Logout failed:", err);
  }
  Cookies.remove("token");
  setUser(null);
  navigate("/login");
};


  const handleLogin = () => navigate("/login");

  return (
 <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
  <button onClick={toggleSidebar} className="text-xl">
    ☰
  </button>
    <h1 className="text-lg font-bold">Dashboard</h1>

  <div className="flex items-center gap-2">
    {user ? (
      <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
        تسجيل خروج
      </button>
    ) : (
      <button onClick={handleLogin} className="bg-green-600 px-3 py-1 rounded hover:bg-green-700">
        تسجيل دخول
      </button>
    )}
  </div>
</nav>

  );
}

