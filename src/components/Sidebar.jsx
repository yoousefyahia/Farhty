import React, { useEffect, useState } from "react";
import api from "../api/axois";

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultImage =
    "https://static.vecteezy.com/system/resources/thumbnails/032/176/191/small/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/admin/me");
        setUser(res.data.data);
      } catch (err) {
        console.error("Sidebar user error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-6 border-l ml-auto h-screen flex flex-col">
      {/* صورة واسم الادمن */}
      <div className="flex flex-col items-center mb-6">
        {loading ? (
          <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
        ) : (
          <img
            src={user?.image || defaultImage}
            alt={user?.name}
            loading="lazy"
            className="w-16 h-16 rounded-full object-cover mb-2"
          />
        )}

        <p className="text-center font-semibold text-lg">
          {user?.name}
        </p>
      </div>

      <ul className="flex-1 space-y-3 text-right">
        {[
          { key: "StatisticsPage", label: "الرئيسيه" },
          { key: "AdminsPage", label: "المسؤولين" },
          { key: "profile", label: "البروفايل" },
          { key: "editProfile", label: "تعديل البروفايل" },
          { key: "ContactsAdmin", label: "رسائل الادمن" },
          { key: "AllUser", label: "كل المستخدمين" },
          { key: "competitions", label: "المسابقات" },
          { key: "privacyPolicy", label: "سياسة الخصوصية" },
        ].map((item) => (
          <li
            key={item.key}
            onClick={() => setActiveMenu(item.key)}
            className={`cursor-pointer p-3 rounded ${
              activeMenu === item.key
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
