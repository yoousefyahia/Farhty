import React from "react";

export default function UsersFilter({ setFilters }) {
  const handleSearch = (e) => {
    setFilters({
      search: e.target.value,
      page: 1,
    });
  };

  const handleRole = (e) => {
    setFilters({
      role: e.target.value,
      page: 1,
    });
  };

  return (
    <div className="flex gap-4 items-center">
      <input
        type="text"
        placeholder="بحث بالاسم..."
        onChange={handleSearch}
        className="border px-3 py-2 rounded w-64"
      />

      <select
        onChange={handleRole}
        className="border px-3 py-2 rounded"
        defaultValue=""
      >
        <option value="">كل الأدوار</option>
        <option value="follower">Follower</option>
        <option value="user">User</option>
      </select>
    </div>
  );
}
