import React, { useEffect, useState } from "react";
import api from "../api/axois";
import toast, { Toaster } from "react-hot-toast";

export default function PrivacyPolicyAdmin() {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchPolicy = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/privacy-policies");
      setPolicy(res.data.data[0] || null);
    } catch (err) {
      console.error(err);
      setError("فشل تحميل سياسة الخصوصية");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  const handleSave = async () => {
    if (!policy) return;
    setSaving(true);
    try {
      const res = await api.put(`/admin/privacy-policies/${policy.id}`, {
        title: policy.title,
        text: policy.text,
      });
      setPolicy(res.data.data);
      toast.success(res.data.message || "تم التحديث بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("فشل تحديث سياسة الخصوصية");
    }
    setSaving(false);
  };

  if (loading) return <p className="p-4 text-center">جارٍ التحميل...</p>;
  if (error) return <p className="p-4 text-red-500 text-center">{error}</p>;
  if (!policy) return <p className="p-4 text-center">لا توجد سياسة للعرض</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <Toaster position="top-right" reverseOrder={false} />

      {/* النص الحالي */}
      <div className="p-4 bg-gray-50 rounded border text-gray-800 whitespace-pre-wrap">
        <h2 className="font-semibold mb-2">{policy.title}</h2>
        <p className="text-sm">{policy.text}</p>
      </div>

      {/* Form للتعديل */}
      <div className="p-4 border rounded bg-white space-y-3">
        <h3 className="text-lg font-bold">تعديل السياسة</h3>

        <input
          type="text"
          className="w-full p-2 border rounded text-sm"
          value={policy.title}
          onChange={(e) => setPolicy({ ...policy, title: e.target.value })}
          placeholder="عنوان السياسة"
        />

        <textarea
          className="w-full p-2 border rounded h-40 text-sm"
          value={policy.text}
          onChange={(e) => setPolicy({ ...policy, text: e.target.value })}
          placeholder="نص سياسة الخصوصية"
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          {saving ? "جارٍ الحفظ..." : "حفظ"}
        </button>
      </div>
    </div>
  );
}
