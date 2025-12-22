import React, { useState } from "react";
import api from "../api/axois";
import toast from "react-hot-toast";

export default function UpdateUser({ user, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: user.name || "",
    user_name: user.user_name || "",
    phone: user.phone || "",
    role: user.role || "follower",
    gender: user.gender || "male",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const submit = async () => {
    try {
      setLoading(true);

      await api.put(`/admin/users/${user.id}`, form);

      toast.success("تم تحديث بيانات المستخدم ✅");
      setOpen(false);
      onSuccess();
    } catch (err) {
      toast.error("فشل التعديل ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* زر التعديل */}
      <button
        onClick={() => setOpen(true)}
        className="bg-green-600 text-white px-3 py-1"
      >
        تعديل
      </button>

      {/* المودال */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[420px] p-5 rounded">
            <h3 className="text-lg font-bold mb-4">تعديل المستخدم</h3>

            <div className="space-y-3">
              <input
                name="name"
                placeholder="الاسم"
                className="border p-2 w-full"
                value={form.name}
                onChange={handleChange}
              />

              <input
                name="user_name"
                placeholder="اسم المستخدم"
                className="border p-2 w-full"
                value={form.user_name}
                onChange={handleChange}
              />

              <input
                name="phone"
                placeholder="رقم الهاتف"
                className="border p-2 w-full"
                value={form.phone}
                onChange={handleChange}
              />

              <select
                name="role"
                className="border p-2 w-full"
                value={form.role}
                onChange={handleChange}
              >
                <option value="follower">Follower</option>
                <option value="celebrity">Celebrity</option>
              </select>

              <select
                name="gender"
                className="border p-2 w-full"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-1 border"
              >
                إلغاء
              </button>

              <button
                disabled={loading}
                onClick={submit}
                className="bg-green-600 text-white px-4 py-1"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
