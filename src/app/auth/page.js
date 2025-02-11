"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { BACKEND_URL } from "@/constants/constants";

const API_URL = BACKEND_URL;

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/myaccount");
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;

      if (isLogin) {
        // Login request
        response = await axios.post(
          `${API_URL}/api/auth/login`,
          { emailOrUsername: formData.email, password: formData.password },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
      } else {
        // Register request
        response = await axios.post(`${API_URL}/api/auth/register`, {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
      }

      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      document.cookie = `token=${token}; path=/; max-age=86400`;

      toast.success(
        isLogin ? "Login successful!" : "Account created successfully!"
      );
      handleLoginSuccess();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Authentication failed";
      toast.error(errorMessage);
    }
  };

  const handleLoginSuccess = () => {
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get("redirect") || "/myaccount";
    router.replace(redirectPath);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-blue-200 to-purple-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isLogin ? "Welcome Back!" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-800">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
