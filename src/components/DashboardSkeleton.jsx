import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="h-10 w-1/3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array(4)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="h-24 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"
            ></div>
          ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <tr key={index} className="border-b border-gray-200 dark:border-gray-600">
                  {Array(5)
                    .fill(0)
                    .map((__, idx) => (
                      <td key={idx} className="py-4 px-2">
                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
