import React from "react";

export default function UsersFilter({ setFilters }) {
  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      search: value,
      page: 1, // مهم جدًا
    }));
  };

  const handleRole = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      role: value,
      page: 1, // مهم جدًا
    }));
  };

  return (
    <div className="flex gap-4 items-center">
      {/* Search */}
      <input
        type="text"
        placeholder="بحث بالاسم..."
        onChange={handleSearch}
        className="border px-3 py-2 rounded w-64"
      />

      {/* Role Filter */}
      <select
        onChange={handleRole}
        className="border px-3 py-2 rounded"
        defaultValue=""
      >
        <option value="">كل الأدوار</option>
        {/* <option value="admin">Admin</option> */}
        <option value="follower">Follower</option>
        <option value="user">User</option>
      </select>
    </div>
  );
}
