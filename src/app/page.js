"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import AnimatedLion from "@/components/AnimatedLion";
import Modal from "@/components/Modal";
import { Menu } from "lucide-react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [missingSelection, setMissingSelection] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    if (selectedAlgorithm) {
      // Close sidebar if both are selected
      setIsSidebarOpen(false);
    }
  };

  const handleAlgorithmSelect = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    if (selectedMode) {
      // Close sidebar if both are selected
      setIsSidebarOpen(false);
    }
  };

  const handleSidebarClose = () => {
    // Close the sidebar first
    setIsSidebarOpen(false);

    // Then check if both mode and algorithm are selected
    if (!selectedMode || !selectedAlgorithm) {
      setTimeout(() => {
        // Show the modal with a slight delay after sidebar closes
        setMissingSelection(!selectedMode ? "mode" : "algorithm");
        setIsModalOpen(true);
      }, 300); // 300ms to wait for the sidebar transition
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-blue-200 to-purple-200">
      <Header toggleSidebar={toggleSidebar} />
      <div className="relative flex-grow overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose} // Sidebar closes first, then modal logic
          onModeSelect={handleModeSelect}
          onAlgorithmSelect={handleAlgorithmSelect}
          selectedMode={selectedMode}
          selectedAlgorithm={selectedAlgorithm}
        />
        <main className="flex flex-col items-center justify-center p-8 text-center">
          <AnimatedLion />
          <div className="mt-8 space-y-6 max-w-2xl">
            <h2 className="text-3xl font-bold">
              Welcome to the Graph Algorithm Game!
            </h2>
            <p className="text-xl font-semibold text-white">
              Please click the sidebar{" "}
              <Menu className="inline-block w-6 h-6 text-blue-500 animate-pulse" />{" "}
              and:
            </p>
            <ol className="text-left text-lg text-gray-900 space-y-4 pl-6">
              <li className="animate-fade-in-1">
                1. Choose education or game mode
              </li>
              <li className="animate-fade-in-2">
                2. Choose the algorithm to get started!
              </li>
            </ol>
          </div>
        </main>
      </div>
      <Footer />

      {isSidebarOpen && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 z-20"
          onClick={handleSidebarClose} // Clicking outside will close sidebar and show modal if needed
        ></div>
      )}

      {/* Modal for incomplete selections */}
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          missingSelection={missingSelection}
        />
      )}
    </div>
  );
}
