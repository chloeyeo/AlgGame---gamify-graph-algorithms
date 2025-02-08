"use client";

import React from "react";
import { usePathname } from "next/navigation";

const ModeToggle = ({ onToggle, validPaths }) => {
  //   const router = useRouter();
  const pathname = usePathname();

  const isEducationMode = pathname.startsWith("/education");
  const isGameMode = pathname.startsWith("/game");

  //   const handleModeToggle = () => {
  //     const currentPath = pathname.split("/").slice(2).join("/");
  //     const newMode = isEducationMode ? "game" : "education";
  //     router.push(`/${newMode}/${currentPath}`);
  //   };

  // Calculate the target path before rendering
  const getTargetPath = () => {
    if (isEducationMode) {
      return pathname.replace("/education/", "/game/");
    } else if (isGameMode) {
      return pathname.replace("/game/", "/education/");
    }
    return null;
  };

  const targetPath = getTargetPath();
  const targetPathExists = targetPath && validPaths.includes(targetPath);

  if (!isEducationMode && !isGameMode) return null;

  const handleClick = (e) => {
    e.preventDefault(); // Prevent default navigation
    onToggle();
  };

  return (
    <div className="fixed top-24 right-4 z-40">
      <button
        onClick={handleClick}
        className={`bg-white shadow-lg rounded-lg px-2 py-1 sm:px-4 sm:py-2 flex items-center space-x-1 sm:space-x-2 transition-colors ${
          targetPathExists ? "hover:bg-gray-50" : "hover:bg-red-50"
        }`}
        title={!targetPathExists ? "This mode is not yet implemented" : ""}
      >
        <span className="text-xs sm:text-sm font-medium">
          Switch to {isEducationMode ? "Game" : "Education"} Mode
        </span>
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      </button>
    </div>
  );
};

export default ModeToggle;
