"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Add your auth logic here
    // After successful auth:
    window.location.href = "/";
  };

  return (
    <div className="app-container">
      <Header />
      <Sidebar />
      <div className="main-content">
        <div className="auth-container">
          <h2>{isLogin ? "Login" : "Sign Up"}</h2>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" required />
            <input type="password" placeholder="Password" required />
            {!isLogin && (
              <input type="password" placeholder="Confirm Password" required />
            )}
            <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
          </form>
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              style={{ cursor: "pointer", color: "#007bff" }}
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
