import React from "react";

const CodeEditorPseudocode = ({ pseudocode, highlightedLines = [] }) => {
  const lines = pseudocode.split("\n");

  return (
    <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto relative">
      {lines.map((line, index) => (
        <div key={index} className="relative">
          {highlightedLines.includes(index + 1) && (
            <div className="absolute inset-y-0 -left-4 -right-4 bg-yellow-500 bg-opacity-50" />
          )}
          <div className="relative font-mono w-max min-w-full px-2">
            <span className="select-none text-gray-500 mr-4">{index + 1}</span>
            {line}
          </div>
        </div>
      ))}
    </pre>
  );
};

export default CodeEditorPseudocode;
