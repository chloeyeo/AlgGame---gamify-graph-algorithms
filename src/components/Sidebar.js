import React from "react";

const Sidebar = ({
  isOpen,
  onClose,
  onModeSelect,
  onAlgorithmSelect,
  selectedMode,
  selectedAlgorithm,
}) => {
  const modes = ["Education", "Game"];
  const algorithms = [
    "Traversal",
    "Shortest Path",
    "Minimum Spanning Tree",
    "Network Flow",
    "Matching",
  ];

  return (
    <div
      className={`absolute top-[10%] inset-y-0 left-0 w-64 bg-white transition-transform duration-300 ease-in-out z-30 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h2 className="text-xl font-semibold mb-4">Settings</h2>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Mode:</h3>
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => onModeSelect(mode)}
              className={`block w-full text-left px-4 py-2 rounded ${
                selectedMode === mode
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-medium mb-2">Algorithm:</h3>
          {algorithms.map((algorithm) => (
            <button
              key={algorithm}
              onClick={() => onAlgorithmSelect(algorithm)}
              className={`block w-full text-left px-4 py-2 rounded ${
                selectedAlgorithm === algorithm
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {algorithm}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
