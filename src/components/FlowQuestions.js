import React from "react";

export const FlowQuestions = ({ graphState, onPathSelect, onFlowSelect }) => {
  const { gamePhase, pathOptions, flowOptions, feedback } = graphState;

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      {gamePhase === "SELECT_PATH" && (
        <>
          <h3 className="text-lg font-semibold">
            Select the valid augmenting path:
          </h3>
          <div className="space-y-2">
            {pathOptions.map((path, index) => (
              <button
                key={index}
                onClick={() => onPathSelect(path)}
                className="w-full p-2 text-left border rounded hover:bg-blue-50 transition"
              >
                {path.join(" → ")}
              </button>
            ))}
          </div>
        </>
      )}

      {gamePhase === "UPDATE_FLOWS" && (
        <>
          <h3 className="text-lg font-semibold">
            Select the correct flow update:
          </h3>
          <div className="space-y-2">
            {flowOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => onFlowSelect(option)}
                className="w-full p-2 text-left border rounded hover:bg-blue-50 transition"
              >
                {`Increase flow by ${option} units`}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
