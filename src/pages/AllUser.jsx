import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../api/axois";
import UsersFilter from "../components/UsersFilter";
import DeleteUser from "../components/DeletUser";
import UpdateUser from "../components/UpdateUser";
import Pagination from "../components/Pagination";
import UserDetail from "../components/UserDetail";

export default function AllUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // filters من الـ URL مباشرة
  const filters = {
    role: searchParams.get("role") || "",
    search: searchParams.get("search") || "",
    page: Number(searchParams.get("page")) || 1,
  };

  const updateParams = (newFilters) => {
    setSearchParams(newFilters);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://app.frhty.site/api/admin/users",
        { params: filters }
      );

      setUsers(res.data.data.data);
      setPagination({
        current_page: res.data.data.current_page,
        last_page: res.data.data.last_page,
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 400);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="p-4" dir="rtl">
      <UsersFilter
        setFilters={(newFilters) =>
          updateParams({ ...filters, ...newFilters, page: 1 })
        }
      />

      {loading ? (
        <p className="animate-pulse">جارٍ التحميل...</p>
      ) : (
        <>
          <table className="w-full mt-4 border text-right">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">الاسم</th>
                <th className="p-2 border">الدور</th>
                <th className="p-2 border">الهاتف</th>
                <th className="p-2 border">تحكم</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center">
                    لا يوجد بيانات
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="p-2 border">{user.id}</td>
                    <td className="p-2 border">{user.name}</td>
                    <td className="p-2 border">{user.role}</td>
                    <td className="p-2 border">{user.phone}</td>
                    <td className="p-2 border whitespace-nowrap">
                      <div className="flex gap-2">
                        <UpdateUser user={user} onSuccess={fetchUsers} />
                        <DeleteUser id={user.id} onSuccess={fetchUsers} />
                        <button
                          onClick={() => setSelectedUser(user.id)}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                        >
                          عرض التفاصيل
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <Pagination
            current={pagination.current_page}
            last={pagination.last_page}
            onChange={(page) =>
              updateParams({ ...filters, page })
            }
          />
        </>
      )}

      {selectedUser && (
        <UserDetail
          userId={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
