"use client";

import React, { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import GraphVisualisation from "@/components/GraphVisualisation";
import Footer from "@/components/Footer";

export default function EducationPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setIsSidebarOpen(false);
  };

  const handleAlgorithmSelect = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setIsSidebarOpen(false);
  };

  return (
    <div className="relative flex flex-col h-full bg-gradient-to-br from-blue-200 to-purple-200">
      <Header toggleSidebar={toggleSidebar} />
      <div className="relative flex-grow overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onModeSelect={handleModeSelect}
          onAlgorithmSelect={handleAlgorithmSelect}
          selectedMode={selectedMode}
          selectedAlgorithm={selectedAlgorithm}
        />
        <main className="flex flex-col p-4 overflow-y-auto no-scrollbar">
          <div className="flex-grow">
            {/* Graph Visualisation Section */}
            <div className="mb-6">
              <h2 className="text-xl mb-2 font-semibold">
                Graph Visualisation
              </h2>
              <div className="bg-white border border-gray-300 rounded-lg flex items-center justify-center h-64 overflow-auto no-scrollbar">
                <GraphVisualisation
                  mode={selectedMode}
                  algorithm={selectedAlgorithm}
                />
              </div>
            </div>
            {/* Explanation Section */}
            <div>
              <h2 className="text-xl mb-2 font-semibold flex items-center">
                <Image
                  src="/images/person-speaking.png"
                  alt="person speaking icon for explanation section"
                  width={30}
                  height={30}
                />
                <span className="ml-2">Explanation</span>
              </h2>
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <p>
                  {selectedMode && selectedAlgorithm
                    ? `Explanation for ${selectedMode} mode and ${selectedAlgorithm} algorithm.`
                    : "Select a mode and algorithm from the sidebar to see an explanation."}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      {isSidebarOpen && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
