import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthContext } from "../auth/AuthContext";

export default function Navbar({ toggleSidebar }) {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // لو عندك API للlogout ممكن تستخدمه
      // await api.post("/admin/logout");
    } catch (err) {
      console.error(err);
    }
    Cookies.remove("token");
    setUser(null);
    navigate("/login");
  };

  const handleLogin = () => navigate("/login");

  return (
    <nav className="flex flex-row-reverse items-center p-4 bg-gray-800 text-white justify-between">
      {/* زر الـ toggle على اليمين */}
      <button onClick={toggleSidebar} className="text-xl">
        ☰
      </button>

      {/* العنوان في النص */}
      <h1 className="text-lg font-bold">Dashboard</h1>

      {/* زر تسجيل الدخول/الخروج على الشمال */}
      {user ? (
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          تسجيل خروج
        </button>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
        >
          تسجيل دخول
        </button>
      )}
    </nav>
  );
}

