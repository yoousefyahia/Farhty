import React from "react";

export default function ConfirmDeleteModal({
  open,
  title = "تأكيد الحذف",
  message = "هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.",
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md text-center shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-red-600">
          {title}
        </h3>

        <p className="mb-6 text-gray-700">{message}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            إلغاء
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "جاري الحذف..." : "حذف"}
          </button>
        </div>
      </div>
    </div>
  );
}
