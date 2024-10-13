"use client";

import AnimatedTetrahedron from "@/components/AnimatedTetrahedron";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

const DraggableWord = ({ word }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isJiggling, setIsJiggling] = useState(false);
  const [jiggleDelay, setJiggleDelay] = useState(0);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handleDragStart = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    const clientX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes("mouse") ? e.clientY : e.touches[0].clientY;
    setStartPosition({ x: clientX, y: clientY });
  }, []);

  const handleDrag = useCallback(
    (e) => {
      if (isDragging) {
        const clientX = e.type.includes("mouse")
          ? e.clientX
          : e.touches[0].clientX;
        const clientY = e.type.includes("mouse")
          ? e.clientY
          : e.touches[0].clientY;
        setPosition({
          x: clientX - startPosition.x,
          y: clientY - startPosition.y,
        });
      }
    },
    [isDragging, startPosition]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    setJiggleDelay(Math.random() * 0.5);
    setIsJiggling(true);
    const timer = setTimeout(() => {
      setIsJiggling(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchmove", handleDrag);
      document.addEventListener("touchend", handleDragEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, handleDrag, handleDragEnd]);

  return (
    <span
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        display: "inline-block",
        cursor: "move",
        padding: "0.5rem 1rem",
        margin: "0.5rem",
        backgroundColor: isDragging
          ? "rgba(59, 130, 246, 0.3)"
          : "rgba(59, 130, 246, 0.1)",
        borderRadius: "0.5rem",
        transition: isDragging ? "none" : "transform 0.3s ease-out",
        boxShadow: isDragging ? "0 4px 10px rgba(0, 0, 0, 0.3)" : "none",
        animation: isJiggling ? `jiggle 0.5s ease ${jiggleDelay}s` : "none",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      {word}
      <style jsx>{`
        @keyframes jiggle {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-3px);
          }
          50% {
            transform: translateX(3px);
          }
          75% {
            transform: translateX(-2px);
          }
        }
      `}</style>
    </span>
  );
};

export default function Home() {
  const bottomRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const subtitleWords = [
    "Learn",
    "Graph",
    "Algorithms",
    "Through",
    "Interactive",
    "Visualizations",
  ];

  return (
    <main className="flex flex-col items-center justify-center px-8 py-4 md:py-0 text-center min-h-screen">
      <AnimatedTetrahedron />
      <div className="mt-8 space-y-8 max-w-2xl py-6 px-8 md:px-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          Welcome to <span className="text-blue-700">AlgGame!</span>
        </h1>
        <h2 className="text-lg md:text-xl font-bold text-gray-800">
          {subtitleWords.map((word, index) => (
            <DraggableWord key={`word-${index}`} word={word} />
          ))}
        </h2>
        <p className="text-md md:text-lg font-medium text-gray-800">
          Please click the sidebar{" "}
          <Menu className="inline-block w-7 h-7 text-blue-600 animate-bounce" />{" "}
          and follow the steps below:
        </p>
        <ol className="text-left text-md md:text-lg space-y-6 pl-6">
          <li className="animate-fade-in-1 flex items-start space-x-2">
            <span className="text-blue-600 font-bold">1.</span>
            <span>
              Choose <strong className="text-blue-600">education</strong> or{" "}
              <strong className="text-purple-600">game</strong> mode
            </span>
          </li>
          <li className="animate-fade-in-2 flex items-start space-x-2">
            <span className="text-blue-600 font-bold">2.</span>
            <span>
              Select an <strong className="text-purple-600">algorithm</strong>{" "}
              to get started!
            </span>
          </li>
        </ol>
      </div>
      <div ref={bottomRef} className="h-20" />
    </main>
  );
}
