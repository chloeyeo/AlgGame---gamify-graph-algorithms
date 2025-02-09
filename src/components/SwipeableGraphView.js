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
  const [hasShownPseudocode, setHasShownPseudocode] = useState(false);
  const [showReturnIndicator, setShowReturnIndicator] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      return window.innerWidth < 1024;
    };

    if (!checkMobile()) {
      setShowPseudocode(false);
    }
  }, []);

  const handleTouchStart = (e) => {
    if (!isMobile) return;

    // Check if the touch started within the pseudocode pre element
    const target = e.target;
    const preElement = target.closest("pre");

    if (preElement) {
      // Only prevent swipe if horizontal scrolling is needed
      const needsHorizontalScroll =
        preElement.scrollWidth > preElement.clientWidth;
      if (needsHorizontalScroll) return;
    }

    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || !touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const swipeDistance = touchStart - touchEnd;

    if (swipeDistance > 50 && !showPseudocode) {
      setShowPseudocode(true);
      if (!hasShownPseudocode) {
        setHasShownPseudocode(true);
        setShowReturnIndicator(true);
        setTimeout(() => setShowReturnIndicator(false), 3000);
      }
    } else if (swipeDistance < -50 && showPseudocode) {
      setShowPseudocode(false);
    }

    setTouchStart(null);
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-full overflow-hidden"
    >
      {isMobile && !showPseudocode && !hasShownPseudocode && (
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

      {isMobile && showPseudocode && showReturnIndicator && (
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
            {isMobile && playControls}
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
