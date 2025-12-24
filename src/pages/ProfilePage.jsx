import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import Loading from "../components/Loading";

export default function ProfilePage() {
  const { user, loading } = useContext(AuthContext);

  const defaultProfile =
    "https://static.vecteezy.com/system/resources/thumbnails/032/176/191/small/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg";
  const defaultCover =
    "https://flowbite.com/docs/images/examples/image-3@2x.jpg";

  if (loading) return <Loading message="جاري جلب بيانات المستخدم..." />;

  if (!user) {
    return (
      <div className="p-5 text-red-500 text-right">
        لا يوجد بيانات مستخدم حالياً.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-right max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">الملف الشخصي</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* الصورة الشخصية */}
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            الصورة الشخصية:
          </span>
          <div className="mt-2">
            <img
              src={user.image || defaultProfile}
              alt="profile"
              className="h-32 w-32 rounded-full object-cover border"
              onError={(e) => (e.currentTarget.src = defaultProfile)}
            />
          </div>
        </div>

        {/* صورة الغلاف */}
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            صورة الغلاف:
          </span>
          <div className="mt-2">
            <img
              src={user.cover || defaultCover}
              alt="cover"
              className="h-32 w-full rounded object-cover border"
              onError={(e) => (e.currentTarget.src = defaultCover)}
            />
          </div>
        </div>
      </div>

      {/* البيانات النصية */}
      <div className="space-y-4 text-right">
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">الاسم:</span>
          <div className="text-gray-900 dark:text-white">{user.name || "غير محدد"}</div>
        </div>

        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">اسم المستخدم:</span>
          <div className="text-gray-900 dark:text-white">{user.user_name || "غير محدد"}</div>
        </div>

        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">رقم الهاتف:</span>
          <div className="text-gray-900 dark:text-white">{user.phone || "غير محدد"}</div>
        </div>

        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">الجنس:</span>
          <div className="text-gray-900 dark:text-white">
            {user.gender === "male" ? "ذكر" : user.gender === "female" ? "أنثى" : "غير محدد"}
          </div>
        </div>

        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">الصلاحية:</span>
          <div className="text-gray-900 dark:text-white">
            {user.is_admin ? "مدير" : "مستخدم عادي"}
          </div>
        </div>
      </div>
    </div>
  );
}
