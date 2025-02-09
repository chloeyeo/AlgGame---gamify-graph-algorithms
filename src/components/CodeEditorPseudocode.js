import React, { useRef, useEffect } from "react";

const CodeEditorPseudocode = ({ pseudocode, highlightedLines = [] }) => {
  const lines = pseudocode.split("\n");
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      // Check if we're on mobile or tablet screen
      const isMobileOrTablet = window.innerWidth < 1024;

      const contentDiv = containerRef.current.querySelector(".content-wrapper");
      if (contentDiv) {
        const maxWidth = Array.from(contentDiv.children).reduce((max, line) => {
          const lineContent = line.querySelector(".line-content");
          return Math.max(max, lineContent?.scrollWidth || 0);
        }, 0);

        const paddedWidth = maxWidth + 10;

        // Only set constrained width for mobile and tablet screens
        if (isMobileOrTablet) {
          contentDiv.style.width = `${paddedWidth}px`;

          const highlights = contentDiv.querySelectorAll(
            ".highlight-container"
          );
          highlights.forEach((highlight) => {
            highlight.style.width = `${paddedWidth}px`;
          });
        } else {
          // For desktop, let it take full width
          contentDiv.style.width = "100%";

          const highlights = contentDiv.querySelectorAll(
            ".highlight-container"
          );
          highlights.forEach((highlight) => {
            highlight.style.width = "100%";
          });
        }
      }
    }
  }, [pseudocode, highlightedLines]);

  return (
    <div className="bg-black rounded-lg overflow-x-auto no-scrollbar">
      <pre
        ref={containerRef}
        className="text-white p-4 inline-block min-w-full"
      >
        <div className="content-wrapper relative">
          {lines.map((line, index) => (
            <div key={index} className="relative whitespace-nowrap">
              {highlightedLines.includes(index + 1) && (
                <div className="highlight-container absolute inset-y-0 left-0 bg-yellow-500 bg-opacity-50" />
              )}
              <div className="line-content relative font-mono whitespace-pre inline-block min-w-full px-2">
                <span className="select-none text-gray-500 mr-4">
                  {index + 1}
                </span>
                {line}
              </div>
            </div>
          ))}
        </div>
      </pre>
    </div>
  );
};

export default CodeEditorPseudocode;
