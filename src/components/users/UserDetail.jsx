import React, { useEffect, useState } from "react";
import api from "../../api/axois";

export default function UserDetail({ userId, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/admin/users/${userId}`);
      if (!res.data.data) throw new Error("لا توجد بيانات للعرض");
      setUser(res.data.data);
    } catch (err) {
      console.error(err);
      setError(err.message || "حدث خطأ أثناء تحميل البيانات");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUser();
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
        >
          ✕
        </button>

        {/* Loading */}
        {loading && <p className="text-center animate-pulse">جارٍ التحميل...</p>}

        {/* Error */}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* User Info */}
        {user && (
          <div className="space-y-2 mt-4">
            <h2 className="text-2xl font-bold text-center">{user.name}</h2>

            <div className="grid grid-cols-2 gap-2">
              <p><strong>Role:</strong></p>
              <p>{user.role}</p>

              <p><strong>Phone:</strong></p>
              <p>{user.phone}</p>

              <p><strong>Gender:</strong></p>
              <p>{user.gender}</p>

              <p><strong>Verified:</strong></p>
              <p>{user.verified ? "Yes" : "No"}</p>

              <p><strong>Completed:</strong></p>
              <p>{user.completed ? "Yes" : "No"}</p>

              <p><strong>Created At:</strong></p>
              <p>{new Date(user.created_at).toLocaleString()}</p>

              <p><strong>Updated At:</strong></p>
              <p>{new Date(user.updated_at).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !user && (
          <p className="text-center text-gray-500 mt-4">لا توجد بيانات للعرض</p>
        )}
      </div>
    </div>
  );
}
