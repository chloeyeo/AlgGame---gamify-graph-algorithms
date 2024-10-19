import React from "react";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation

export default function Header({ toggleSidebar }) {
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
      <Link href="/" className="text-xl md:text-2xl font-bold text-center">
        AlgGame
      </Link>
      <div className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center">
        <Image
          src="/images/lion.png"
          alt="default user profile image"
          width={30}
          height={30}
          className="object-cover w-full h-full rounded-full"
        />
      </div>
    </header>
  );
}
