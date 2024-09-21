import React from "react";
import Image from "next/image";

export default function Header({ toggleSidebar }) {
  return (
    <header className="flex-shrink-0 p-4 font-poppins flex justify-between items-center">
      {/* sidebar toggle icon in LHS of header */}
      <button onClick={toggleSidebar} className="text-2xl">
        <Image
          src="/images/list.png"
          alt="sidebar toggle icon"
          width={40}
          height={30}
        />
      </button>
      <h1 className="text-2xl font-bold text-center">Graph Algorithm Game</h1>
      {/* user icon in RHS of header */}
      <div className="w-10 h-10 border-2 border-gray-200 rounded-full flex items-center justify-center">
        <Image
          src="/images/person.png"
          alt="default user profile image"
          width={30}
          height={30}
          className="object-cover w-full h-full rounded-full"
        />
      </div>
    </header>
  );
}
