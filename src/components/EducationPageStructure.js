import React, { useState, useEffect, useRef } from "react";
import GraphVisualisation from "./GraphVisualisation";
import CodeEditorPseudocode from "./CodeEditorPseudocode";
import { FaPlay, FaPause, FaRedo } from "react-icons/fa";

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

const generateDFSExplanation = (step, visited, backtracked, stack) => {
  // Initial state
  if (stack.length === 1 && visited.size === 0) {
    return "Starting DFS from node " + stack[0];
  }

  // Just visited a node
  if (step.graphState.activeNeighbor) {
    return `Found unvisited neighbor ${step.graphState.activeNeighbor} from node ${step.graphState.currentNode}`;
  }

  // Backtracking
  if (backtracked.has(step.graphState.currentNode)) {
    return `Backtracking from node ${step.graphState.currentNode} (all neighbors visited)`;
  }

  // Just visited a new node
  if (visited.has(step.graphState.currentNode)) {
    return `Visiting node ${step.graphState.currentNode}, exploring its neighbors`;
  }

  return "Processing next DFS step";
};

const generateDFSSteps = (initialNodes, edges) => {
  const steps = [];
  const visited = new Set();
  const backtracked = new Set();
  const stack = [initialNodes[0].id];

  // Step 1: Initialize Stack
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
    explanation: generateDFSExplanation(null, visited, backtracked, stack),
    pseudoCodeLines: [2], // Stack = [start_node]
  });

  // Step 2: Initialize Visited Set
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
    explanation: generateDFSExplanation(
      steps[steps.length - 1],
      visited,
      backtracked,
      stack
    ),
    pseudoCodeLines: [3], // Visited = set()
  });

  while (stack.length > 0) {
    const currentNode = stack[stack.length - 1];

    // Step 3: While loop check
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
      explanation: generateDFSExplanation(
        steps[steps.length - 1],
        visited,
        backtracked,
        stack
      ),
      pseudoCodeLines: [5], // while Stack is not empty
    });

    if (!visited.has(currentNode)) {
      // Step 4: Pop operation
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
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [6], // node = Stack.pop()
      });

      // Step 5: Check if node not visited
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
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [7], // if node not in Visited
      });

      // Step 6: Add to visited
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
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [8], // Visited.add(node)
      });

      // Step 7: Process node
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
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [9], // process(node)
      });
    }

    const allNeighbors = edges
      .filter(
        (edge) => edge.source === currentNode || edge.target === currentNode
      )
      .map((edge) => (edge.source === currentNode ? edge.target : edge.source))
      .sort();

    // Step 8: Start neighbor loop
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
      explanation: generateDFSExplanation(
        steps[steps.length - 1],
        visited,
        backtracked,
        stack
      ),
      pseudoCodeLines: [10], // for neighbor in graph[node]
    });

    const unvisitedNeighbor = allNeighbors.find(
      (neighbor) => !visited.has(neighbor)
    );

    if (unvisitedNeighbor) {
      // Step 9: Check unvisited neighbor
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
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [11], // if neighbor not in Visited
      });

      // Step 10: Push to stack
      stack.push(unvisitedNeighbor);
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
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [12], // Stack.push(neighbor)
      });
    } else {
      // Backtracking
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
        explanation: generateDFSExplanation(
          steps[steps.length - 1],
          visited,
          backtracked,
          stack
        ),
        pseudoCodeLines: [5], // back to while Stack is not empty
      });
    }
  }

  return steps;
};

const generateBFSExplanation = (step, visited, queue) => {
  // Initial state
  if (queue.length === 1 && visited.size === 0) {
    return "Starting BFS from node " + queue[0];
  }

  // Just visited a node
  if (step.graphState.activeNeighbor) {
    return `Found unvisited neighbor ${step.graphState.activeNeighbor} at current level`;
  }

  // Processing new level
  if (visited.has(step.graphState.currentNode)) {
    return `Visiting node ${step.graphState.currentNode}, exploring all neighbors at this level`;
  }

  return "Processing next BFS step";
};

