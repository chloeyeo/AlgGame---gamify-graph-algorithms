"use client";

import React, { useState } from "react";
import GraphVisualisation from "@/components/GraphVisualisation";

export default function Home() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [graphData, setGraphData] = useState({
    nodes: [
      { id: "Node 1", group: 1 },
      { id: "Node 2", group: 1 },
      { id: "Node 3", group: 2 },
      { id: "Node 4", group: 2 },
    ],
    links: [
      { source: "Node 1", target: "Node 2" },
      { source: "Node 2", target: "Node 3" },
      { source: "Node 3", target: "Node 4" },
    ],
  });

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <header className="flex-shrink-0 p-4 font-poppins">
        <h1 className="text-2xl font-bold text-center">Graph Algorithm Game</h1>
      </header>

      <main className="flex-grow flex flex-col p-4 overflow-hidden font-quicksand">
        <div className="flex-shrink-0 mb-4">
          <h2 className="text-xl mb-2 font-semibold">Select an Algorithm</h2>
          <div className="grid grid-cols-2 gap-2">
            {["BFS", "DFS", "Dijkstra", "Kruskal"].map((algo) => (
              <button
                key={algo}
                onClick={() => setSelectedAlgorithm(algo)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm"
              >
                {algo}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-grow flex flex-col overflow-hidden">
          <h2 className="text-xl mb-2 font-semibold">Graph Visualisation</h2>
          <div className="flex-grow bg-white border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
            {/* Placeholder for graph visualization component */}
            <GraphVisualisation
              data={graphData}
              algorithm={selectedAlgorithm}
            />
            {/* <p className="text-gray-500">Graph will be displayed here</p> */}
          </div>
        </div>

        <div className="flex-shrink-0 mt-4">
          <h2 className="text-xl mb-2 font-semibold">Game Controls</h2>
          <div className="flex justify-center space-x-4">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm">
              Start
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm">
              Hint
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm">
              Reset
            </button>
          </div>
        </div>
      </main>

      <footer className="flex-shrink-0 p-4 text-center text-sm text-gray-700 font-quicksand">
        <p>Made by Chloe Yeo</p>
      </footer>
    </div>
  );
}
