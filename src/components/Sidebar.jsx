import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Sidebar({ activeMenu, setActiveMenu }) {
  const { user } = useContext(AuthContext); 

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-6 border-l border-gray-200 dark:border-gray-700 ml-auto h-screen flex flex-col">
      
      {/* صورة واسم الادمن */}
      {user && (
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.image ||     "https://static.vecteezy.com/system/resources/thumbnails/032/176/191/small/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg"} // صورة افتراضية لو مفيش
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover mb-2"
          />
          <p className="text-center font-semibold text-lg text-gray-800 dark:text-white">
            {user.name}
          </p>
        </div>
      )}

      <ul className="flex-1 space-y-3 text-right">
        {[  
           {key :"StatisticsPage", label :"الرئيسيه"},
           {key:"AdminsPage",label:"المسؤولين"},
          { key: "profile", label: "البروفايل" },
          { key: "editProfile", label: "تعديل البروفايل" },
          { key: "ContactsAdmin", label: "رسائل الادمن" },
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
    </aside>
  );
}
