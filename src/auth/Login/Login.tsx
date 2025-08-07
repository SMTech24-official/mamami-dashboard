import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { LuLoaderCircle } from "react-icons/lu";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { LoginFormInputs } from "../../interfaces/AllTypes";
const Login = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({ mode: "onChange" });

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      // Validate response
      if (!res.data?.data?.accessToken || !res.data.data.user) {
        throw new Error("Invalid server response");
      }

      // Store tokens and user data to localStorage
      localStorage.setItem("accessToken", res.data.data.accessToken);
      localStorage.setItem("refreshToken", res.data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));

      // Show success feedback
      toast.success(res.data.message || "Login successful!");

      // Redirect with state preservation
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      // Clear any partial auth data on failure
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || error.message || "Login failed";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ffffff] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl">
        <div className="text-center mb-6">
          {/* <h2 className="text-4xl font-bold text-black">Welcome back</h2> */}
          <img className="" src="./logo.png" alt="VYBLY_Logo" />
          <p className="text-md mt-3 text-gray-700">Admin Login Portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              placeholder="Enter your mail address"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-[#F16B7E] focus:border-[#F16B7E] transition-all duration-300"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-[#F16B7E] focus:border-[#F16B7E] transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <IoMdEyeOff size={18} className="hover:cursor-pointer" />
                ) : (
                  <IoMdEye size={18} className="hover:cursor-pointer" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isValid}
            className={`w-full h-10 bg-[#F16B7E] text-white font-semibold py-2 rounded-md transition duration-200 ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-[#e0526b] hover:cursor-pointer"
            }`}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <LuLoaderCircle className="text-black animate-spin" />
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
