import React, { useState, useEffect, useRef } from "react";
import GraphVisualisation from "./GraphVisualisation";
import CodeEditorPseudocode from "./CodeEditorPseudocode";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { incrementGraphCounter } from "@/store/slices/graphSlice";

const ExplanationSection = ({ step }) => {
  if (!step) {
    return (
      <div className="explanation-section" data-testid="explanation-text">
        <p>
          Generate a graph and run the algorithm to see step-by-step
          explanations
        </p>
      </div>
    );
  }

  return (
    <div className="explanation-section" data-testid="explanation-text">
      <p>{step.explanation}</p>
    </div>
  );
};

const generateRandomGraph = (
  nodeCount,
  isFordFulkerson = false,
  edgeDensity = 0.4
) => {
  console.log(
    "isFordFulkerson (in education page structure):",
    isFordFulkerson
  );
  if (!isFordFulkerson) {
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

    // console.log(
    //   "isFordFulkerson (in education page structure):",
    //   isFordFulkerson
    // );

    const edges = [];
    // Ensure graph is connected
    for (let i = 1; i < nodes.length; i++) {
      const parent = Math.floor(Math.random() * i);
      edges.push({
        source: nodes[parent].id,
        target: nodes[i].id,
        weight: Math.floor(Math.random() * 9) + 1, // Random weight between 1-9
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
          weight: Math.floor(Math.random() * 9) + 1, // Random weight between 1-9
        });
      }
    }

    return { nodes, edges };
  }
  // Create nodes
  const nodes = [];
  const width = 800;
  const height = 600;
  const padding = 100; // Padding from edges

  // Always include source (S) and sink (T)
  nodes.push({ id: "S", x: padding, y: height / 2 });
  nodes.push({ id: "T", x: width - padding, y: height / 2 });

  // Generate other nodes with letters (A, B, C, ...)
  for (let i = 0; i < nodeCount - 2; i++) {
    nodes.push({
      id: String.fromCharCode(65 + i), // A, B, C, ...
      x: padding + ((width - 2 * padding) / (nodeCount - 1)) * (i + 1),
      y: padding + Math.random() * (height - 2 * padding),
    });
  }

  // Generate edges
  const edges = [];
  const maxCapacity = 15;

  // Helper function to add edge if it doesn't exist
  const addEdge = (source, target) => {
    if (
      !edges.some(
        (e) =>
          (e.source === source && e.target === target) ||
          (e.source === target && e.target === source)
      )
    ) {
      edges.push({
        source,
        target,
        capacity: Math.floor(Math.random() * maxCapacity) + 1,
        flow: 0,
      });
    }
  };

  // Ensure path from source to sink exists
  let current = "S";
  const visited = new Set([current]);

  while (current !== "T") {
    const availableNodes = nodes
      .filter((n) => !visited.has(n.id) && n.id !== "S")
      .sort(() => Math.random() - 0.5);

    const next = availableNodes[0].id;
    addEdge(current, next);
    visited.add(next);
    current = next;
  }

  // Add random additional edges based on density
  nodes.forEach((node1) => {
    nodes.forEach((node2) => {
      if (node1.id !== node2.id && Math.random() < edgeDensity) {
        // Prevent backwards flow to source and forward flow from sink
        if (node2.id !== "S" && node1.id !== "T") {
          addEdge(node1.id, node2.id);
        }
      }
    });
  });

  return { nodes, edges };
};

const generateDijkstraExplanation = (step, visited, distances) => {
  if (!step) return "Starting Dijkstra's algorithm";

  // Initial state
  if (visited.size === 0) {
    return "Initial state: All nodes have infinite distance except the start node";
  }

  // Node distance update
  if (step.graphState.nodes.some((node) => node.recentlyUpdated)) {
    const updatedNode = step.graphState.nodes.find(
      (node) => node.recentlyUpdated
    );
    return `Updated distance to ${updatedNode.id}: ${distances.get(
      updatedNode.id
    )} through node ${step.graphState.currentNode}`;
  }

  // Processing new node
  if (step.graphState.currentNode) {
    return `Processing node ${
      step.graphState.currentNode
    } (current shortest distance: ${distances.get(
      step.graphState.currentNode
    )})`;
  }

  return "Processing next step in Dijkstra's algorithm";
};

