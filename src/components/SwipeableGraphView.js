"use client";

import React, { useState, useRef, useEffect } from "react";
import CodeEditorPseudocode from "./CodeEditorPseudocode";

const SwipeableGraphView = ({
  graphContent,
  pseudocode,
  pseudoCodeHighlight,
  isMobile,
}) => {
  const [showPseudocode, setShowPseudocode] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      return window.innerWidth <= 375;
    };

    if (!checkMobile()) {
      setShowPseudocode(false);
    }
  }, []);

  const handleTouchStart = (e) => {
    if (!isMobile) return;
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || !touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const swipeDistance = touchStart - touchEnd;

    if (swipeDistance > 50 && !showPseudocode) {
      setShowPseudocode(true);
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
        <div className="p-4 h-full overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Pseudocode</h2>
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
