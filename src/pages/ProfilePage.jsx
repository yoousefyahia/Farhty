import React, { useEffect, useState } from "react";
import api from "../api/axois";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [profileLoaded, setProfileLoaded] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);

  const defaultProfile =
    "https://static.vecteezy.com/system/resources/thumbnails/032/176/191/small/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg";

  const defaultCover =
    "https://flowbite.com/docs/images/examples/image-3@2x.jpg";

  useEffect(() => {

    api
      .get("/admin/me")
      .then((res) => {
        setUser(res.data.data);
      })
      .catch((err) => {
          toast.error("فشل تحميل البيانات، حاول مرة أخرى");
          setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading message="جاري تحميل الملف الشخصي..." />;

  if (!user) {
    return (
      <div className="p-5 text-red-500 text-right">
        لا يوجد بيانات مستخدم حالياً.
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-right max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">الملف الشخصي</h2>

      {/* الصور */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* صورة البروفايل */}
        <div>
          <p className="font-semibold mb-2">الصورة الشخصية</p>

          {!profileLoaded && (
            <img
              src={defaultProfile}
              className="h-32 w-32 rounded-full object-cover border"
              alt="default"
              loading="lazy"
            />
          )}

          <img
            src={user.image}
            alt="profile"
            loading="lazy"
            className={`h-32 w-32 rounded-full object-cover border ${
              profileLoaded ? "block" : "hidden"
            }`}
            onLoad={() => {
              setProfileLoaded(true);
            }}
            onError={() => {
              setProfileLoaded(true);
            }}
          />
        </div>

        {/* صورة الغلاف */}
        <div>
          <p className="font-semibold mb-2">صورة الغلاف</p>

          {!coverLoaded && (
            <img
              src={defaultCover}
              className="h-32 w-full rounded object-cover border"
              alt="default"
              loading="lazy"
            />
          )}

          <img
            src={user.cover}
            alt="cover"
            loading="lazy"
            className={`h-32 w-full rounded object-cover border ${
              coverLoaded ? "block" : "hidden"
            }`}
            onLoad={() => {
              setCoverLoaded(true);
            }}
            onError={() => {
              setCoverLoaded(true);
            }}
          />
        </div>
      </div>

      {/* البيانات */}
      <div className="space-y-4">
        <Item label="الاسم" value={user.name} />
        <Item label="اسم المستخدم" value={user.user_name} />
        <Item label="رقم الهاتف" value={user.phone} />
        <Item
          label="الجنس"
          value={
            user.gender === "male"
              ? "ذكر"
              : user.gender === "female"
              ? "أنثى"
              : "غير محدد"
          }
        />
        <Item label="الصلاحية" value={user.is_admin ? "مدير" : "مستخدم"} />
      </div>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div>
      <span className="font-semibold">{label}: </span>
      <span>{value || "غير محدد"}</span>
    </div>
  );
}
