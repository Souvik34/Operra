import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema } from "../../schemas/signinSchema";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import clsx from "clsx";

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
  } = useForm({
    resolver: zodResolver(signinSchema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    console.log("Login data:", data);
    // Submit to backend or call API
  };

  const renderInput = (name, type, placeholder, isPassword = false) => {
    const hasError = errors[name];
    const isTouched = touchedFields[name];
    const value = watch(name);
    const isValid = !hasError && isTouched && value?.length > 0;

    return (
      <div className="relative group">
        <input
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          {...register(name)}
          className={clsx(
            "w-full px-4 py-3 pr-10 rounded-md border outline-none shadow-sm",
            "bg-white/10 text-white placeholder:text-white/70 text-[15px] font-medium",
            "backdrop-blur-md",
            isValid && "border-green-400 focus:ring-green-500 focus:border-green-500",
            hasError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500 scale-[1.02]"
              : "border-white/30 focus:ring-2 focus:ring-blue-400 focus:border-blue-500",
            "transition duration-200 ease-in-out"
          )}
        />

        {isPassword && (
          <div
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 cursor-pointer text-white/70 hover:text-white"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>
        )}

        {hasError && (
          <FiAlertCircle className="absolute right-9 top-3 text-red-500 pointer-events-none" />
        )}
        {hasError && (
          <p className="text-sm text-red-400 mt-1">{errors[name].message}</p>
        )}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(145deg, #0f0c29, #302b63, #24243e, #3a1c71, #d76d77, #ffaf7b)",
        backgroundSize: "200% 200%",
        animation: "gradientMove 12s ease infinite",
      }}
    >
      <div className="w-full max-w-md bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white/80"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderInput("email", "email", "Email ID")}
          {renderInput("password", "password", "Password", true)}

          <div className="flex justify-between items-center text-white/80 text-sm mt-1">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="form-checkbox accent-blue-500 bg-transparent border-white/30"
              />
              <span>Remember me</span>
            </label>
            <a href="#" className="hover:underline text-sm">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 text-white rounded-md transition-all font-semibold text-lg shadow-lg"
          >
            LOGIN
          </button>
        </form>
      </div>

      {/* Gradient animation keyframes */}
      <style jsx="true">{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
