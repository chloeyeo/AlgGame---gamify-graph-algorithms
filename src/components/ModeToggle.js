"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const ModeToggle = ({ onToggle, validPaths }) => {
  //   const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const [hasTriedLongPress, setHasTriedLongPress] = useState(false);
  const [hasTriedUncollapse, setHasTriedUncollapse] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Update breakpoint to include tablets
      setIsMobile(window.innerWidth <= 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const handleTouchStart = () => {
    if (isMobile) {
      setIsLongPress(false);
      const timer = setTimeout(() => {
        setIsLongPress(true);
        setIsCollapsed(!isCollapsed);
        if (!isCollapsed) {
          setHasTriedLongPress(true);
        } else {
          setHasTriedUncollapse(true);
        }
      }, 500);
      setLongPressTimer(timer);
    }
  };

  const handleTouchEnd = (e) => {
    if (isMobile) {
      e.preventDefault();
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
      // Only trigger mode toggle if it wasn't a long press
      if (!isLongPress) {
        onToggle();
      }
      setIsLongPress(false);
    }
  };

  const handleClick = (e) => {
    if (!isMobile) {
      onToggle();
    }
  };

  return (
    <div className="fixed top-24 right-4 z-40">
      {/* Hint for collapsing */}
      {isMobile && !hasTriedLongPress && !isCollapsed && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-xs bg-blue-100 px-2 py-1 rounded-full text-white animate-fade-pulse">
            Long press to collapse
          </span>
        </div>
      )}

      {/* Hint for uncollapsing */}
      {isMobile && isCollapsed && !hasTriedUncollapse && (
        <div className="absolute -top-6 right-0 whitespace-nowrap">
          <span className="text-xs bg-blue-100 px-2 py-1 rounded-full text-white animate-fade-pulse">
            Long press to expand
          </span>
        </div>
      )}

      <button
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={`bg-white shadow-lg rounded-lg flex items-center transition-all duration-300 ${
          isMobile && isCollapsed
            ? "w-[40px] h-[40px] p-2 justify-center"
            : "px-2 py-1 md:px-3 md:py-2 lg:px-4 lg:py-2 space-x-1 md:space-x-2"
        } ${targetPathExists ? "hover:bg-gray-50" : "hover:bg-red-50"} ${
          (!hasTriedLongPress && !isCollapsed) ||
          (isCollapsed && !hasTriedUncollapse)
            ? "ring-2 ring-blue-300 ring-opacity-50"
            : ""
        }`}
        title={!targetPathExists ? "This mode is not yet implemented" : ""}
      >
        {isMobile && isCollapsed ? (
          <svg
            className="w-4 h-4"
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
        ) : (
          <>
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">
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
          </>
        )}
      </button>
    </div>
  );
};

export default ModeToggle;
