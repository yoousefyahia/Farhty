import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axois";
import toast from "react-hot-toast";
import CompetitionCard from "../components/CompetitionCard";
import Pagination from "../components/Pagination";

let searchTimeout;

function ContestsFilter({ setFilters }) {
  const [localSearch, setLocalSearch] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearch(value);

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: value || "",
        page: 1,
      }));
    }, 500); // debounce 500ms
  };

  return (
    <div className="flex flex-wrap justify-end gap-4 mb-6 items-center">
      {/* بحث بالعنوان */}
      <input
        type="text"
        placeholder="بحث بالعنوان..."
        value={localSearch}
        onChange={handleSearch}
        className="border px-3 py-2 rounded w-64"
      />

      {/* حالة المسابقة */}
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

      {/* فلترة حسب المشهور (user_id) */}
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

export default function CompetitionsPage() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [contests, setContests] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    user_id: "",
    page: 1,
  });
  const [meta, setMeta] = useState({ current: 1, last: 1 });
  const [loadingContests, setLoadingContests] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      setLoadingContests(true);

      // فقط أرسل الحقول غير الفارغة
      const params = { page: filters.page, per_page: 15 };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.user_id) params.user_id = filters.user_id;

      api
        .get("/admin/contests", { params })
        .then((res) => {
          const data = res.data.data;
          setContests(data.data || []);
          setMeta({ current: data.current_page, last: data.last_page });
          setLoadingContests(false);
        })
        .catch(() => {
          toast.error("خطأ في جلب المسابقات");
          setLoadingContests(false);
        });
    }
  }, [loading, user, filters]);

  const handleDelete = async (contestId) => {
    try {
      await api.delete(`/admin/contests/${contestId}`);
      setContests((prev) => prev.filter((c) => c.id !== contestId));
      toast.success("تم حذف المسابقة بنجاح", { position: "top-center" });
    } catch {
      toast.error("حدث خطأ أثناء الحذف", { position: "top-center" });
    }
  };

  if (loading) return <p className="text-center mt-10">جاري التحميل...</p>;
  if (!user) return <p className="text-center mt-10">يرجى تسجيل الدخول</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        المسابقات الحالية
      </h1>

      <ContestsFilter setFilters={setFilters} />

      {loadingContests ? (
        <p className="text-center mt-10">جاري التحميل...</p>
      ) : contests.length === 0 ? (
        <p className="text-center mt-10 text-gray-500">
          لا توجد مسابقات مطابقة للفلاتر الحالية.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contests.map((contest) => (
              <CompetitionCard
                key={contest.id}
                contest={contest}
                onDetails={() => navigate(`/contests/${contest.id}/details`)}
                onResults={() => navigate(`/contests/${contest.id}/results`)}
                onDelete={() => handleDelete(contest.id)}
              />
            ))}
          </div>

          <Pagination
            current={meta.current}
            last={meta.last}
            onChange={(page) =>
              setFilters((prev) => ({ ...prev, page }))
            }
          />
        </>
      )}

    </div>
  );
}
