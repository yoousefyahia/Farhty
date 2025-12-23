import React, { useState, useRef } from "react";

export default function ContestsFilter({ setFilters }) {
  const [localSearch, setLocalSearch] = useState("");
  const searchTimeout = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearch(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: value || "",
        page: 1,
      }));
    }, 500);
  };

  return (
    <div className="flex flex-wrap justify-end gap-4 mb-6 items-center">
      <input
        type="text"
        placeholder="بحث بالعنوان..."
        value={localSearch}
        onChange={handleSearch}
        className="border px-3 py-2 rounded w-64"
      />

      <select
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            status: e.target.value,
            page: 1,
          }))
        }
        className="border px-3 py-2 rounded"
      >
        <option value="">كل الحالات</option>
        <option value="active">نشطة</option>
        <option value="ended">منتهية</option>
        <option value="inactive">غير نشطة</option>
      </select>

      <input
        type="number"
        placeholder="ID المشهور"
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            user_id: e.target.value || "",
            page: 1,
          }))
        }
        className="border px-3 py-2 rounded w-32"
      />
    </div>
  );
}
