"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import GraphVisualisation from "@/components/GraphVisualisation";

const bfsSteps = [
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
    explanation: "Start BFS from node A. Mark A as visited.",
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
      "Visit the first unvisited adjacent node B. Mark B as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
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
      currentNode: "C",
    },
    explanation: "Visit the next unvisited adjacent node C. Mark C as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
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
      "Visit the first unvisited adjacent node of B, which is D. Mark D as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D", visited: true },
        { id: "E", visited: true },
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
      currentNode: "E",
    },
    explanation:
      "Visit the next unvisited adjacent node of B, which is E. Mark E as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D", visited: true },
        { id: "E", visited: true },
        { id: "F", visited: true },
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
      currentNode: "F",
    },
    explanation:
      "Visit the first unvisited adjacent node of C, which is F. Mark F as visited.",
  },
  {
    graphState: {
      nodes: [
        { id: "A", visited: true },
        { id: "B", visited: true },
        { id: "C", visited: true },
        { id: "D", visited: true },
        { id: "E", visited: true },
        { id: "F", visited: true },
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
      currentNode: null,
    },
    explanation: "All nodes have been visited. BFS traversal is complete.",
  },
];

const bfsConceptText = `
    BFS Concept: Breadth-First Search (BFS) is a graph traversal algorithm that explores all the neighbors of a node before moving to the next level of nodes. 
    It uses a queue to keep track of nodes to visit and is often implemented iteratively.
    
    Key Characteristics:
    - Explores all neighboring nodes before moving on to the next level
    - Uses a queue to keep track of nodes to visit
    - Marks nodes as visited to avoid cycles
    - Can be used to find the shortest path in unweighted graphs
  `;

export default function BFSEducationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeakingExplanation, setIsSpeakingExplanation] = useState(false);
  const [isSpeakingConcept, setIsSpeakingConcept] = useState(false);

  const nextStep = () => {
    if (currentStep < bfsSteps.length - 1) {
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
        Learn Breadth-First Search (BFS)
      </h1>

      <div className="w-full max-w-4xl">
        {/* Graph Visualisation Section */}
        <div className="mb-6">
          <h2 className="text-xl mb-2 font-semibold">Graph Visualisation</h2>
          <div className="bg-white border border-gray-300 rounded-lg flex items-center justify-center h-64 overflow-auto no-scrollbar">
            <GraphVisualisation graphState={bfsSteps[currentStep].graphState} />
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
                        bfsSteps[currentStep].explanation,
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
            <p>{bfsSteps[currentStep].explanation}</p>
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
              disabled={currentStep === bfsSteps.length - 1}
              className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* BFS Concept Section */}
        <div className="mb-6">
          <h2 className="text-xl mb-2 font-semibold flex items-center">
            <Image
              src="/images/person-speaking.png"
              alt="person speaking icon for BFS concept section"
              width={40}
              height={40}
              onClick={
                !isSpeakingExplanation && !isSpeakingConcept // Disable if either is speaking
                  ? () => readAloud(bfsConceptText, "concept")
                  : undefined
              }
              className={`cursor-pointer ${
                isSpeakingConcept ? "animate-icon" : ""
              } w-12 h-12 mr-2`}
            />
            <span className="ml-2">BFS Concept</span>
          </h2>
          <div className="bg-white border border-gray-300 rounded-lg p-4">
            <p>
              Breadth-First Search (BFS) is a graph traversal algorithm that
              explores all the neighbors of a node before moving to the next
              level of nodes. It uses a queue to keep track of nodes to visit
              and is often implemented iteratively.
            </p>
            <h3 className="text-lg font-semibold mt-4 mb-2">
              Key Characteristics:
            </h3>
            <ul className="list-disc list-inside">
              <li>
                Explores all neighboring nodes before moving on to the next
                level
              </li>
              <li>Uses a queue to keep track of nodes to visit</li>
              <li>Marks nodes as visited to avoid cycles</li>
              <li>
                Can be used to find the shortest path in unweighted graphs
              </li>
            </ul>
          </div>
        </div>

        {/* Pseudocode Section */}
        <div className="mb-6">
          <h2 className="text-xl mb-2 font-semibold">Pseudocode</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            {`BFS(graph, start_node):
    Queue = [start_node]
    Visited = set()

    while Queue is not empty:
        node = Queue.dequeue()
        if node not in Visited:
            Visited.add(node)
            process(node)
            for neighbor in graph[node]:
                if neighbor not in Visited:
                    Queue.enqueue(neighbor)`}
          </pre>
        </div>
      </div>
    </main>
  );
}
