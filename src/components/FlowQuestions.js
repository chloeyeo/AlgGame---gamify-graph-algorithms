import React from "react";

export const FlowQuestions = ({ graphState, onPathSelect, onFlowSelect }) => {
  console.log("FlowQuestions props:", {
    gamePhase: graphState.gamePhase,
    pathOptions: graphState.pathOptions,
    flowOptions: graphState.flowOptions,
  });

  const { gamePhase, pathOptions, flowOptions, feedback, currentPath } =
    graphState;

  if (!gamePhase || !pathOptions) {
    console.log("Missing required props:", { gamePhase, pathOptions });
    return null;
  }

  const renderPathQuestion = () => {
    const pathChoices = pathOptions.map((path) => ({
      text: path.join(" → "),
      value: path,
    }));

    console.log("pathChoices", pathChoices);
    console.log("currentPath", currentPath);
    console.log("Flow Questions being rendered");

    return (
      <>
        <h3 className="text-lg font-semibold mb-3">
          Which path should we choose for maximum flow?
        </h3>
        <div className="space-y-2">
          {pathChoices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onPathSelect(choice.value)}
              className="w-full p-3 text-left border rounded hover:bg-blue-50 transition-colors duration-200"
            >
              <span className="font-medium">Option {index + 1}:</span>{" "}
              {choice.text}
            </button>
          ))}
        </div>
      </>
    );
  };

  const renderFlowQuestion = () => {
    return (
      <>
        <h3 className="text-lg font-semibold mb-3">
          What is the maximum flow we can push through this path?
        </h3>
        <div className="space-y-2">
          {flowOptions.map((flow, index) => (
            <button
              key={index}
              onClick={() => onFlowSelect(flow)}
              className="w-full p-3 text-left border rounded hover:bg-blue-50 transition-colors duration-200"
            >
              <span className="font-medium">Flow value:</span> {flow} units
            </button>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md">
      {gamePhase === "SELECT_PATH" && renderPathQuestion()}
      {gamePhase === "UPDATE_FLOWS" && renderFlowQuestion()}
      {feedback && (
        <div
          className={`mt-4 p-3 rounded ${
            feedback.includes("Correct")
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
};
