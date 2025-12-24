import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../auth/AuthContext";
import ErrorBoundary from "../components/ErrorBoundary";
import AllUser from "./AllUser";
import ProfilePage from "./ProfilePage";
import EditProfilePage from "./EditProfilePage";
import CompetitionsPage from "./CompetitionsPage";
import PrivacyPolicyAdmin from "./PrivacyPolicyAdmin";
import ContactsAdmin from "./ContactsAdmin";
import StatisticsPage from "./StatisticsPage";
import AdminsPage from "./AdminsPage"
export default function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeMenu, setActiveMenu] = useState("StatisticsPage");

if (loading)
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <svg
          className="animate-spin h-10 w-10 text-blue-600 mb-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z"
          ></path>
        </svg>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">جاري التحميل...</p>
      </div>
    </div>
  );
  if (!user) return <div className="p-5 text-red-500 text-right">لا يوجد بيانات مستخدم</div>;

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const renderContent = () => {
    switch (activeMenu) {
      case "profile":
        return <ProfilePage />;
      case "editProfile":
        return <EditProfilePage />; 
        case"AdminsPage": return<AdminsPage/>
      case "competitions":
        return <CompetitionsPage />;
      case "AllUser":
        return <AllUser />;  
      case "privacyPolicy":
        return <PrivacyPolicyAdmin/>;
          case "ContactsAdmin":
        return <ContactsAdmin />;  
        case "StatisticsPage":
          return <StatisticsPage/>
      default:
        return <StatisticsPage />;
    }
  };

  return (
    <div className="flex  h-screen bg-gray-100 dark:bg-gray-900 text-right">
      {sidebarVisible && <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />}
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  );
}

