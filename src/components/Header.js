"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header({ toggleSidebar }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const handleProfileClick = () => {
    if (user) {
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
      </div>
      <div
        onClick={handleProfileClick}
        className="cursor-pointer relative w-10 h-10 border-2 border-gray-200 rounded-full overflow-hidden hover:border-blue-500 transition-colors duration-200"
      >
        <Image
          src="/images/lion.png"
          alt={user ? "user profile image" : "login"}
          width={30}
          height={30}
          className="object-cover w-full h-full rounded-full"
        />
        {user && (
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-green-400 ring-1 ring-white" />
        )}
      </div>
    </header>
  );
}
