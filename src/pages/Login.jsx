import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../api/axois";
import { AuthContext } from "../auth/AuthContext";
import "../styles/Login.css";
import React from "react";
// فالديشن بالعربي
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

      Cookies.set("token", token,);
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
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 style={{ textAlign: "right" }}>تسجيل دخول الادمن</h2>

        <label>رقم الهاتف</label>
        <input
          type="tel"
          placeholder="رقم الهاتف"
          {...register("phone")}
          autoComplete="tel"
          dir="rtl"
          style={{ textAlign: "right" }}
        />
        {errors.phone && <p className="error">{errors.phone.message}</p>}

        <label>كلمة المرور</label>
        <input
          type="password"
          placeholder="كلمة المرور"
          {...register("password")}
          autoComplete="current-password"
          dir="rtl"
          style={{ textAlign: "right" }}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        {serverError && <p className="error server-error">{serverError}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
      </form>
    </div>
  );
}
