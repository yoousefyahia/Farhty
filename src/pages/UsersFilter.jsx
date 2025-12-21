import React, { useState } from "react";

export default function UsersFilter({ setFilters }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const applyFilter = () => {
    setFilters({ search, role });
  };

  return (
    <div className="flex gap-3">
      <input
        type="text"
        placeholder="بحث بالاسم"
        className="border p-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        className="border p-2"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">الكل</option>
        <option value="follower">Follower</option>
        <option value="celebrity">Celebrity</option>
      </select>

      <button
        onClick={applyFilter}
        className="bg-blue-600 text-white px-4"
      >
        فلترة
      </button>
    </div>
  );
}
