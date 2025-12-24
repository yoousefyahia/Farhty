import React, { useState } from "react";
import api from "../../api/axois";
import toast from "react-hot-toast";

export default function DeleteUser({ id, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/admin/users/${id}`);
      toast.success("تم حذف المستخدم ✅");
      setOpen(false);
      onSuccess();
    } catch (err) {
      toast.error("فشل الحذف ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* زر الحذف */}
      <button
        onClick={() => setOpen(true)}
        className="bg-red-600 text-white px-3 py-1"
      >
        حذف
      </button>

      {/* مودال التأكيد */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded w-80">
            <h3 className="text-lg font-bold mb-4">تأكيد الحذف</h3>
            <p className="mb-4">هل أنت متأكد أنك تريد حذف هذا المستخدم؟</p>
            <div className="flex gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 border"
              >
                إلغاء
              </button>
              <button
                disabled={loading}
                onClick={handleDelete}
                className="bg-red-600 text-white px-3 py-1"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
