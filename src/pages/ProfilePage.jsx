import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function ProfilePage({ user: userProp }) {
  const { user: userContext } = useContext(AuthContext);
  const user = userContext || userProp;

  if (!user) {
    return (
      <div className="p-5 text-red-500 text-right">
        لا يوجد بيانات مستخدم حالياً.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-right">
      <h2 className="text-2xl font-bold mb-4">الملف الشخصي</h2>

      <div className="space-y-4">
        <div className="text-right">
          <span className="font-semibold text-gray-700 dark:text-gray-300">الاسم:</span>
          <div className="text-gray-900 dark:text-white">{user.name || "غير محدد"}</div>
        </div>

        <div className="text-right">
          <span className="font-semibold text-gray-700 dark:text-gray-300">رقم الهاتف:</span>
          <div className="text-gray-900 dark:text-white">{user.phone || "غير محدد"}</div>
        </div>
      </div>
    </div>
  );
}
