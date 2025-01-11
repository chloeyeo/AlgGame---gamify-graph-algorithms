import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Header({ toggleSidebar }) {
  const { user } = useSelector((state) => state.auth);
  const router = useRouter();

  const handleAuthClick = () => {
    if (user) {
      router.push("/leaderboard");
    } else {
      router.push("/login");
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
      <button
        onClick={handleAuthClick}
        className="relative w-10 h-10 border-2 border-gray-200 rounded-full overflow-hidden hover:border-blue-500 transition-colors duration-200"
      >
        <Image
          src={user ? "/images/lion.png" : "/images/default-avatar.png"}
          alt={user ? "user profile image" : "login"}
          width={30}
          height={30}
          className="object-cover w-full h-full rounded-full"
        />
        {user && (
          <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
        )}
      </button>
    </header>
  );
}
