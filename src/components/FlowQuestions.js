import React, { useState, useEffect } from "react";
import { isEdgeInPath } from "@/app/education/network-flow/ford-fulkerson/page";

export const FlowQuestions = ({
  graphState,
  onPathSelect,
  onFlowSelect,
  onEdgeFlowSelect,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const {
    gamePhase,
    pathOptions,
    flowOptions,
    edgeFlowOptions,
    feedback,
    currentPath,
    currentEdgeIndex,
    selectedPath,
    edges,
  } = graphState;

  useEffect(() => {
    if (feedback || graphState.gamePhase === "UPDATE_FLOWS") {
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }
  }, [feedback, graphState.gamePhase]);

  if (!gamePhase || !pathOptions) {
    return null;
  }

  const pathChoices = pathOptions.map((path) => ({
    text: path.join(" → "),
    value: path,
  }));

  const renderPathQuestion = () => {
    return (
      <>
        <h3 className="text-lg font-semibold mb-3">
          Which path should we choose for maximum flow?
        </h3>
        <div className="space-y-2">
          {pathChoices.map((choice, index) => (
            <button
              key={index}
              onClick={() => {
                onPathSelect(choice.value);
              }}
              className={`w-full p-3 text-left border rounded hover:bg-blue-50 transition-colors duration-200 ${
                selectedPath === choice.value ? "bg-green-50" : ""
              }`}
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
          {[...new Set(flowOptions)]
            .filter((flow) => flow !== Infinity)
            .map((flow, index) => (
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

  const renderEdgeFlowQuestion = () => {
    const currentEdge = `${selectedPath[currentEdgeIndex]} → ${
      selectedPath[currentEdgeIndex + 1]
    }`;

    return (
      <>
        <h3 className="text-lg font-semibold mb-3">
          What should be the new flow for edge {currentEdge}?
        </h3>
        <div className="space-y-2">
          {[...new Set(edgeFlowOptions)].map((flow, index) => (
            <button
              key={index}
              onClick={() => onEdgeFlowSelect(flow)}
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
    <div className="relative">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="absolute -top-10 right-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-t"
      >
        {isVisible ? "Hide Questions" : "Show Questions"}
      </button>

      {isVisible && (
        <div className="space-y-4 p-4 bg-white rounded-lg shadow-md">
          {gamePhase === "SELECT_PATH" && renderPathQuestion()}
          {gamePhase === "UPDATE_FLOWS" && renderFlowQuestion()}
          {gamePhase === "UPDATE_EDGE_FLOWS" && renderEdgeFlowQuestion()}
          {feedback && (
            <div
              className={`mt-4 p-3 rounded ${
                feedback?.type === "error"
                  ? "bg-red-50 text-red-800"
                  : "bg-green-50 text-green-800"
              }`}
            >
              {feedback?.text || feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
