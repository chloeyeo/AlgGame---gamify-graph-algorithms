"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import GraphVisualisation from "@/components/GraphVisualisation";

const dfsSteps = [
  {
    graphState: {
      nodes: [
        { id: "A", visited: false },
        { id: "B", visited: false },
        { id: "C", visited: false },
        { id: "D", visited: false },
        { id: "E", visited: false },
        { id: "F", visited: false },
        { id: "G", visited: false },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: null,
    },
    explanation: "Initial state: No nodes have been visited yet.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: false },
        { id: "C", visited: false },
        { id: "D", visited: false },
        { id: "E", visited: false },
        { id: "F", visited: false },
        { id: "G", visited: false },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: "A",
    },
    explanation:
      "Start DFS from node A. Push A onto the stack and mark it as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: false },
        { id: "D", visited: false },
        { id: "E", visited: false },
        { id: "F", visited: false },
        { id: "G", visited: false },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: "B",
    },
    explanation:
      "Visit the first unvisited adjacent node B. Push B onto the stack and mark it as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: false },
        { id: "D", visited: true },
        { id: "E", visited: false },
        { id: "F", visited: false },
        { id: "G", visited: false },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: "D",
    },
    explanation:
      "Visit the first unvisited adjacent node of B, which is D. Push D onto the stack and mark it as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: false },
        { id: "D", visited: true },
        { id: "E", visited: false },
        { id: "F", visited: false },
        { id: "G", visited: true },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: "G",
    },
    explanation:
      "Visit the only unvisited adjacent node of D, which is G. Push G onto the stack and mark it as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: false },
        { id: "D", visited: true, backtracked: true },
        { id: "E", visited: true },
        { id: "F", visited: false },
        { id: "G", visited: true, backtracked: true },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: "E",
    },
    explanation:
      "Backtrack to B and visit its unvisited adjacent node E. Push E onto the stack and mark it as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true, backtracked: true },
        { id: "C", visited: true },
        { id: "D", visited: true, backtracked: true },
        { id: "E", visited: true, backtracked: true },
        { id: "F", visited: false },
        { id: "G", visited: true, backtracked: true },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: "C",
    },
    explanation:
      "Backtrack to A and visit its unvisited adjacent node C. Push C onto the stack and mark it as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true, backtracked: true },
        { id: "C", visited: true },
        { id: "D", visited: true, backtracked: true },
        { id: "E", visited: true, backtracked: true },
        { id: "F", visited: true },
        { id: "G", visited: true, backtracked: true },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: "F",
    },
    explanation:
      "Visit the only unvisited adjacent node of C, which is F. Push F onto the stack and mark it as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true, backtracked: true },
        { id: "B", visited: true, backtracked: true },
        { id: "C", visited: true, backtracked: true },
        { id: "D", visited: true, backtracked: true },
        { id: "E", visited: true, backtracked: true },
        { id: "F", visited: true, backtracked: true },
        { id: "G", visited: true, backtracked: true },
      ],
      edges: [
        { source: "A", target: "B" },
        { source: "A", target: "C" },
        { source: "B", target: "D" },
        { source: "B", target: "E" },
        { source: "C", target: "F" },
        { source: "D", target: "G" },
      ],
      currentNode: null,
    },
    explanation: "All nodes have been visited. DFS traversal is complete.",
  },
];

const dfsConceptText = `
  DFS Concept: Depth-First Search (DFS) is a graph traversal algorithm that explores as far as possible along each branch before backtracking. 
  It uses a stack to keep track of nodes to visit and is often implemented recursively.
  
  Key Characteristics:
  - Explores deep into the graph before backtracking
  - Uses a stack (or recursion) to keep track of nodes to visit
  - Marks nodes as visited to avoid cycles
  - Can be used to detect cycles, find paths, and solve puzzles
`;

export default function DFSEducationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeakingExplanation, setIsSpeakingExplanation] = useState(false);
  const [isSpeakingConcept, setIsSpeakingConcept] = useState(false);

  const nextStep = () => {
    if (currentStep < dfsSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const readAloud = (text, type) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";

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
    } else {
      console.log("Text-to-speech is not supported in this browser.");
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Reset both states to not speaking
        setIsSpeakingExplanation(false);
        setIsSpeakingConcept(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <main className="flex flex-col p-6 pt-8 items-center justify-center overflow-y-auto no-scrollbar">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Learn Depth-First Search (DFS)
      </h1>

      <div className="w-full max-w-4xl">
        {/* Graph Visualisation Section */}
        <div className="mb-6">
          <h2 className="text-xl mb-2 font-semibold">Graph Visualisation</h2>
          <div className="bg-white border border-gray-300 rounded-lg flex items-center justify-center h-64 overflow-auto no-scrollbar">
            <GraphVisualisation graphState={dfsSteps[currentStep].graphState} />
          </div>
        </div>

        {/* Explanation Section */}
        <div className="mb-6">
          <h2 className="text-xl mb-2 font-semibold flex items-center">
            <Image
              src="/images/person-speaking.png"
              alt="person speaking icon for explanation section"
              width={40}
              height={40}
              onClick={
                !isSpeakingExplanation && !isSpeakingConcept // Disable if either is speaking
                  ? () =>
                      readAloud(
                        dfsSteps[currentStep].explanation,
                        "explanation"
                      )
                  : undefined
              }
              className={`cursor-pointer ${
                isSpeakingExplanation ? "animate-icon" : ""
              } w-12 h-12 mr-2`}
            />
            <span className="ml-2">Explanation</span>
          </h2>
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <p>{dfsSteps[currentStep].explanation}</p>
          </div>

          {/* Navigation Buttons */}
          <div className="mt-4 flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="bg-gray-300 p-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={nextStep}
              disabled={currentStep === dfsSteps.length - 1}
              className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* DFS Concept Section */}
        <div className="mb-6">
          <h2 className="text-xl mb-2 font-semibold flex items-center">
            <Image
              src="/images/person-speaking.png"
              alt="person speaking icon for DFS concept section"
              width={40}
              height={40}
              onClick={
                !isSpeakingExplanation && !isSpeakingConcept // Disable if either is speaking
                  ? () => readAloud(dfsConceptText, "concept")
                  : undefined
              }
              className={`cursor-pointer ${
                isSpeakingConcept ? "animate-icon" : ""
              } w-12 h-12 mr-2`}
            />
            <span className="ml-2">DFS Concept</span>
          </h2>
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <p>
              Depth-First Search (DFS) is a graph traversal algorithm that
              explores as far as possible along each branch before backtracking.
              It uses a stack to keep track of nodes to visit and is often
              implemented recursively.
            </p>
            <h3 className="text-lg font-semibold mt-4 mb-2">
              Key Characteristics:
            </h3>
            <ul className="list-disc list-inside">
              <li>Explores deep into the graph before backtracking</li>
              <li>
                Uses a stack (or recursion) to keep track of nodes to visit
              </li>
              <li>Marks nodes as visited to avoid cycles</li>
              <li>
                Can be used to detect cycles, find paths, and solve puzzles
              </li>
            </ul>
          </div>
        </div>

        {/* Pseudocode Section */}
        <div className="mb-6">
          <h2 className="text-xl mb-2 font-semibold">Pseudocode</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {`DFS(graph, start_node):
    Stack = [start_node]
    Visited = set()

    while Stack is not empty:
        node = Stack.pop()
        if node not in Visited:
            Visited.add(node)
            process(node)
            for neighbor in graph[node]:
                if neighbor not in Visited:
                    Stack.push(neighbor)`}
          </pre>
        </div>
      </div>
    </main>
  );
}
