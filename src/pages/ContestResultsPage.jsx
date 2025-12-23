import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axois";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import toast from "react-hot-toast";

export default function ContestResultsPage() {
  const { id: contestId } = useParams(); 
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/admin/contests/${contestId}/results`)
      .then((res) => setResultsData(res.data.data))
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.message || "حدث خطأ أثناء جلب النتائج");
      })
      .finally(() => setLoading(false));
  }, [contestId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">جاري تحميل النتائج...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  if (!resultsData) return null;

  const { contest, platform, celebrity, stats, winners } = resultsData;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* عنوان المسابقة */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{contest.title}</h1>
        <p className="text-gray-700 dark:text-gray-300">{contest.description}</p>
      </div>

      {/* صورة المسابقة */}
      {contest.image && (
        <div className="overflow-hidden rounded-lg shadow mb-6">
          <img
            src={contest.image}
            alt={contest.title}
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* إحصائيات المسابقة */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-right">
        <h2 className="text-right text-xl font-semibold mb-4 border-b pb-2">إحصائيات المسابقة</h2>
        {stats ? (
          <>
            <ul className="grid grid-cols-2 gap-4 mb-6 text-gray-700 dark:text-gray-300 text-right">
              <li>المشاركون: {stats.total_participants}</li>
              <li>عدد المحاولات: {stats.total_attempts}</li>
              <li>أعلى نتيجة: {stats.highest_score}</li>
              <li>أدنى نتيجة: {stats.lowest_score}</li>
              <li>المعدل: {stats.average_score?.toFixed(2) || 0}</li>
              <li>النسبة المئوية: {stats.average_percentage?.toFixed(2) || 0}%</li>
            </ul>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart
                  data={[
                    { name: "المعدل", value: stats.average_score || 0 },
                    { name: "أعلى", value: stats.highest_score || 0 },
                    { name: "أدنى", value: stats.lowest_score || 0 },
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <p className="text-gray-500">لا توجد إحصائيات متاحة حالياً.</p>
        )}
      </div>

      {/* المنصة والمشهور */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-right">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">المنصة والمشهور</h2>
        <p>المنصة: <span className="font-semibold">{platform?.display_name || "غير محدد"}</span></p>
        <p>المشهور: <span className="font-semibold">{celebrity?.name || "غير محدد"}</span></p>
      </div>

      {/* الفائزون */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-right">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">الفائزون</h2>
        {winners?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
            {winners.map((winner) => (
              <div key={winner.user_id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm">
                {winner.image && (
                  <img
                    src={winner.image}
                    alt={winner.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold">{winner.name}</p>
                  <p>النتيجة: {winner.score}/{winner.total_questions} ({winner.percentage}%)</p>
                  <p className="text-sm text-gray-500">تم الانتهاء في: {winner.completed_at}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">لا يوجد فائزون بعد.</p>
        )}
      </div>
    </div>
  );
}
