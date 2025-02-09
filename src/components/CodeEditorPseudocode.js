import React, { useRef, useEffect } from "react";

const CodeEditorPseudocode = ({ pseudocode, highlightedLines = [] }) => {
  const lines = pseudocode.split("\n");
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const contentDiv = containerRef.current.querySelector(".content-wrapper");
      if (contentDiv) {
        // Calculate max width from actual line content widths
        const maxWidth = Array.from(contentDiv.children).reduce((max, line) => {
          const lineContent = line.querySelector(".line-content");
          return Math.max(max, lineContent?.scrollWidth || 0);
        }, 0);

        // Add small padding to prevent text from touching the edge
        const paddedWidth = maxWidth + 10;

        // Set width explicitly on the pre element to constrain scrolling
        containerRef.current.style.width = `${paddedWidth}px`;
        contentDiv.style.width = `${paddedWidth}px`;

        // Set width for highlight containers
        const highlights = contentDiv.querySelectorAll(".highlight-container");
        highlights.forEach((highlight) => {
          highlight.style.width = `${paddedWidth}px`;
        });
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
