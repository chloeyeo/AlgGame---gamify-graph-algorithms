import React, { useRef, useEffect } from "react";

const CodeEditorPseudocode = ({ pseudocode, highlightedLines = [] }) => {
  const lines = pseudocode.split("\n");
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const contentDiv = containerRef.current.querySelector(".content-wrapper");
      if (contentDiv) {
        const maxWidth = Array.from(contentDiv.children).reduce((max, line) => {
          const lineContent = line.querySelector(".line-content");
          return Math.max(max, lineContent?.scrollWidth || 0);
        }, 0);
        contentDiv.style.width = `${maxWidth}px`;

        // Set width for highlight containers
        const highlights = contentDiv.querySelectorAll(".highlight-container");
        highlights.forEach((highlight) => {
          highlight.style.width = `${maxWidth}px`;
        });
      }
    }
  }, [pseudocode, highlightedLines]);

  return (
    <pre
      ref={containerRef}
      className="bg-black text-white p-4 rounded-lg overflow-x-auto no-scrollbar"
    >
      <div className="content-wrapper relative min-w-fit">
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
  );
};

export default CodeEditorPseudocode;
