import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../schemas/signupSchema";
import { FiAlertCircle, FiUserPlus } from "react-icons/fi"; // ✅ Add icon
import clsx from "clsx";

export default function Signup() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [animateIcon, setAnimateIcon] = useState(false); // ✅ Animation state

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const onSubmit = (data) => {
    if (!isAdmin) delete data.adminInviteToken;
    console.log("Form data:", data);
  };

  const renderInput = (name, type, placeholder) => {
    const hasError = errors[name];
    const isTouched = touchedFields[name];
    const value = watch(name);
    const isValid = !hasError && isTouched && value?.length > 0;

    return (
      <div className="relative group">
        <input
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={clsx(
            "w-full px-4 py-3 pr-10 rounded-md border-2 outline-none",
            "bg-gray-50 text-gray-800 text-[15px] font-medium",
            isValid && "border-green-500 focus:ring-green-500 focus:border-green-500",
            hasError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500 scale-105"
              : "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-600",
            "transition duration-200 ease-in-out"
          )}
        />
        {hasError && (
          <FiAlertCircle className="absolute right-3 top-3 text-red-500 pointer-events-none" />
        )}
        {hasError && (
          <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8 border border-gray-200">
        {/* ✅ Header with icon */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
          <span>Create an Account</span>
          <FiUserPlus
            onClick={() => {
              setAnimateIcon(true);
              setTimeout(() => setAnimateIcon(false), 500); // Reset after animation
            }}
            className={clsx(
              "text-blue-600 cursor-pointer transition-transform",
              animateIcon && "animate-bounce"
            )}
            size={28}
          />
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {renderInput("username", "text", "Username")}
          {renderInput("email", "email", "Email")}
          {renderInput("password", "password", "Password")}
          {renderInput("confirmPassword", "password", "Confirm Password")}

          {/* Admin Toggle */}
          <div className="flex items-center justify-between mt-3">
            <label className="text-base font-medium text-gray-700">
              Registering as Admin?
            </label>
            <div
              onClick={() => setIsAdmin(!isAdmin)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                isAdmin ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isAdmin ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          {isAdmin && renderInput("adminInviteToken", "text", "Admin Invite Token")}

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all font-semibold text-lg"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
