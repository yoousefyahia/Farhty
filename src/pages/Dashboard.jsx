import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../auth/AuthContext";
import ErrorBoundary from "../components/ErrorBoundary";

import ProfilePage from "./ProfilePage";
import EditProfilePage from "./EditProfilePage";
import CompetitionsPage from "./CompetitionsPage";

export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeMenu, setActiveMenu] = useState("profile");

  if (loading) return <div className="p-5 text-right">جاري التحقق من المستخدم...</div>;
  if (!user) return <div className="p-5 text-red-500 text-right">لا يوجد بيانات مستخدم</div>;

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const renderContent = () => {
    // المكونات تستخدم الـ context مباشرة للتأكد من التحديث التلقائي
    switch (activeMenu) {
      case "profile":
        return <ProfilePage />;
      case "editProfile":
        return <EditProfilePage />; 
      case "competitions":
        return <CompetitionsPage />;
      default:
        return <ProfilePage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-right">
      {sidebarVisible && <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />}
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-auto">
          <ErrorBoundary>{renderContent()}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
