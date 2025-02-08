"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header({ toggleSidebar }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleProfileClick = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      router.push("/myaccount");
    } else {
      router.push("/auth");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-blue-50 shadow-md p-2 sm:p-4 font-poppins flex justify-between items-center z-50 h-16 sm:h-20">
      <button onClick={toggleSidebar} className="text-2xl p-1">
        <Image
          src="/images/list.png"
          alt="sidebar toggle icon"
          width={30}
          height={25}
          className="sm:w-[40px] sm:h-[30px]"
        />
      </button>

      <nav className="flex items-center space-x-2 sm:space-x-4">
        <Link href="/" className="text-lg sm:text-2xl font-bold">
          AlgGame
        </Link>
        <Link href="/about" className="text-sm sm:text-lg hover:text-blue-600">
          About
        </Link>
        <Link
          href="/leaderboard"
          className="text-sm sm:text-lg hover:text-blue-600"
        >
          Leaderboard
        </Link>
      </nav>

      <div onClick={handleProfileClick} className="cursor-pointer">
        <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-200 rounded-full flex items-center justify-center">
          <Image
            src="/images/lion.png"
            alt="default user profile image"
            width={24}
            height={24}
            className="object-cover w-6 h-6 sm:w-8 sm:h-8 rounded-full"
          />
        </div>
      </div>
    </header>
  );
}
