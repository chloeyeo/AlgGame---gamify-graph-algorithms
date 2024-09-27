"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import AnimatedLion from "@/components/AnimatedLion";
import Modal from "@/components/Modal";
import { Menu } from "lucide-react";

export default function Home() {
  const router = useRouter(); // Initialize useRouter
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
    if (selectedAlgorithm && mode === "Education") {
      // Navigate to the education page if both selections are made
      router.push("/education"); // Navigate to the education page
    }
    if (selectedAlgorithm) {
      setIsSidebarOpen(false);
    }
  };

  const handleAlgorithmSelect = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    if (selectedMode && selectedMode === "Education") {
      // Navigate to the education page if both selections are made
      router.push("/education"); // Navigate to the education page
    }
    if (selectedMode) {
      setIsSidebarOpen(false);
    }
  };

  const handleSidebarClose = () => {
    // Close the sidebar first
    setIsSidebarOpen(false);

    // Only show the modal if selections were made
    if (!selectedMode && !selectedAlgorithm) {
      // Do nothing if no selection was made
      return;
    }

    // Check if either mode or algorithm is missing
    setTimeout(() => {
      if (!selectedMode || !selectedAlgorithm) {
        setMissingSelection(selectedMode ? "mode" : "algorithm");
        setIsModalOpen(true);
      }
    }, 300); // 300ms to wait for the sidebar transition
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-blue-200 to-purple-200">
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full sm:max-w-[576px]">
        <Header toggleSidebar={toggleSidebar} />
      </header>
      <div className="relative flex-grow overflow-hidden pt-[70px] pb-[32px]">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose} // Sidebar closes first, then modal logic
          onModeSelect={handleModeSelect}
          onAlgorithmSelect={handleAlgorithmSelect}
          selectedMode={selectedMode}
          selectedAlgorithm={selectedAlgorithm}
        />
        <main className="flex flex-col items-center justify-center p-8 text-center mb-12">
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
      <footer className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 w-full sm:max-w-[576px]">
        <Footer />
      </footer>

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
