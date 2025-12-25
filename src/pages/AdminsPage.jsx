import React, { useEffect, useState } from "react";
import api from "../api/axois";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Pagination from "../components/Pagination";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

// schema
const schema = yup.object().shape({
  name: yup.string().required("الاسم مطلوب"),
  phone: yup.string().matches(/^\d{10,11}$/, "رقم الهاتف غير صحيح").required(),
  password: yup.string().min(6, "كلمة المرور على الأقل 6 حروف").required(),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "كلمة المرور غير متطابقة")
    .required()
});

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAdminData, setEditAdminData] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema)
  });

  const fetchAdmins = (page = 1) => {
    setLoading(true);
    api.get(`/admin/admins?page=${page}`)
      .then(res => {
        setAdmins(res.data.data.data);
        setCurrentPage(res.data.data.current_page);
        setLastPage(res.data.data.last_page);
      })
      .catch(() => toast.error("حدث خطأ أثناء جلب البيانات"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleAddAdmin = (data) => {
    api.post("/admin/admins", { ...data, role: "admin" })
      .then(() => {
        toast.success("تم إضافة المسؤول");
        setShowAddModal(false);
        reset();
        fetchAdmins(currentPage);
      })
      .catch(() => toast.error("حدث خطأ أثناء الإضافة"));
  };

  // استخدام البيانات الموجودة بدون جلب جديد
  const handleViewAdmin = (admin) => {
    setSelectedAdmin(admin);
    setShowDetailsModal(true);
  };

  const handleEditAdmin = (admin) => {
    setEditAdminData(admin);
    setValue("name", admin.name);
    setValue("phone", admin.phone);
    setValue("password", "");
    setValue("password_confirmation", "");
    setShowEditModal(true);
  };

  const handleUpdateAdmin = (data) => {
    api.put(`/admin/admins/${editAdminData.id}`, data)
      .then(() => {
        toast.success("تم تحديث المسؤول");
        setShowEditModal(false);
        fetchAdmins(currentPage);
      })
      .catch(() => toast.error("حدث خطأ أثناء التحديث"));
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/admin/admins/${adminToDelete}`);
      toast.success("تم حذف المسؤول");
      fetchAdmins(currentPage);
    } catch {
      toast.error("حدث خطأ أثناء الحذف");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setAdminToDelete(null);
    }
  };

  if (loading) return <p className="text-center">جاري تحميل البيانات...</p>;

  return (
    <div className="p-5 relative">
      <Toaster position="top-center" reverseOrder={false} toastOptions={{ style: { textAlign: "center" } }} />
      <h2 className="text-xl font-bold mb-4">المسؤولين</h2>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowAddModal(true)}
      >
        إضافة مسؤول جديد
      </button>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-transparent bg-opacity-20" onClick={() => setShowAddModal(false)}></div>
          <div className="bg-white p-6 rounded w-96 relative z-10 shadow-lg">
            <h3 className="text-lg font-bold mb-4">إضافة مسؤول جديد</h3>
            <form onSubmit={handleSubmit(handleAddAdmin)}>
              <input type="text" placeholder="الاسم" {...register("name")} className="border p-2 rounded w-full mb-1"/>
              <p className="text-red-500 text-sm mb-2">{errors.name?.message}</p>

              <input type="text" placeholder="رقم الهاتف" {...register("phone")} className="border p-2 rounded w-full mb-1"/>
              <p className="text-red-500 text-sm mb-2">{errors.phone?.message}</p>

              <input type="password" placeholder="كلمة المرور" {...register("password")} className="border p-2 rounded w-full mb-1"/>
              <p className="text-red-500 text-sm mb-2">{errors.password?.message}</p>

              <input type="password" placeholder="تأكيد كلمة المرور" {...register("password_confirmation")} className="border p-2 rounded w-full mb-4"/>
              <p className="text-red-500 text-sm mb-2">{errors.password_confirmation?.message}</p>

              <div className="flex justify-end gap-2">
                <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowAddModal(false)}>إلغاء</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* جدول المسؤولين */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">الاسم</th>
            <th className="border p-2">الدور</th>
            <th className="border p-2">الهاتف</th>
            <th className="border p-2">مفعل</th>
            <th className="border p-2">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {admins.map(admin => (
            <tr key={admin.id}>
              <td className="border p-2">{admin.id}</td>
              <td className="border p-2">{admin.name}</td>
              <td className="border p-2">{admin.role}</td>
              <td className="border p-2">{admin.phone}</td>
              <td className="border p-2">{admin.verified ? "نعم" : "لا"}</td>
              <td className="border p-2 flex gap-2">
                <button onClick={() => handleViewAdmin(admin)} className="bg-blue-600 text-white px-2 py-1 rounded">تفاصيل</button>
                <button onClick={() => handleEditAdmin(admin)} className="bg-blue-500 text-white px-2 py-1 rounded">تحديث</button>
                <button onClick={() => { setAdminToDelete(admin.id); setShowDeleteModal(true); }} className="bg-red-600 text-white px-2 py-1 rounded">حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination current={currentPage} last={lastPage} onChange={fetchAdmins} />

      {/* Details Modal */}
      {showDetailsModal && selectedAdmin && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-transparent bg-opacity-20" onClick={() => setShowDetailsModal(false)}></div>
          <div className="bg-white p-6 rounded w-96 relative z-10 shadow-lg">
            <h3 className="text-lg font-bold mb-4">تفاصيل المسؤول</h3>
            <p><strong>معرف المستخدم:</strong> {selectedAdmin.id}</p>
            <p><strong>الاسم:</strong> {selectedAdmin.name}</p>
            <p><strong>الهاتف:</strong> {selectedAdmin.phone}</p>
            <p><strong>مسؤول:</strong> {selectedAdmin.is_admin ? "نعم" : "لا"}</p>
            <p><strong>تاريخ الإنشاء:</strong> {new Date(selectedAdmin.created_at).toLocaleDateString()}</p>
            <p><strong>آخر تحديث:</strong> {new Date(selectedAdmin.updated_at).toLocaleDateString()}</p>

            <div className="flex justify-end mt-4">
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowDetailsModal(false)}>إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editAdminData && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-transparent bg-opacity-20 backdrop-blur-sm" onClick={() => setShowEditModal(false)}></div>
          <div className="bg-white p-6 rounded w-96 relative z-10 shadow-lg">
            <h3 className="text-lg font-bold mb-4">تحديث بيانات المسؤول</h3>
            <form onSubmit={handleSubmit(handleUpdateAdmin)}>
              <input type="text" placeholder="الاسم" {...register("name")} className="border p-2 rounded w-full mb-1"/>
              <p className="text-red-500 text-sm mb-2">{errors.name?.message}</p>

              <input type="text" placeholder="رقم الهاتف" {...register("phone")} className="border p-2 rounded w-full mb-1"/>
              <p className="text-red-500 text-sm mb-2">{errors.phone?.message}</p>

              <input type="password" placeholder="كلمة المرور الجديدة" {...register("password")} className="border p-2 rounded w-full mb-1"/>
              <p className="text-red-500 text-sm mb-2">{errors.password?.message}</p>

              <input type="password" placeholder="تأكيد كلمة المرور" {...register("password_confirmation")} className="border p-2 rounded w-full mb-4"/>
              <p className="text-red-500 text-sm mb-2">{errors.password_confirmation?.message}</p>

              <div className="flex justify-end gap-2">
                <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowEditModal(false)}>إلغاء</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        loading={deleteLoading}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAdmin}
      />
    </div>
  );
}
