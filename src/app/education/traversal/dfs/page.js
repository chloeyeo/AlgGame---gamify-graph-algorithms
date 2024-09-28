"use client";

import { useState } from "react";
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
        { id: "D", visited: true },
        { id: "E", visited: true },
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
      currentNode: "E",
    },
    explanation:
      "Backtrack to B and visit its unvisited adjacent node E. Push E onto the stack and mark it as visited.",
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
      currentNode: "C",
    },
    explanation:
      "Backtrack to A and visit its unvisited adjacent node C. Push C onto the stack and mark it as visited.",
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
      currentNode: "F",
    },
    explanation:
      "Visit the only unvisited adjacent node of C, which is F. Push F onto the stack and mark it as visited.",
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
    explanation: "All nodes have been visited. DFS traversal is complete.",
  },
];

export default function DFSEducationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false); // Track if speech is active

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

  const readAloud = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US"; // can change this to other language codes if needed

      utterance.onstart = () => setIsSpeaking(true); // Start highlight/animation
      utterance.onend = () => setIsSpeaking(false); // Stop highlight/animation

      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Text-to-speech is not supported in this browser.");
    }
  };

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
              width={30}
              height={30}
              onClick={() => readAloud(dfsSteps[currentStep].explanation)}
              className={`cursor-pointer ${isSpeaking ? "animate-icon" : ""}`}
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
          <h2 className="text-xl mb-2 font-semibold">DFS Concept</h2>
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