const generateBFSSteps = (initialNodes, edges) => {
  const steps = [];
  const visited = new Set();
  const queue = [initialNodes[0].id];

  // Step 1: Initialize Queue
  steps.push({
    graphState: {
      nodes: initialNodes.map((node) => ({
        ...node,
        visited: false,
        current: node.id === initialNodes[0].id,
      })),
      edges,
      currentNode: initialNodes[0].id,
      queue: [...queue],
    },
    explanation: generateBFSExplanation(null, visited, queue),
    pseudoCodeLines: [2], // Queue = [start_node]
  });

  while (queue.length > 0) {
    const currentNode = queue.shift();

    if (!visited.has(currentNode)) {
      visited.add(currentNode);

      const neighbors = edges
        .filter(
          (edge) =>
            (edge.source === currentNode && !visited.has(edge.target)) ||
            (edge.target === currentNode && !visited.has(edge.source))
        )
        .map((edge) =>
          edge.source === currentNode ? edge.target : edge.source
        )
        .sort();

      // Add unvisited neighbors to queue
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
          steps.push({
            graphState: {
              nodes: initialNodes.map((node) => ({
                ...node,
                visited: visited.has(node.id),
                current: node.id === currentNode,
              })),
              edges,
              currentNode,
              queue: [...queue],
              activeNeighbor: neighbor,
            },
            explanation: generateBFSExplanation(
              { graphState: { currentNode, activeNeighbor: neighbor } },
              visited,
              queue
            ),
            pseudoCodeLines: [10, 11, 12], // neighbor loop and queue addition
          });
        }
      }
    }
  }

  return steps;
};

export default function EducationPageStructure({
  title = "Graph Algorithm",
  conceptText = "",
  pseudocode = "",
  generateSteps,
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
  const isPausedRef = useRef(false);
  const [animationController, setAnimationController] = useState(null);
  const animationSpeedRef = useRef(animationSpeed);

  // Generate initial graph on mount
  useEffect(() => {
    const { nodes, edges } = generateRandomGraph(nodeCount);
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
                const steps = generateSteps(nodes, edges);
                setCurrentGraphStates([steps]);
                setCurrentStep(0);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Generate New Graph
            </button>

            <div className="flex gap-2">
              <button
                onClick={runTraversal}
                className={`p-2 rounded-full ${
                  !isRunning || isPaused
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                } text-white`}
                title={!isRunning || isPaused ? "Start" : "Pause"}
              >
                {!isRunning || isPaused ? (
                  <FaPlay size={20} />
                ) : (
                  <FaPause size={20} />
                )}
              </button>

              <button
                onClick={() => {
                  if (animationController) {
                    animationController.abort();
                  }
                  // Reset all states including pause states
                  setAnimationController(null);
                  setIsRunning(false);
                  setIsPaused(false);
                  isPausedRef.current = false; // Important: Reset the pause ref
                  setCurrentStep(0);
                  setPseudoCodeHighlight([]);
                }}
                className="p-2 rounded-full bg-gray-500 hover:bg-gray-600 text-white"
                title="Restart"
              >
                <FaRedo size={20} />
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
                className="w-32"
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
    setPseudoCodeHighlight(title.includes("BFS") ? [2, 3] : [2, 3]);

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

        // Use the ref here instead of the state
        await new Promise((resolve) =>
          setTimeout(resolve, animationSpeedRef.current)
        );

        const allNodesBacktracked = step.graphState.nodes.every(
          (node) => node.backtracked
        );
        if (allNodesBacktracked) {
          break;
        }

        i++;
      }
    } finally {
      if (!isPausedRef.current) {
        setIsRunning(false);
        setIsPaused(false);
        // Only clear highlights if we've completed the animation
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
    <div className="hidden lg:flex flex-row h-[calc(100vh-4rem)]">
      <div className="w-1/2 p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-2 text-center">Learn {title}</h1>

        {/* Graph Section - Set to take remaining height */}
        <div className="flex-1 mb-2">{renderGraphSection(true)}</div>

        {/* Explanation Section - Set to auto height */}
        <div className="bg-white bg-opacity-50 rounded-lg shadow-md p-2">
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

export { generateDFSSteps, generateBFSSteps };
