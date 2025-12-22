import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-center p-4">
      <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">404</h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
        الصفحة غير موجودة
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        العودة للصفحة الرئيسية
      </Link>
    </div>
  );
}
