"use client";

import React, { useState, useRef, useEffect } from "react";
import CodeEditorPseudocode from "./CodeEditorPseudocode";

const SwipeableGraphView = ({
  graphContent,
  pseudocode,
  pseudoCodeHighlight,
  isMobile,
  playControls,
}) => {
  const [showPseudocode, setShowPseudocode] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchStartTime, setTouchStartTime] = useState(null);
  const [hasSwipedRight, setHasSwipedRight] = useState(false);
  const [hasSwipedLeft, setHasSwipedLeft] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      return window.innerWidth < 1024;
    };

    if (!checkScreenSize()) {
      setShowPseudocode(false);
    }
  }, []);

  const handleTouchStart = (e) => {
    if (window.innerWidth >= 1024) return;
    setTouchStart(e.touches[0].clientX);
    setTouchStartTime(Date.now());
  };

  const handleTouchEnd = (e) => {
    if (window.innerWidth >= 1024 || !touchStart || !touchStartTime) return;

    const touchEnd = e.changedTouches[0].clientX;
    const swipeDistance = touchStart - touchEnd;
    const swipeTime = Date.now() - touchStartTime;
    const swipeSpeed = Math.abs(swipeDistance) / swipeTime;

    // Fast swipe indicates intent to change views
    // Slow swipe indicates intent to scroll pseudocode
    const isFastSwipe = swipeSpeed > 0.5; // Threshold in pixels per millisecond

    if (Math.abs(swipeDistance) > 50 && isFastSwipe) {
      const isSwipingLeft = swipeDistance > 0;
      setShowPseudocode(isSwipingLeft);

      if (isSwipingLeft) {
        setHasSwipedRight(true);
      } else {
        setHasSwipedLeft(true);
      }
    }

    setTouchStart(null);
    setTouchStartTime(null);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full overflow-hidden"
    >
      {isMobile && !showPseudocode && !hasSwipedRight && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-2">
            <svg
              className="w-12 h-8 text-blue-500 opacity-70 rotate-180"
              fill="none"
              viewBox="0 0 24 12"
              stroke="currentColor"
            >
              <path
                d="M1 6h18M15 1l5 5-5 5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-blue-500 text-lg font-semibold opacity-70">
              swipe
            </span>
          </div>
        </div>
      )}

      {isMobile && showPseudocode && !hasSwipedLeft && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <div className="animate-pulse flex items-center gap-2">
            <span className="text-blue-500 text-lg font-semibold opacity-70">
              swipe
            </span>
            <svg
              className="w-12 h-8 text-blue-500 opacity-70"
              fill="none"
              viewBox="0 0 24 12"
              stroke="currentColor"
            >
              <path
                d="M1 6h18M15 1l5 5-5 5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      <div
        className={`absolute w-full h-full transition-transform duration-300 ${
          showPseudocode ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        {graphContent}
      </div>

      <div
        className={`absolute w-full h-full transition-transform duration-300 ${
          showPseudocode ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 h-full overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Pseudocode</h2>
            {window.innerWidth < 1024 && playControls}
          </div>
          <CodeEditorPseudocode
            pseudocode={pseudocode}
            highlightedLines={pseudoCodeHighlight}
          />
        </div>
      </div>
    </div>
  );
};

export default SwipeableGraphView;
