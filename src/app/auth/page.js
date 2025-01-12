"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Form data:", formData);

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error("Passwords don't match");
      }

      const endpoint = isLogin ? "/login" : "/register";
      console.log(
        "Making request to:",
        `http://localhost:5000/api/auth${endpoint}`
      );

      const response = await fetch(
        `http://localhost:5000/api/auth${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            isLogin
              ? {
                  email: formData.email,
                  password: formData.password,
                }
              : {
                  username: formData.username,
                  email: formData.email,
                  password: formData.password,
                }
          ),
        }
      );

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isLogin ? "Welcome Back!" : "Create Account"}
        </h2>

        {error && (
          <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

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
              placeholder="Enter your email"
              required
              value={formData.email}
              onChange={handleChange}
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
            <p className="mt-1 text-sm text-gray-800">
              Password must be at least 6 characters long
            </p>
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-800 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required={!isLogin}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-800">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </span>
          </p>
        </div>

        {isLogin && (
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              Forgot your password?
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
