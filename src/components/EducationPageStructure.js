import React, { useState, useEffect, useRef } from "react";
import GraphVisualisation from "./GraphVisualisation";
import CodeEditorPseudocode from "./CodeEditorPseudocode";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

const ExplanationSection = ({ explanation }) => {
  const formatExplanation = (text) => {
    if (text.includes("•")) {
      const [mainText, ...bullets] = text.split("•").map((t) => t.trim());
      return (
        <div className="space-y-2">
          {mainText && <p>{mainText}</p>}
          {bullets.length > 0 && (
            <ul className="list-disc pl-6 space-y-1">
              {bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    if (/^\d+\./.test(text)) {
      const parts = text.split(/(?=\d+\.)/).map((t) => t.trim());
      if (parts.length > 1) {
        return (
          <ol className="list-decimal pl-6 space-y-1">
            {parts.map((part, index) => (
              <li key={index}>{part.replace(/^\d+\./, "").trim()}</li>
            ))}
          </ol>
        );
      }
    }

    return <p>{text}</p>;
  };

  return (
    <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4">
      {formatExplanation(explanation)}
    </div>
  );
};

const generateRandomGraph = (nodeCount) => {
  // Generate nodes with randomized positions in a circular layout
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    // Random angle with some jitter
    const baseAngle = (2 * Math.PI * i) / nodeCount;
    const angleJitter = Math.random() * 0.5 - 0.25; // ±0.25 radians of jitter
    const angle = baseAngle + angleJitter;

    // Random radius with bounds
    const minRadius = 100;
    const maxRadius = 200;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);

    return {
      id: String.fromCharCode(65 + i),
      visited: false,
      x: 300 + radius * Math.cos(angle),
      y: 300 + radius * Math.sin(angle),
    };
  });

  const edges = [];
  // Ensure graph is connected
  for (let i = 1; i < nodes.length; i++) {
    const parent = Math.floor(Math.random() * i);
    edges.push({
      source: nodes[parent].id,
      target: nodes[i].id,
    });
  }

  // Add random extra edges
  const maxExtraEdges = Math.min(nodeCount - 1, 3);
  for (let i = 0; i < maxExtraEdges; i++) {
    const source = Math.floor(Math.random() * nodes.length);
    const target = Math.floor(Math.random() * nodes.length);

    if (
      source !== target &&
      !edges.some(
        (e) =>
          (e.source === nodes[source].id && e.target === nodes[target].id) ||
          (e.source === nodes[target].id && e.target === nodes[source].id)
      )
    ) {
      edges.push({
        source: nodes[source].id,
        target: nodes[target].id,
      });
    }
  }

  return { nodes, edges };
};

const generateDFSSteps = (initialNodes, edges) => {
  const steps = [];
  const visited = new Set();
  const backtracked = new Set();
  const stack = [initialNodes[0].id];

  // Initial state
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        visited: false,
        backtracked: false,
        current: node.id === initialNodes[0].id,
      })),
      edges,
      currentNode: initialNodes[0].id,
      stack: [...stack],
    },
    explanation: "Initial state: Starting DFS with node A.",
    pseudoCodeLines: [2],
  });

  while (stack.length > 0) {
    const currentNode = stack[stack.length - 1];

    if (!visited.has(currentNode)) {
      visited.add(currentNode);
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
            backtracked: backtracked.has(node.id),
            current: node.id === currentNode,
          })),
          edges,
          currentNode,
          stack: [...stack],
        },
        explanation: `Visit node ${currentNode} and mark it as visited.`,
        pseudoCodeLines: [8],
      });
    }

    // Get ALL neighbors and find first unvisited one (done in background)
    const allNeighbors = edges
      .filter(
        (edge) => edge.source === currentNode || edge.target === currentNode
      )
      .map((edge) => (edge.source === currentNode ? edge.target : edge.source))
      .sort();

    const unvisitedNeighbor = allNeighbors.find(
      (neighbor) => !visited.has(neighbor)
    );

    if (unvisitedNeighbor) {
      // Only show the step when we've found an unvisited neighbor
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
            backtracked: backtracked.has(node.id),
            current: node.id === currentNode,
          })),
          edges,
          currentNode,
          stack: [...stack],
          activeNeighbor: unvisitedNeighbor,
        },
        explanation: `Found unvisited neighbor ${unvisitedNeighbor}, pushing onto the stack.`,
        pseudoCodeLines: [12],
      });
      stack.push(unvisitedNeighbor);
    } else {
      // No unvisited neighbors found, backtrack
      stack.pop();
      backtracked.add(currentNode);
      steps.push({
        graphState: {
          nodes: initialNodes.map((node) => ({
            ...node,
            visited: visited.has(node.id),
            backtracked: backtracked.has(node.id),
            current:
              stack.length > 0 ? node.id === stack[stack.length - 1] : false,
          })),
          edges,
          currentNode: stack[stack.length - 1],
          stack: [...stack],
        },
        explanation: `All neighbors of ${currentNode} have been visited. Backtracking...`,
        pseudoCodeLines: [6],
      });
    }
  }

  return steps;
};

