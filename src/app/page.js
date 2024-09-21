"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
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
      <Header />
      <main className="flex-grow flex flex-col p-4 overflow-hidden font-quicksand">
        {/* Scrollable Container */}
        <div className="flex-grow overflow-y-auto no-scrollbar gap-y-10">
          {" "}
          {/* Use scrollbar-hidden here */}
          {/* Graph Visualisation Section */}
          <div className="flex-grow p-2">
            <h2 className="text-xl mb-2 font-semibold">Graph Visualisation</h2>
            <div className="h-64 bg-white border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
              <GraphVisualisation
                data={graphData}
                algorithm={selectedAlgorithm}
              />
            </div>
          </div>
          {/* Explanation Section */}
          <div className="flex-grow p-2">
            <h2 className="text-xl mb-2 font-semibold">Explanation</h2>
            <div className="h-64 bg-white border border-gray-300 rounded-lg flex flex-col overflow-hidden">
              <div className="flex-grow overflow-auto no-scrollbar">
                <p className="text-center px-4 py-4">
                  {/* Add long text here for testing scrolling */}
                  Some explanation given. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Quisque gravida, eros et egestas
                  gravida. Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Quisque gravida, eros et egestas gravida. Lorem ipsum
                  dolor sit amet, consectetur adipiscing elit. Quisque gravida,
                  eros et egestas gravida.Some explanation given. Lorem ipsum
                  dolor sit amet, consectetur adipiscing elit. Quisque gravida,
                  eros et egestas gravida. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Quisque gravida, eros et egestas
                  gravida. Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Quisque gravida, eros et egestas gravida.Some
                  explanation given. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Quisque gravida, eros et egestas gravida.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Quisque gravida, eros et egestas gravida. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Quisque gravida, eros
                  et egestas gravida. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Quisque gravida, eros et egestas gravida.Some
                  explanation given. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Quisque gravida, eros et egestas gravida.
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Quisque gravida, eros et egestas gravida. Lorem ipsum dolor
                  sit amet, consectetur adipiscing elit. Quisque gravida, eros
                  et egestas gravida.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
