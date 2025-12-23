import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axois";
import toast from "react-hot-toast";
import { FaInfoCircle, FaClipboardList, FaGift } from "react-icons/fa";

export default function ContestDetailsPage() {
  const { id } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/admin/contests/${id}`)
      .then((res) => setContest(res.data.data))
      .catch(() => toast.error("حدث خطأ أثناء جلب البيانات"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-semibold">جاري التحميل...</div>
      </div>
    );

  if (!contest)
    return (
      <div className="text-center mt-10 text-red-500">
        المسابقة غير موجودة
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 ">
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

      {/* تفاصيل المسابقة */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-right">
        <h2 className="flex flex-row-reverse items-center gap-2 text-xl font-semibold mb-4 border-b pb-2">
          <FaInfoCircle /> تفاصيل المسابقة
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <li>تاريخ البداية: <span className="font-semibold">{contest.start_date}</span></li>
          <li>تاريخ النهاية: <span className="font-semibold">{contest.end_date}</span></li>
          <li>عدد الأسئلة: <span className="font-semibold">{contest.questions_count}</span></li>
          <li>عدد الجوائز: <span className="font-semibold">{contest.prizes_count}</span></li>
          <li>المنصة: <span className="font-semibold">{contest.platform?.display_name || "غير محدد"}</span></li>
          <li>المشهور: <span className="font-semibold">{contest.celebrity?.name || "غير موجود"}</span></li>
        </ul>
      </div>

      {/* الشروط */}
      {contest.terms?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-right">
          <h2 className="flex flex-row-reverse items-center gap-2 text-xl font-semibold mb-4 border-b pb-2">
            <FaClipboardList /> الشروط
          </h2>
          <ul className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-1">
            {contest.terms.map((term) => (
              <li key={term.id}>{term.term}</li>
            ))}
          </ul>
        </div>
      )}

      {/* الجوائز */}
<div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-right">
  <h2 className="flex flex-row-reverse items-center gap-2 text-xl font-semibold mb-4 border-b pb-2">
    <FaGift /> الجوائز
  </h2>

  {contest.prizes?.length > 0 ? (
    <ul className="list-none p-0 m-0 text-gray-700 dark:text-gray-300 space-y-1">
      {contest.prizes.map((prize) => (
        <li key={prize.id}>{prize.name}</li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-700 dark:text-gray-300">
      لا يوجد جوائز
    </p>
  )}
</div>

    </div>
  );
}
