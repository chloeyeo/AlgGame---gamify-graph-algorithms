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
    <header className="fixed top-0 left-0 w-full bg-blue-50 shadow-md p-4 font-poppins flex justify-between items-center z-50">
      <button onClick={toggleSidebar} className="text-2xl">
        <Image
          src="/images/list.png"
          alt="sidebar toggle icon"
          width={40}
          height={30}
        />
      </button>
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl md:text-2xl font-bold">
          AlgGame
        </Link>
        <Link href="/about" className="text-md md:text-lg hover:text-blue-600">
          About
        </Link>
        <Link
          href="/leaderboard"
          className="text-md md:text-lg hover:text-blue-600"
        >
          Leaderboard
        </Link>
      </div>
      <div onClick={handleProfileClick} className="cursor-pointer">
        <div className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center">
          <Image
            src="/images/lion.png"
            alt="default user profile image"
            width={30}
            height={30}
            className="object-cover w-full h-full rounded-full"
          />
        </div>
      </div>
    </header>
  );
}
