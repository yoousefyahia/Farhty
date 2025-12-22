import React from "react";

export default function Sidebar({ activeMenu, setActiveMenu }) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-6 border-l border-gray-200 dark:border-gray-700 ml-auto h-screen flex flex-col">
      <h3 className="text-2xl font-bold mb-6 text-right">القائمة</h3>
      <ul className="flex-1 space-y-3 text-right">
        {[
           {key :"StatisticsPage", label :"الرئيسيه"},
          { key: "profile", label: "البروفايل" },
          { key: "editProfile", label: "تعديل البروفايل" },
          { key: "AllUser", label: "كل المستخدمين" },
           { key: "competitions", label: "المسابقات" },
           { key: "privacyPolicy", label: "سياسة الخصوصية" },
        ].map((item) => (
          <li
            key={item.key}
            className={`cursor-pointer p-3 rounded transition-colors duration-200 text-lg ${
              activeMenu === item.key
                ? "bg-blue-500 text-white font-semibold"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
            onClick={() => setActiveMenu(item.key)}
          >
            {item.label}
          </li>
        ))}
      </ul>
      {/* <p className="text-sm text-gray-500 mt-auto text-right">
        &copy; 2025 Dashboard
      </p> */}
    </aside>
  );
}
