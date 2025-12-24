import React, { useEffect, useState } from "react";
import api from "../api/axois";
import StatCard from "../components/StatCard";
// import DashboardSkeleton from "../components/DashboardSkeleton";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import {
  FaUsers,
  FaUserFriends,
  FaStar,
  FaUserShield,
  FaCheckCircle,
  FaUserPlus,
  FaHeart,
  FaEnvelope,
  FaBell,
  FaComments,
  FaImage,
  FaVideo,
  FaTrophy,
  FaClock,
} from "react-icons/fa";

export default function StatisticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/statistics")
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

if (loading)
  return("جاري التحميل")
  if (!data) return <p className="p-6 text-red-500">فشل تحميل الإحصائيات</p>;

  const genderData = [
    { name: "ذكور", value: data.users.gender_distribution.male },
    { name: "إناث", value: data.users.gender_distribution.female },
    { name: "أخرى", value: data.users.gender_distribution.other },
  ];

  const engagementChart = [
    { name: "إعجابات", value: data.engagement.total_likes },
    { name: "رسائل", value: data.engagement.total_messages },
    { name: "متابعات", value: data.engagement.total_follows },
    { name: "إشعارات", value: data.engagement.total_notifications },
  ];

  return (
    <div className="space-y-10">

      {/* ===== Users ===== */}
      <section>
        <h2 className="text-xl font-bold mb-4">المستخدمين</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="إجمالي المستخدمين" value={data.users.total} icon={FaUsers} />
          <StatCard title="متابعين" value={data.users.followers} icon={FaUserFriends} color="green" />
          <StatCard title="مشاهير" value={data.users.celebrities} icon={FaStar} color="purple" />
          <StatCard title="أدمن" value={data.users.admins} icon={FaUserShield} color="red" />
          <StatCard title="موثّقين" value={data.users.verified} icon={FaCheckCircle} color="blue" />
          <StatCard title="جدد اليوم" value={data.users.new_today} icon={FaUserPlus} color="yellow" />
          <StatCard title="هذا الأسبوع" value={data.users.new_this_week} icon={FaClock} />
          <StatCard title="هذا الشهر" value={data.users.new_this_month} icon={FaClock} />
        </div>
      </section>

      {/* ===== Gender ===== */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-3">توزيع النوع</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={80} label>
              <Cell fill="#3b82f6" />
              <Cell fill="#ec4899" />
              <Cell fill="#a855f7" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </section>

      {/* ===== Content ===== */}
      <section>
        <h2 className="text-xl font-bold mb-4">المحتوى</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="المنشورات" value={data.content.total_posts} icon={FaImage} />
          <StatCard title="القصص" value={data.content.total_stories} icon={FaVideo} />
          <StatCard title="قصص نشطة" value={data.content.active_stories} color="green" icon={FaClock} />
          <StatCard title="منشورات اليوم" value={data.content.posts_today} icon={FaClock} />
          <StatCard title="قصص اليوم" value={data.content.stories_today} icon={FaClock} />
        </div>
      </section>

      {/* ===== Engagement ===== */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-3">التفاعل</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="إعجابات" value={data.engagement.total_likes} icon={FaHeart} color="red" />
          <StatCard title="رسائل" value={data.engagement.total_messages} icon={FaEnvelope} />
          <StatCard title="محادثات" value={data.engagement.total_conversations} icon={FaComments} />
          <StatCard title="إشعارات" value={data.engagement.total_notifications} icon={FaBell} color="yellow" />
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={engagementChart}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* ===== Contests ===== */}
      <section>
        <h2 className="text-xl font-bold mb-4">المسابقات</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="إجمالي المسابقات" value={data.contests.total_contests} icon={FaTrophy} />
          <StatCard title="نشطة" value={data.contests.active_contests} color="green" icon={FaClock} />
          <StatCard title="المحاولات" value={data.contests.total_attempts} icon={FaClock} />
          <StatCard title="محاولات اليوم" value={data.contests.attempts_today} color="yellow" icon={FaClock} />
          <StatCard title="مسابقات اليوم" value={data.contests.contests_today} icon={FaClock} />
        </div>
      </section>

    </div>
  );
}
