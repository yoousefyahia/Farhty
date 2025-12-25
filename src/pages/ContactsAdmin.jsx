import React, { useEffect, useState } from "react";
import axios from "../api/axois";
import { toast } from "react-hot-toast";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/admin/contacts", {
        params: { page: 1, per_page: 15 },
      });
      setContacts(res.data.data.data);
    } catch {
      toast.error("فشل تحميل الرسائل");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const markRead = async (id) => {
    try {
      await axios.post(`/admin/contacts/${id}/read`);
      toast.success("تم تحديد الرسالة كمقروءة");
      fetchContacts();
    } catch {
      toast.error("فشل العملية");
    }
  };

  const markAllRead = async () => {
    try {
      await axios.post("/admin/contacts/mark-all-read");
      toast.success("تم تحديد جميع الرسائل كمقروءة");
      fetchContacts();
    } catch {
      toast.error("فشل العملية");
    }
  };

  const confirmDeleteContact = async () => {
    try {
      setDeleteLoading(true);
      await axios.delete(`/admin/contacts/${selectedContactId}`);
      toast.success("تم حذف الرسالة");
      fetchContacts();
    } catch {
      toast.error("فشل حذف الرسالة");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setSelectedContactId(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">الرسائل</h2>
        <button
          onClick={markAllRead}
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
        >
          تحديد كل الرسائل كمقروءة
        </button>
      </div>

      {loading ? (
        <p>جارٍ التحميل...</p>
      ) : contacts.length === 0 ? (
        <p>لا توجد رسائل</p>
      ) : (
        <table className="w-full border text-right">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">الاسم</th>
              <th className="p-2 border">الهاتف</th>
              <th className="p-2 border">الايميل</th>
              <th className="p-2 border">الرسالة</th>
              <th className="p-2 border">تحكم</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr
                key={c.id}
                className={`border ${c.is_read ? "bg-gray-50" : "bg-white"}`}
              >
                <td className="p-2 border">{c.id}</td>
                <td className="p-2 border">{c.name}</td>
                <td className="p-2 border">{c.phone}</td>
                <td className="p-2 border">{c.email || "-"}</td>
                <td className="p-2 border whitespace-pre-wrap">{c.message}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => markRead(c.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    {c.is_read ? "مقروء" : "تحديد كمقروء"}
                  </button>

                  <button
                    onClick={() => {
                      setSelectedContactId(c.id);
                      setShowDeleteModal(true);
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ConfirmDeleteModal
        open={showDeleteModal}
        loading={deleteLoading}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedContactId(null);
        }}
        onConfirm={confirmDeleteContact}
      />
    </div>
  );
}
