import React from "react";

const AnimatedLion = () => {
  return (
    <div className="w-64 h-64 relative animate-bounce">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="45" fill="#F4A460" />
        <circle cx="35" cy="40" r="5" fill="#8B4513" />
        <circle cx="65" cy="40" r="5" fill="#8B4513" />
        <path
          d="M 40 60 Q 50 70 60 60"
          fill="none"
          stroke="#8B4513"
          strokeWidth="3"
        />
        <path
          d="M 20 20 Q 25 5 40 15"
          fill="none"
          stroke="#F4A460"
          strokeWidth="8"
        />
        <path
          d="M 80 20 Q 75 5 60 15"
          fill="none"
          stroke="#F4A460"
          strokeWidth="8"
        />
      </svg>
    </div>
  );
};

export default AnimatedLion;
