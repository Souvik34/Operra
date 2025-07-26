import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../schemas/signupSchema";
import { FiAlertCircle, FiEye, FiEyeOff } from "react-icons/fi";
import clsx from "clsx";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit = (data) => {
    // 🎯 Auto-assign a cool avatar here (DiceBear / random logic)
    const avatarURL = `https://api.dicebear.com/7.x/thumbs/svg?seed=${data.username}`;
    const finalData = { ...data, profileImage: avatarURL };

    console.log("Submitted:", finalData);
    // ⚙️ Call your signup API here
  };

  const password = watch("password");

  return (
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-md p-8 space-y-6 shadow-lg rounded-xl bg-black/90 text-white">
        <h2 className="text-3xl font-bold text-center text-blue-400">Join Operra</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Username */}
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              {...register("username")}
              className={clsx(
                "w-full px-4 py-3 rounded-md bg-white text-black border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all",
                errors.username && "border-red-500 scale-105"
              )}
            />
            {errors.username && (
              <>
                <FiAlertCircle className="text-red-500 absolute top-3.5 right-3 text-xl" />
                <p className="text-red-500 mt-1 text-sm">{errors.username.message}</p>
              </>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className={clsx(
                "w-full px-4 py-3 rounded-md bg-white text-black border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all",
                errors.email && "border-red-500 scale-105"
              )}
            />
            {errors.email && (
              <>
                <FiAlertCircle className="text-red-500 absolute top-3.5 right-3 text-xl" />
                <p className="text-red-500 mt-1 text-sm">{errors.email.message}</p>
              </>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              {...register("password")}
              className={clsx(
                "w-full px-4 py-3 rounded-md bg-white text-black border pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all",
                errors.password && "border-red-500 scale-105"
              )}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3.5 right-10 text-xl text-gray-600 cursor-pointer"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
            {errors.password && (
              <>
                <FiAlertCircle className="text-red-500 absolute top-3.5 right-3 text-xl" />
                <p className="text-red-500 mt-1 text-sm">{errors.password.message}</p>
              </>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              {...register("confirmPassword")}
              className={clsx(
                "w-full px-4 py-3 rounded-md bg-white text-black border pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all",
                errors.confirmPassword && "border-red-500 scale-105"
              )}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3.5 right-10 text-xl text-gray-600 cursor-pointer"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
            {errors.confirmPassword && (
              <>
                <FiAlertCircle className="text-red-500 absolute top-3.5 right-3 text-xl" />
                <p className="text-red-500 mt-1 text-sm">{errors.confirmPassword.message}</p>
              </>
            )}
          </div>

          {/* Admin Invite Token (optional) */}
          <div className="relative">
            <input
              type="text"
              placeholder="Admin Invite Token (optional)"
              {...register("adminInviteToken")}
              className="w-full px-4 py-3 rounded-md bg-white text-black border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-md bg-blue-500 hover:bg-blue-600 transition-all duration-300 font-semibold text-white shadow-md"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
