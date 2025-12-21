import React, { useEffect, useState } from "react";
import axios from "../api/axois";
import UsersFilter from "./UsersFilter";
import DeleteUser from "./DeletUser";
import UpdateUser from "./UpdateUser";

export default function AllUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    search: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://app.frhty.site/api/admin/users", {
        params: filters,
      });
      setUsers(res.data.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  return (
    <div className="p-4" dir="rtl">
      <UsersFilter setFilters={setFilters} />

      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <table className="w-full mt-4 border border-gray-300 text-right">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">الاسم</th>
              <th className="p-2 border-b">الدور</th>
              <th className="p-2 border-b">الهاتف</th>
              <th className="p-2 border-b">تحكم</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2">{user.phone}</td>
<td className="p-2 flex gap-2 justify-end w-max">
  <UpdateUser
    user={user}
    onSuccess={fetchUsers}
    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
  />
  <DeleteUser
    id={user.id}
    onSuccess={fetchUsers}
    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
  />
</td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