export default function EducationPageStructure({
  title = "Graph Algorithm",
  conceptText = "",
  pseudocode = "",
  generateSteps = null,
  GraphVisualisationComponent = GraphVisualisation,
  isFordFulkerson = false,
  nodeCountProp = null,
  onNodeCountChange = null,
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
  const isPausedRef = useRef(false);
  const [animationController, setAnimationController] = useState(null);
  const animationSpeedRef = useRef(animationSpeed);
  const dispatch = useDispatch();

  // Generate initial graph on mount
  useEffect(() => {
    const { nodes, edges } = generateRandomGraph(nodeCount, isFordFulkerson);
    const steps = generateSteps(nodes, edges);
    setCurrentGraphStates([steps]);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // Update the ref whenever animationSpeed changes
  useEffect(() => {
    animationSpeedRef.current = animationSpeed;
  }, [animationSpeed]);

  const nextStep = () => {
    if (currentStep < currentGraphStates[activeTab].length - 1) {
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
    return currentGraphStates[activeTab]?.[currentStep]?.graphState;
  };

  const getCurrentExplanation = () => {
    return currentGraphStates[activeTab]?.[currentStep]?.explanation;
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
          isDesktop ? "h-full" : "h-[400px]"
        } relative bg-white bg-opacity-50 rounded-lg`}
      >
        <div className="w-full h-full flex flex-col">
          <div className="flex flex-col gap-2 p-2 lg:flex-row lg:items-center lg:gap-4 lg:p-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Nodes:</label>
              <input
                type="range"
                min="3"
                max={isFordFulkerson ? "6" : "7"}
                value={isFordFulkerson ? nodeCountProp : nodeCount}
                onChange={(e) =>
                  isFordFulkerson
                    ? onNodeCountChange(parseInt(e.target.value))
                    : setNodeCount(parseInt(e.target.value))
                }
                className="w-24 lg:w-48"
              />
              <span className="text-sm">
                {isFordFulkerson ? nodeCountProp : nodeCount}
              </span>
            </div>

            <button
              onClick={() => {
                dispatch(incrementGraphCounter());
                const { nodes, edges } = generateRandomGraph(
                  nodeCount,
                  isFordFulkerson
                );
                const steps = generateSteps(nodes, edges);
                setCurrentGraphStates([steps]);
                setCurrentStep(0);
              }}
              className="px-2 py-1 lg:px-4 lg:py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              New Graph
            </button>

            <div className="flex gap-2">
              <button
                onClick={runTraversal}
                className={`p-1 lg:p-2 rounded-full ${
                  !isRunning || isPaused
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-white`}
                title={!isRunning || isPaused ? "Start" : "Pause"}
              >
                {!isRunning || isPaused ? (
                  <FaPlay size={16} className="lg:w-5 lg:h-5" />
                ) : (
                  <FaPause size={16} className="lg:w-5 lg:h-5" />
                )}
              </button>

              <button
                onClick={() => {
                  if (animationController) {
                    animationController.abort();
                  }
                  setAnimationController(null);
                  setIsRunning(false);
                  setIsPaused(false);
                  isPausedRef.current = false;
                  setCurrentStep(0);
                  setPseudoCodeHighlight([]);
                }}
                className="p-1 lg:p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white"
                title="Restart"
              >
                <FaRedo size={16} className="lg:w-5 lg:h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Speed:</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="w-24 lg:w-32"
              />
              <span className="text-sm">{animationSpeed}ms</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="h-full flex items-center justify-center">
              {isLoading ? (
                <p>Loading graph...</p>
              ) : (
                <GraphVisualisationComponent
                  graphState={getCurrentGraphState()}
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
    if (!step) return [];
    const { graphState } = step;

    // Return the pseudoCodeLines directly from the step
    return step.pseudoCodeLines || []; // Default to empty array if not specified
  };

  const runTraversal = async () => {
    if (!currentGraphStates || !currentGraphStates[activeTab]) return;

    // If paused, just toggle pause state
    if (isRunning) {
      setIsPaused(!isPaused);
      isPausedRef.current = !isPausedRef.current;
      return;
    }

    // Start fresh animation
    const controller = new AbortController();
    setAnimationController(controller);
    setIsRunning(true);
    setCurrentStep(0);
    setIsPaused(false);
    isPausedRef.current = false;

    // Set initial pseudocode highlight based on algorithm type
    setPseudoCodeHighlight(
      title.includes("BFS")
        ? [2, 3]
        : title.includes("DFS")
        ? [2, 3]
        : title.includes("Dijkstra")
        ? [2, 3, 4, 5, 6]
        : title.includes("A*")
        ? [2, 3, 4, 5, 6, 7]
        : [2, 3]
    );

    // Main animation loop
    try {
      let i = 0;
      while (
        i < currentGraphStates[activeTab].length &&
        !controller.signal.aborted
      ) {
        if (isPausedRef.current) {
          await new Promise((resolve) => {
            const checkPause = () => {
              if (!isPausedRef.current) {
                resolve();
              } else {
                setTimeout(checkPause, 100);
              }
            };
            checkPause();
          });
          continue;
        }

        const step = currentGraphStates[activeTab][i];
        setCurrentStep(i);

        const highlights = getPseudoCodeHighlight(step);
        setPseudoCodeHighlight(highlights);

        await new Promise((resolve) =>
          setTimeout(resolve, animationSpeedRef.current)
        );

        // Only check for backtracking in DFS
        if (title.includes("DFS")) {
          const allNodesBacktracked = step.graphState.nodes.every(
            (node) => node.backtracked
          );
          if (allNodesBacktracked) {
            break;
          }
        }

        i++;
      }
    } finally {
      if (!isPausedRef.current) {
        setIsRunning(false);
        setIsPaused(false);
        if (!controller.signal.aborted) {
          setPseudoCodeHighlight([]);
        }
        setAnimationController(null);
      }
    }
  };

  // Add cleanup effect
  useEffect(() => {
    return () => {
      if (animationController) {
        animationController.abort();
        setAnimationController(null);
      }
    };
  }, [animationController]);

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
            step={currentGraphStates[activeTab]?.[currentStep]}
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
          <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4 mt-2">
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
    <div className="hidden lg:flex flex-row h-[calc(100vh-4rem)] overflow-hidden">
      <div className="w-1/2 p-4 flex flex-col overflow-hidden">
        <h1 className="text-2xl font-bold mb-2 text-center">Learn {title}</h1>

        {/* Graph Section - Set to take remaining height */}
        <div className="flex-1 mb-2 overflow-hidden">
          {renderGraphSection(true)}
        </div>

        {/* Explanation Section - Set to fixed height */}
        <div className="h-32 bg-white bg-opacity-50 rounded-lg shadow-md p-2 overflow-y-auto no-scrollbar my-4">
          <div className="flex items-center mb-1">
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
            step={currentGraphStates[activeTab]?.[currentStep]}
          />
        </div>
      </div>

      <div className="w-1/2 p-4 flex flex-col h-full overflow-hidden border-l border-gray-300">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {pseudocode && (
            <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4 mb-4">
              <h2 className="text-xl font-bold mb-2">Pseudocode</h2>
              <CodeEditorPseudocode
                pseudocode={pseudocode}
                highlightedLines={pseudoCodeHighlight}
              />
            </div>
          )}
          <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-4 my-4">
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
    </div>
  );

  return (
    <>
      {mobileContent}
      {desktopContent}
    </>
  );
}

export { generateDijkstraExplanation };
