import React, { useState, useEffect, useContext, useRef } from "react";
import api from "../api/axois";
import { AuthContext } from "../auth/AuthContext";

export default function EditProfilePage({ user: userProp }) {
  const authContext = useContext(AuthContext);
  const { user: userContext, loading, setUser } = authContext || {};

  // استخدام context مباشرة للتأكد من التحديث التلقائي
  const user = userContext || userProp;
  const [form, setForm] = useState({
    name: "",
    user_name: "",
    phone: "",
    email: "",
    gender: "",
    role: "",
    bio: "",
    image: null,
    cover: null,
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const imageInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const isUpdatingRef = useRef(false); // لتجنب إعادة تعيين النموذج أثناء التحديث

  // حماية لو user لسه ما اتحملش
  useEffect(() => {
    if (!user || isUpdatingRef.current) return; // لا نحدث إذا كان التحديث جاري

    try {
      setForm({
        name: user?.name || "",
        user_name: user?.user_name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        gender: user?.gender || "",
        role: user?.role || "",
        bio: user?.bio || user?.description || "",
        image: null,
        cover: null,
      });
      // تحديث معاينة الصور
      if (user?.image) {
        const imageUrl = user.image.startsWith('http') || user.image.startsWith('/')
          ? user.image 
          : `${import.meta.env.VITE_API_BASE_URL || ''}/${user.image}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview(null);
      }
      
      if (user?.cover) {
        const coverUrl = user.cover.startsWith('http') || user.cover.startsWith('/')
          ? user.cover
          : `${import.meta.env.VITE_API_BASE_URL || ''}/${user.cover}`;
        setCoverPreview(coverUrl);
      } else {
        setCoverPreview(null);
      }
    } catch (error) {
      console.error("Error setting form data:", error);
      setMessage("حدث خطأ في تحميل بيانات المستخدم");
      setMessageType("error");
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
    setForm((prev) => ({ ...prev, image: file }));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result);
    reader.readAsDataURL(file);
    setForm((prev) => ({ ...prev, cover: file }));
  };

  const handleSave = async () => {
    if (!user || saving) {
      if (!user?.id) {
        setMessage("خطأ: معرف المستخدم غير موجود");
        setMessageType("error");
      }
      return;
    }

    if (!user.id) {
      setMessage("خطأ: معرف المستخدم غير موجود");
      setMessageType("error");
      return;
    }

    setSaving(true);
    setMessage("");
    setMessageType("");
    isUpdatingRef.current = true; // منع useEffect من إعادة تعيين النموذج
    
    try {
      const formData = new FormData();
      
      // إرسال الحقول الأساسية (مطلوبة) - نرسل القيمة الجديدة فقط
      if (form.name) {
        formData.append("name", form.name.trim());
      }
      if (form.phone) {
        formData.append("phone", form.phone.trim());
      }
      
      // إرسال الحقول الاختيارية فقط إذا كانت لها قيم (القيمة الجديدة فقط)
      if (form.user_name && form.user_name.trim() !== "") {
        formData.append("user_name", form.user_name.trim());
      }
      if (form.email && form.email.trim() !== "") {
        formData.append("email", form.email.trim());
      }
      if (form.gender && form.gender.trim() !== "") {
        formData.append("gender", form.gender.trim());
      }
      if (form.role && form.role.trim() !== "") {
        formData.append("role", form.role.trim());
      }
      if (form.bio && form.bio.trim() !== "") {
        formData.append("bio", form.bio.trim());
      }
      
      // إضافة الملفات فقط إذا كانت موجودة
      if (form.image instanceof File) {
        formData.append("image", form.image);
      }
      if (form.cover instanceof File) {
        formData.append("cover", form.cover);
      }

      console.log("Sending update request for user ID:", user.id);
      console.log("Form data being sent:", {
        name: form.name,
        user_name: form.user_name,
        phone: form.phone,
        email: form.email,
        gender: form.gender,
        role: form.role,
        bio: form.bio,
        hasImage: form.image instanceof File,
        hasCover: form.cover instanceof File,
      });
      
      // طباعة FormData للتأكد من البيانات المرسلة
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      
      // طباعة FormData للتأكد من البيانات المرسلة
      console.log("FormData contents:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // استخدام PUT مباشرة
      const response = await api.put(
        `/admin/users/${user.id}`,
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      console.log("Update response:", response.data);
      console.log("Response data.data:", response?.data?.data);
      
      // التحقق من الاستجابة
      if (response?.data?.success) {
        setMessage(response.data.message || "تم تحديث الملف الشخصي بنجاح!");
        setMessageType("success");

        // تحديث بيانات المستخدم في الـ context باستخدام البيانات من الاستجابة مباشرة
        const updatedUser = response?.data?.data;
        
        if (updatedUser && typeof setUser === "function") {
          console.log("Updating context with:", updatedUser);
          console.log("Updated phone in response:", updatedUser.phone);
          console.log("Form phone:", form.phone);
          console.log("Current userContext phone:", userContext?.phone);
          
          // استخدام بيانات الاستجابة مباشرة لأنها تحتوي على جميع البيانات المحدثة من السيرفر
          // البيانات المحدثة من السيرفر لها الأولوية دائماً
          console.log("Current userContext:", userContext);
          console.log("Updated user from response:", updatedUser);
          console.log("Form data:", form);
          
          // تحديث الـ context بالبيانات المحدثة من السيرفر مباشرة
          // هذا سيحدث Dashboard و ProfilePage تلقائياً
          // لكن فقط إذا كان المستخدم المحدث هو نفسه المستخدم الحالي
          if (user.id === userContext?.id && typeof setUser === "function") {
            // نستخدم updatedUser مباشرة لأنه يحتوي على البيانات المحدثة من السيرفر
            setUser(updatedUser);
            console.log("Updated context with:", updatedUser);
          }
          
          // تحديث النموذج بالبيانات الجديدة من الاستجابة مباشرة
          isUpdatingRef.current = true; // منع useEffect من إعادة تعيين النموذج
          setForm({
            name: updatedUser?.name || "",
            user_name: updatedUser?.user_name || "",
            phone: updatedUser?.phone || "",
            email: updatedUser?.email || "",
            gender: updatedUser?.gender || "",
            role: updatedUser?.role || "",
            bio: updatedUser?.bio || updatedUser?.description || "",
            image: null,
            cover: null,
          });
          
          // تحديث معاينة الصور إذا كانت موجودة
          if (updatedUser?.image) {
            const imageUrl = updatedUser.image.startsWith('http') || updatedUser.image.startsWith('/')
              ? updatedUser.image 
              : `${import.meta.env.VITE_API_BASE_URL || ''}/${updatedUser.image}`;
            setImagePreview(imageUrl);
          } else {
            setImagePreview(null);
          }
          
          if (updatedUser?.cover) {
            const coverUrl = updatedUser.cover.startsWith('http') || updatedUser.cover.startsWith('/')
              ? updatedUser.cover
              : `${import.meta.env.VITE_API_BASE_URL || ''}/${updatedUser.cover}`;
            setCoverPreview(coverUrl);
          } else {
            setCoverPreview(null);
          }
          
          // إعادة تعيين isUpdatingRef بعد تحديث النموذج
          setTimeout(() => {
            isUpdatingRef.current = false;
          }, 100);
        }
        
        // مسح حقول الملفات
        if (imageInputRef.current) imageInputRef.current.value = "";
        if (coverInputRef.current) coverInputRef.current.value = "";
      } else {
        setMessage("حدث خطأ غير متوقع");
        setMessageType("error");
      }
    } catch (err) {
      console.error("Update error:", err);
      console.error("Error response:", err?.response?.data);
      
      // عرض تفاصيل الخطأ من السيرفر
      const errorData = err?.response?.data;
      let errorMessage = "فشل تحديث الملف الشخصي";
      
      if (errorData) {
        // إذا كان هناك رسالة مباشرة
        if (errorData.message) {
          errorMessage = errorData.message;
        }
        // إذا كان هناك أخطاء validation
        else if (errorData.errors) {
          const validationErrors = Object.values(errorData.errors).flat();
          errorMessage = validationErrors.join(", ");
        }
        // إذا كان هناك رسالة في data
        else if (errorData.data?.message) {
          errorMessage = errorData.data.message;
        }
      }
      
      setMessage(errorMessage);
      setMessageType("error");
    } finally {
      setSaving(false);
      isUpdatingRef.current = false; // السماح لـ useEffect بالعمل مرة أخرى
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg bg-white p-6 text-right shadow dark:bg-gray-800">
        <div className="flex items-center gap-3 text-blue-600 dark:text-blue-300">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-300 dark:border-t-transparent" />
          <span>جاري التحقق من المستخدم...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-right text-red-500">
        المستخدم غير موجود
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow text-right">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">تعديل الملف الشخصي</h2>
        {saving && (
          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-300">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent dark:border-blue-300 dark:border-t-transparent" />
            <span>جاري الحفظ...</span>
          </div>
        )}
      </div>

      {/* صور البروفايل والغلاف */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">الصورة الشخصية</label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="الصورة الشخصية"
              className="mb-3 h-32 w-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
          )}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-600 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-200 dark:file:bg-gray-700 dark:file:text-gray-200"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-300">صورة الغلاف</label>
          {coverPreview && (
            <img
              src={coverPreview}
              alt="صورة الغلاف"
              className="mb-3 h-32 w-full rounded object-cover border-2 border-gray-200 dark:border-gray-600"
            />
          )}
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="w-full text-sm text-gray-600 file:mr-4 file:rounded file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100 dark:text-gray-200 dark:file:bg-gray-700 dark:file:text-gray-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">الاسم</label>
          <input
            className="w-full p-3 border rounded-lg text-right dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">اسم المستخدم</label>
          <input
            className="w-full p-3 border rounded-lg text-right dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name="user_name"
            value={form.user_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">رقم الهاتف</label>
          <input
            className="w-full p-3 border rounded-lg text-right dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">البريد الإلكتروني</label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg text-right dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">الجنس</label>
          <select
            className="w-full p-3 border rounded-lg text-right dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">اختر الجنس</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">الدور</label>
          <select
            className="w-full p-3 border rounded-lg text-right dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="">اختر الدور</option>
            <option value="user">مستخدم</option>
            <option value="celebrity">شخصية مشهورة</option>
            <option value="admin">مدير</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300">السيرة الذاتية / الوصف</label>
        <textarea
          className="w-full p-3 border rounded-lg text-right dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          name="bio"
          value={form.bio}
          onChange={handleChange}
          rows="4"
          placeholder="اكتب عن نفسك..."
        />
      </div>

      {message && (
        <div
          className={`mt-5 rounded-lg border p-3 text-sm ${
            messageType === "success"
              ? "border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/40 dark:text-green-200"
              : "border-red-300 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-900/40 dark:text-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          className="px-4 py-2 rounded font-semibold border border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:border-blue-500 dark:hover:bg-blue-600 dark:hover:border-blue-600 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "جارٍ الحفظ..." : "حفظ"}
        </button>
      </div>
    </div>
  );
}
