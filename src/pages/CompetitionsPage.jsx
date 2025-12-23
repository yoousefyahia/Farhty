import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import api from "../api/axois";
import toast from "react-hot-toast";

import CompetitionCard from "../components/CompetitionCard";

export default function CompetitionsPage() {
  const { user, loading } = useContext(AuthContext);
  const [contests, setContests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      api
        .get("/admin/contests")
        .then((res) => setContests(res.data.data.data || []))
        .catch((err) => {
          console.error(err);
          toast.error("خطأ في جلب المسابقات");
        });
    }
  }, [loading, user]);

  const handleDelete = async (contestId) => {
    try {
      await api.delete(`/admin/contests/${contestId}`);
      setContests((prev) => prev.filter((c) => c.id !== contestId));
      toast.success("تم حذف المسابقة بنجاح", { position: "top-center" });
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الحذف", { position: "top-center" });
    }
  };

  if (loading) return <p className="text-center mt-10">جاري التحميل...</p>;
  if (!user) return <p className="text-center mt-10">يرجى تسجيل الدخول</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">المسابقات الحالية</h1>
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
    </div>
  );
}
