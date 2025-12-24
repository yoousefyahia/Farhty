import React from "react";
import { FaYoutube, FaSnapchatGhost, FaTiktok, FaTrash } from "react-icons/fa";

const defaultContestImage = "https://via.placeholder.com/400x200?text=مسابقة";

function PlatformIcon({ platform }) {
  switch (platform?.name) {
    case "youtube":
      return <FaYoutube className="text-blue-600" size={20} />;
    case "snapchat":
      return <FaSnapchatGhost className="text-yellow-400" size={20} />;
    case "tiktok":
      return <FaTiktok className="text-black" size={20} />;
    default:
      return null;
  }
}

export default function CompetitionCard({ contest, onDetails, onResults, onDelete }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={contest.image || defaultContestImage}
        alt={contest.title}
        className="h-48 w-full object-cover"
      />
      <div className="p-4 text-right">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">{contest.title}</h2>
          <PlatformIcon platform={contest.platform} />
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm line-clamp-3 min-h-[3.75rem]">
          {contest.description}
        </p>
        <div className="flex justify-between mt-2 gap-2">
          <button
            onClick={onDetails}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded flex-1"
          >
            التفاصيل
          </button>
          <button
            onClick={onResults}
            className="bg-blue-500 hover:bg-green-600 text-white px-3 py-1 rounded flex-1"
          >
            النتائج
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex-1 flex items-center justify-center gap-1"
          >
            <FaTrash /> حذف
          </button>
        </div>
      </div>
    </div>
  );
}
