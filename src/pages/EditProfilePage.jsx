import React, { useState, useEffect, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/axois";
import { AuthContext } from "../auth/AuthContext";

// schema للتحقق
const schema = yup.object().shape({
  name: yup.string().required("الاسم مطلوب"),
  user_name: yup.string().required("اسم المستخدم مطلوب"),
  phone: yup.string().required("رقم الهاتف مطلوب"),
  gender: yup.string().required("اختر الجنس"),
  password: yup.string(),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "كلمة المرور وتأكيدها غير متطابقين")
    .when("password", {
      is: (val) => val && val.length > 0,
      then: (schema) => schema.required("تأكيد كلمة المرور مطلوب"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export default function EditProfilePage({ user: userProp }) {
  const { setUser } = useContext(AuthContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const imageInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const defaultProfile =
    "https://static.vecteezy.com/system/resources/thumbnails/032/176/191/small/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg";
  const defaultCover =
    "https://flowbite.com/docs/images/examples/image-3@2x.jpg";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/me");

        if (response.data.success) {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      user_name: "",
      phone: "",
      gender: "",
      password: "",
      password_confirmation: "",
      image: null,
      cover: null,
    },
  });

  useEffect(() => {
    if (!userData) return;

    reset({
      name: userData.name || "",
      user_name: userData.user_name || "",
      phone: userData.phone || "",
      gender: userData.gender || "",
      password: "",
      password_confirmation: "",
      image: null,
      cover: null,
    });

    setValue("gender", userData.gender || "");
    setImagePreview(null);
    setCoverPreview(null);
  }, [userData, reset, setValue]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setValue("image", file);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
    setValue("cover", file);
  };

  const onSubmit = async (data) => {
    if (!userData) return;

    setSaving(true);
    setMessage("");
    setMessageType("");

    try {
      const formData = new FormData();

      if (data.name !== userData.name) formData.append("name", data.name.trim());
      if (data.user_name !== userData.user_name) formData.append("user_name", data.user_name.trim());
      if (data.phone !== userData.phone) formData.append("phone", data.phone.trim());
      if (data.gender !== userData.gender) formData.append("gender", data.gender.trim());

      if (data.password) {
        formData.append("password", data.password);
        formData.append("password_confirmation", data.password_confirmation);
      }

      if (data.image instanceof File) formData.append("image", data.image);
      if (data.cover instanceof File) formData.append("cover", data.cover);

      const response = await api.post("/admin/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.data?.success) {
        const updatedUser = response.data.data;
        setMessage(response.data.message || "تم تحديث الملف الشخصي بنجاح!");
        setMessageType("success");

        setUserData(updatedUser);
        if (setUser) setUser(updatedUser);

        setImagePreview(null);
        setCoverPreview(null);

        reset({
          name: updatedUser.name || "",
          user_name: updatedUser.user_name || "",
          phone: updatedUser.phone || "",
          gender: updatedUser.gender || "",
          password: "",
          password_confirmation: "",
          image: null,
          cover: null,
        });
      } else {
        setMessage("حدث خطأ غير متوقع");
        setMessageType("error");
      }
    } catch (err) {
      const errorData = err?.response?.data;
      let errorMessage = "فشل تحديث الملف الشخصي";
      if (errorData?.errors) {
        errorMessage = Object.values(errorData.errors).flat().join(", ");
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"></path>
          </svg>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            جاري تحميل البيانات...
          </p>
        </div>
      </div>
    );

  if (!userData) return <div>المستخدم غير موجود</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow text-right">
      <h2 className="text-2xl font-bold mb-5">تعديل الملف الشخصي</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* الصورة الشخصية والغلاف */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* الصورة الشخصية */}
          <div>
            <label className="block mb-2 font-semibold">الصورة الشخصية</label>
            <img
              src={imagePreview || userData.image || defaultProfile}
              alt="profile"
              className="mb-3 h-32 w-32 rounded-full object-cover border"
              onError={(e) => { e.currentTarget.src = defaultProfile; }}
            />
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="px-3 py-1 bg-blue-500 text-white rounded mb-2 hover:bg-blue-600 transition"
            >
              اختر صورة
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={imageInputRef}
              className="hidden"
            />
          </div>

          {/* صورة الغلاف */}
          <div>
            <label className="block mb-2 font-semibold">صورة الغلاف</label>
            <img
              src={coverPreview || userData.cover || defaultCover}
              alt="cover"
              className="mb-3 h-32 w-full rounded object-cover border"
              onError={(e) => { e.currentTarget.src = defaultCover; }}
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="px-3 py-1 bg-blue-500 text-white rounded mb-2 hover:bg-blue-600 transition"
            >
              اختر صورة
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              ref={coverInputRef}
              className="hidden"
            />
          </div>
        </div>

        {/* الحقول النصية */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-semibold">الاسم</label>
            <input
              className="w-full p-3 border rounded text-right dark:bg-gray-700 dark:border-gray-600"
              {...register("name")}
            />
            <p className="text-red-600 text-sm mt-1">{errors.name?.message}</p>
          </div>
          <div>
            <label className="block mb-1 font-semibold">اسم المستخدم</label>
            <input
              className="w-full p-3 border rounded text-right dark:bg-gray-700 dark:border-gray-600"
              {...register("user_name")}
            />
            <p className="text-red-600 text-sm mt-1">{errors.user_name?.message}</p>
          </div>
          <div>
            <label className="block mb-1 font-semibold">رقم الهاتف</label>
            <input
              className="w-full p-3 border rounded text-right dark:bg-gray-700 dark:border-gray-600"
              {...register("phone")}
            />
            <p className="text-red-600 text-sm mt-1">{errors.phone?.message}</p>
          </div>
          <div>
            <label className="block mb-1 font-semibold">الجنس</label>
            <select
              className="w-full p-3 border rounded text-right dark:bg-gray-700 dark:border-gray-600"
              {...register("gender")}
            >
              <option value="">اختر الجنس</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
            <p className="text-red-600 text-sm mt-1">{errors.gender?.message}</p>
          </div>

          <div>
            <label className="block mb-1 font-semibold">كلمة المرور</label>
            <input
              type="password"
              className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600"
              {...register("password")}
              placeholder="اتركه فارغ إذا لم ترغب في تغييره"
            />
            <p className="text-red-600 text-sm mt-1">{errors.password?.message}</p>
          </div>

          <div>
            <label className="block mb-1 font-semibold">تأكيد كلمة المرور</label>
            <input
              type="password"
              className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600"
              {...register("password_confirmation")}
              placeholder="اتركه فارغ إذا لم ترغب في تغييره"
            />
            <p className="text-red-600 text-sm mt-1">{errors.password_confirmation?.message}</p>
          </div>
        </div>

        {message && (
          <div
            className={`mt-5 p-3 rounded ${
              messageType === "success"
                ? "bg-green-50 border border-green-300 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300"
                : "bg-red-50 border border-red-300 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? (
              <span className="flex items-center">
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                جاري الحفظ...
              </span>
            ) : "حفظ التغييرات"}
          </button>
        </div>
      </form>
    </div>
  );
}
