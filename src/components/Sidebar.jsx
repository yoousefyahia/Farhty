import React from "react";

export default function Sidebar({ activeMenu, setActiveMenu }) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-5 border-r border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-5">القائمة</h3>
      <ul className="space-y-3">
        <li
          className={`cursor-pointer p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            activeMenu === "profile" ? "bg-gray-200 dark:bg-gray-700 font-bold" : ""
          }`}
          onClick={() => setActiveMenu("profile")}
        >
          البروفايل
        </li>
        <li
          className={`cursor-pointer p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            activeMenu === "editProfile" ? "bg-gray-200 dark:bg-gray-700 font-bold" : ""
          }`}
          onClick={() => setActiveMenu("editProfile")}
        >
          تعديل البروفايل
        </li>
        <li
          className={`cursor-pointer p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
            activeMenu === "competitions" ? "bg-gray-200 dark:bg-gray-700 font-bold" : ""
          }`}
          onClick={() => setActiveMenu("competitions")}
        >
          المسابقات
        </li>
      </ul>
    </aside>
  );
}
