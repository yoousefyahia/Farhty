import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/axois";
import { AuthContext } from "../auth/AuthContext";
import "../styles/login.css";
import React from "react";

const schema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^\d{10,15}$/, "رقم الهاتف يجب أن يكون بين 10 و15 رقم")
    .required("رقم الهاتف مطلوب"),
  password: yup
    .string()
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
    .required("كلمة المرور مطلوبة"),
});

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await api.post("/admin/login", data);
      const { token, user } = res.data.data;

      Cookies.set("token", token);
      setUser(user);
      navigate("/");
    } catch (err) {
      if (err.response?.status === 401) {
        setServerError("رقم الهاتف أو كلمة المرور غير صحيحة");
      } else {
        setServerError("فشل تسجيل الدخول، حاول مرة أخرى");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold mb-6  text-gray-800 dark:text-gray-100 text-center">
          تسجيل دخول الادمن
        </h2>

        <label className="block mb-1 text-gray-700 dark:text-gray-200">رقم الهاتف</label>
        <input
          placeholder="رقم الهاتف"
          {...register("phone")}
          autoComplete="tel"
          className="w-full p-3 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.phone && <p className="text-red-500 mb-3 text-sm">{errors.phone.message}</p>}

        <label className="block mb-1 text-gray-700 dark:text-gray-200">كلمة المرور</label>
        <input
          type="password"
          placeholder="كلمة المرور"
          {...register("password")}
          autoComplete="current-password"
          className="w-full p-3 mb-2 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && <p className="text-red-500 mb-3 text-sm">{errors.password.message}</p>}

        {serverError && <p className="text-red-500 mb-3 text-sm">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
      </form>
    </div>
  );
}