export default function EducationPageStructure({
  title = "Graph Algorithm",
  graphStates = [],
  conceptText = "",
  pseudocode = "",
  GraphVisualisationComponent = GraphVisualisation,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [isSpeakingExplanation, setIsSpeakingExplanation] = useState(false);
  const [isSpeakingConcept, setIsSpeakingConcept] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [nodeCount, setNodeCount] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [currentGraphStates, setCurrentGraphStates] = useState([]);
  const [pseudoCodeHighlight, setPseudoCodeHighlight] = useState([]);
  const [stack, setStack] = useState([]);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // 1 second default
  const [isPaused, setIsPaused] = useState(false);

  // Generate initial graph on mount
  useEffect(() => {
    const { nodes, edges } = generateRandomGraph(nodeCount);
    const steps = generateDFSSteps(nodes, edges);
    setCurrentGraphStates([steps]);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const nextStep = () => {
    if (currentStep < graphStates[activeTab].length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetGraph = () => {
    setCurrentStep(0);
  };

  // Speech synthesis handlers
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        window.speechSynthesis.cancel();
        setIsSpeakingExplanation(false);
        setIsSpeakingConcept(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const toggleSpeech = (text, type) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const isCurrentlySpeaking =
        type === "explanation" ? isSpeakingExplanation : isSpeakingConcept;

      if (isCurrentlySpeaking) {
        window.speechSynthesis.cancel();
        if (type === "explanation") {
          setIsSpeakingExplanation(false);
        } else {
          setIsSpeakingConcept(false);
        }
        return;
      }

      window.speechSynthesis.cancel();
      setIsSpeakingExplanation(false);
      setIsSpeakingConcept(false);

      let textToRead = "";
      if (type === "concept" && typeof text === "object") {
        textToRead = `${
          text.introduction
        } Key Characteristics: ${text.keyCharacteristics.join(
          ". "
        )}. Applications: ${text.applications.join(". ")}`;
      } else {
        textToRead = text;
      }

      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.onstart = () => {
        if (type === "explanation") {
          setIsSpeakingExplanation(true);
        } else {
          setIsSpeakingConcept(true);
        }
      };
      utterance.onend = () => {
        if (type === "explanation") {
          setIsSpeakingExplanation(false);
        } else {
          setIsSpeakingConcept(false);
        }
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const getCurrentGraphState = () => {
    return graphStates[activeTab]?.[currentStep]?.graphState;
  };

  const getCurrentExplanation = () => {
    return graphStates[activeTab]?.[currentStep]?.explanation;
  };

  const renderConceptText = (text) => (
    <div className="mb-4">
      <p className="mb-2">{text?.introduction}</p>
      {text.keyCharacteristics && (
        <>
          <h3 className="font-bold mb-2">Key Characteristics:</h3>
          <ul className="list-disc pl-5 mb-2">
            {text.keyCharacteristics.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
      {text.applications && (
        <>
          <h3 className="font-bold mb-2">Applications:</h3>
          <ul className="list-disc pl-5">
            {text.applications.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );

  const renderGraphSection = (isDesktop = false) => {
    return (
      <div
        className={`${
          isDesktop ? "h-[500px]" : "h-[400px]"
        } relative bg-white bg-opacity-50 rounded-lg`}
      >
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center gap-4 mb-4 p-4">
            <div>
              <label className="mr-2">Number of nodes:</label>
              <input
                type="range"
                min="3"
                max="10"
                value={nodeCount}
                onChange={(e) => setNodeCount(parseInt(e.target.value))}
                className="w-48"
              />
              <span className="ml-2">{nodeCount}</span>
            </div>

            <button
              onClick={() => {
                const { nodes, edges } = generateRandomGraph(nodeCount);
                const steps = generateDFSSteps(nodes, edges);
                setCurrentGraphStates([steps]);
                setCurrentStep(0);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Generate New Graph
            </button>

            <div className="flex gap-2">
              <button
                onClick={runDFS}
                className={`p-2 rounded-full ${
                  !isRunning
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-white`}
                title={!isRunning ? "Start" : "Pause"}
              >
                {!isRunning ? <FaPlay size={20} /> : <FaPause size={20} />}
              </button>

              <button
                onClick={() => {
                  setIsRunning(false);
                  setIsPaused(false);
                  setCurrentStep(0);
                  setPseudoCodeHighlight([]);
                }}
                className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white"
                title="Restart"
              >
                <FaRedo size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1">
            <div className="h-full flex items-center justify-center">
              {isLoading ? (
                <p>Loading graph...</p>
              ) : (
                <GraphVisualisationComponent
                  graphState={
                    currentGraphStates[activeTab]?.[currentStep]?.graphState
                  }
                  isGraphA={activeTab === 0}
                  graphIndex={activeTab}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getPseudoCodeHighlight = (step) => {
    const explanation = step?.explanation?.toLowerCase() || "";

    // Return single line numbers based on the current action
    if (explanation.includes("initial state")) {
      return [2]; // Only highlight Stack initialization
    } else if (
      explanation.includes("visit node") &&
      explanation.includes("mark it as visited")
    ) {
      return [8]; // Only highlight Visited.add(node)
    } else if (explanation.includes("checking unvisited neighbor")) {
      return [10]; // Only highlight neighbor iteration
    } else if (
      explanation.includes("push") &&
      explanation.includes("onto the stack")
    ) {
      return [12]; // Only highlight Stack.push
    } else if (explanation.includes("backtrack")) {
      return [6]; // Only highlight Stack.pop()
    }
    return [];
  };

  const runDFS = async () => {
    if (!currentGraphStates || !currentGraphStates[activeTab]) return;

    if (!isRunning) {
      // Starting the animation
      setIsRunning(true);
      setCurrentStep(0);
      setIsPaused(false);

      try {
        for (let i = 0; i < currentGraphStates[activeTab].length; i++) {
          const step = currentGraphStates[activeTab][i];
          setCurrentStep(i);
          setPseudoCodeHighlight(getPseudoCodeHighlight(step));

          // Use a ref to check the current pause state
          while (isPaused) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }

          await new Promise((resolve) => setTimeout(resolve, animationSpeed));

          // Check if all nodes are backtracked
          const allNodesBacktracked = step.graphState.nodes.every(
            (node) => node.backtracked
          );
          if (allNodesBacktracked) {
            break;
          }
        }
      } finally {
        setIsRunning(false);
        setIsPaused(false);
        setPseudoCodeHighlight([]);
      }
    } else {
      // Toggle pause state
      setIsPaused(!isPaused);
    }
  };

  // Add speed control UI
  const SpeedControl = () => (
    <div className="flex items-center gap-2">
      <label className="text-sm">Speed:</label>
      <input
        type="range"
        min="200"
        max="2000"
        step="100"
        value={animationSpeed}
        onChange={(e) => setAnimationSpeed(Number(e.target.value))}
        className="w-24"
      />
      <span className="text-sm">{animationSpeed}ms</span>
    </div>
  );

  // Mobile content
  const mobileContent = (
    <main className="flex flex-col p-6 items-center justify-center lg:hidden min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Learn {title}</h1>

      <div className="w-full max-w-4xl space-y-6">
        <div className="rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Graph Visualisation</h2>
          {renderGraphSection()}
        </div>

        <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-semibold">Explanation</h2>
            <button
              onClick={() =>
                toggleSpeech(getCurrentExplanation(), "explanation")
              }
              className="ml-2 p-2 rounded-full hover:bg-gray-100"
            >
              🔊
            </button>
          </div>

          <ExplanationSection
            explanation={getCurrentExplanation() || "No explanation available"}
          />
        </div>

        <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-semibold">{title} Concept</h2>
            <button
              onClick={() =>
                conceptText && toggleSpeech(conceptText, "concept")
              }
              className="ml-2 p-2 rounded-full hover:bg-gray-100"
            >
              🔊
            </button>
          </div>
          <div className={!conceptText ? "text-center" : ""}>
            {conceptText ? renderConceptText(conceptText) : "No text available"}
          </div>
        </div>

        {pseudocode && (
          <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-2">Pseudocode</h2>
            <CodeEditorPseudocode
              pseudocode={pseudocode}
              highlightedLines={pseudoCodeHighlight}
            />
          </div>
        )}
      </div>
    </main>
  );

  // Desktop content
  const desktopContent = (
    <div className="hidden lg:flex flex-row h-screen">
      <div className="w-1/2 p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Learn {title}</h1>

        {/* Graph Section */}
        <div className="mb-6">{renderGraphSection(true)}</div>

        {/* Explanation Section - Moved below graph */}
        <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold">Explanation</h2>
            <button
              onClick={() =>
                toggleSpeech(getCurrentExplanation(), "explanation")
              }
              className="ml-2 p-2 rounded-full hover:bg-gray-100"
            >
              🔊
            </button>
          </div>
          <ExplanationSection
            explanation={getCurrentExplanation() || "No explanation available"}
          />
        </div>
      </div>

      <div className="w-1/2 p-4 overflow-y-auto no-scrollbar border-l border-gray-300">
        {pseudocode && (
          <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-2">Pseudocode</h2>
            <CodeEditorPseudocode
              pseudocode={pseudocode}
              highlightedLines={pseudoCodeHighlight}
            />
          </div>
        )}
        <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4 mt-4">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold">{title} Concept</h2>
            <button
              onClick={() =>
                conceptText && toggleSpeech(conceptText, "concept")
              }
              className="ml-2 p-2 rounded-full hover:bg-gray-100"
            >
              🔊
            </button>
          </div>
          {conceptText
            ? renderConceptText(conceptText)
            : "No concept text available"}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobileContent}
      {desktopContent}
    </>
  );
}
