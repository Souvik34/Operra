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
            "w-full px-4 py-3 pr-10 rounded-md border-2 outline-none shadow-sm",
            "bg-white text-gray-800 text-[15px] font-medium",
            isValid && "border-green-500 focus:ring-green-500 focus:border-green-500",
            hasError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500 scale-105"
              : "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-600",
            "transition duration-200 ease-in-out"
          )}
        />

        {/* Show password toggle */}
        {isPassword && (
          <div
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-800"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>
        )}

        {/* Error Icon */}
        {hasError && (
          <FiAlertCircle className="absolute right-9 top-3 text-red-500 pointer-events-none" />
        )}
        {/* Error Text */}
        {hasError && (
          <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Sign In to Your Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderInput("email", "email", "Email")}
          {renderInput("password", "password", "Password", true)}

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all font-semibold text-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
