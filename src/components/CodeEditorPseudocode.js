import React from "react";

const CodeEditorPseudocode = ({ pseudocode, highlightedLines = [] }) => {
  const lines = pseudocode.split("\n");

  return (
    <pre className="bg-black text-white p-4 rounded-lg overflow-x-auto">
      {lines.map((line, index) => (
        <div
          key={index}
          className={`font-mono transition-colors duration-200 w-full ${
            highlightedLines.includes(index + 1)
              ? "bg-yellow-500 bg-opacity-50"
              : ""
          } px-2 -mx-2`}
        >
          <span className="select-none text-gray-500 mr-4">{index + 1}</span>
          {line}
        </div>
      ))}
    </pre>
  );
};

export default CodeEditorPseudocode;
