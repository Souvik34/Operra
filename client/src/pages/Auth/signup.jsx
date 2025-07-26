/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../schemas/signupSchema";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import { BsCheckCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

export default function Signup() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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
    console.log("Form Data:", data);
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/signin");
    }, 2000);
  };

  const renderInput = (name, type, placeholder, isPassword = false) => {
    const hasError = errors[name];
    const isTouched = touchedFields[name];
    const value = watch(name);
    const isValid = !hasError && isTouched && value?.length > 0;

    const isPw = name === "password";
    const isConfirmPw = name === "confirmPassword";
    const toggleIcon = isPw
      ? () => setShowPassword(!showPassword)
      : () => setShowConfirmPassword(!showConfirmPassword);

    return (
      <div className="relative group">
        <input
          type={
            isPassword
              ? (name === "password" && showPassword) ||
                (name === "confirmPassword" && showConfirmPassword)
                ? "text"
                : "password"
              : type
          }
          placeholder={placeholder}
          {...register(name)}
          className={clsx(
            "w-full px-4 py-3 pr-10 rounded-md border-2 outline-none shadow-sm",
            "bg-white text-gray-800 text-sm sm:text-base",
            "font-medium transition duration-200 ease-in-out",
            isValid && "border-green-500 focus:ring-green-500 focus:border-green-500",
            hasError
              ? "border-red-500 focus:ring-red-500 focus:border-red-500 scale-[1.03]"
              : "border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-600"
          )}
        />
        {isPassword && (
          <div
            onClick={toggleIcon}
            className="absolute right-9 top-3 cursor-pointer text-gray-500 hover:text-gray-800"
          >
            {(name === "password" && showPassword) ||
            (name === "confirmPassword" && showConfirmPassword) ? (
              <FiEyeOff />
            ) : (
              <FiEye />
            )}
          </div>
        )}
        {hasError && (
          <FiAlertCircle className="absolute right-3 top-3 text-red-500 pointer-events-none" />
        )}
        {hasError && (
          <p className="text-xs sm:text-sm text-red-500 mt-1">
            {errors[name].message}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-3 sm:px-6 md:px-8">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 sm:p-8 border border-gray-200">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {renderInput("username", "text", "Username")}
          {renderInput("email", "email", "Email")}
          {renderInput("password", "password", "Password", true)}
          {renderInput("confirmPassword", "password", "Confirm Password", true)}

          {/* Admin Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-sm sm:text-base font-medium text-gray-700">
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

          {isAdmin &&
            renderInput("adminInviteToken", "text", "Admin Invite Token")}

          <button
            type="submit"
            className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all font-semibold text-sm sm:text-base"
          >
            Sign Up
          </button>
        </form>
      </div>

      {/* Tick Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center transition-opacity duration-500">
          <div className="flex flex-col items-center animate-ping-once">
            <BsCheckCircle className="text-green-500 text-6xl sm:text-7xl" />
            <p className="text-lg sm:text-xl font-medium text-gray-700 mt-4">
              Signup Successful
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
