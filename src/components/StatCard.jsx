import React from "react";
// import { IconType } from "react-icons";

export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center gap-4">
      {Icon && (
        <div className={`text-3xl ${color ? `text-${color}-500` : "text-blue-500"}`}>
          <Icon />
        </div>
      )}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
