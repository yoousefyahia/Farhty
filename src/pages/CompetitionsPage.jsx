import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axois";
import toast from "react-hot-toast";
import CompetitionCard from "../components/contests/CompetitionCard";
import Pagination from "../components/Pagination";
import ContestsFilter from "../components/contests/ContestsFilter";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

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

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      setLoadingContests(true);

      const params = { page: filters.page, per_page: 15 };
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.user_id) params.user_id = filters.user_id;

      api
        .get("/admin/contests", { params })
        .then((res) => {
          const data = res.data.data;
          setContests(data.data || []);
          setMeta({
            current: data.current_page,
            last: data.last_page,
          });
        })
        .catch(() => toast.error("خطأ في جلب المسابقات"))
        .finally(() => setLoadingContests(false));
    }
  }, [loading, user, filters]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/admin/contests/${selectedContestId}`);
      setContests((prev) => prev.filter((c) => c.id !== selectedContestId));
      toast.success("تم حذف المسابقة بنجاح", { position: "top-center" });
    } catch {
      toast.error("حدث خطأ أثناء الحذف", { position: "top-center" });
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setSelectedContestId(null);
    }
  };

  if (loading) return <p className="text-center mt-10">جاري التحميل...</p>;
  if (!user) return <p className="text-center mt-10">يرجى تسجيل الدخول</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">المسابقات الحالية</h1>

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
                onDelete={() => {
                  setSelectedContestId(contest.id);
                  setShowDeleteModal(true);
                }}
              />
            ))}
          </div>

          <Pagination
            current={meta.current}
            last={meta.last}
            onChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </>
      )}

      <ConfirmDeleteModal
        open={showDeleteModal}
        loading={deleteLoading}
        onCancel={() => {
          setShowDeleteModal(false);
          setSelectedContestId(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
