import React from "react";
import toast from "react-hot-toast";
import api from "../api/axois";

export function ShowDetailsButton({ contest, onOpen }) {
  return (
    <button
      onClick={() => onOpen(contest)}
      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded w-full mb-1"
    >
      عرض التفاصيل
    </button>
  );
}

export function DeleteButton({ contestId }) {
  const handleDelete = async () => {
    try {
      // مثال: استدعاء API للحذف
      await api.delete(`/admin/contests/${contestId}`);
      toast.success("تم حذف المسابقة بنجاح");
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء الحذف");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded w-full mb-1"
    >
      حذف
    </button>
  );
}

export function ResultsButton({ contestId }) {
  const handleResults = async () => {
    try {
      const res = await api.get(`/admin/contests/${contestId}/results`);
      console.log("نتائج المسابقة:", res.data);
      toast.success(`تم جلب النتائج بنجاح (${res.data.length} عناصر)`);
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء جلب النتائج");
    }
  };

  return (
    <button
      onClick={handleResults}
      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded w-full"
    >
      النتائج
    </button>
  );
}
