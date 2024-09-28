"use client";

import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Modal from "@/components/Modal";

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [missingSelection, setMissingSelection] = useState("");
  const router = useRouter(); // Initialize useRouter
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

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
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/images/alg.png" />
        <link rel="apple-touch-icon" href="/images/alg.png" />
      </head>
      <body>
        <div className="sm:bg-gray-50 w-full min-h-screen flex justify-center items-center">
          <div className="bg-white w-full h-full sm:w-[576px] sm:h-screen relative flex flex-col overflow-hidden sm:shadow-lg">
            <div className="flex-grow overflow-hidden">
              <div className="h-full overflow-y-auto bg-white px-0 py-0 no-scrollbar">
                <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-blue-200 to-purple-200">
                  <header className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 w-full sm:max-w-[576px]">
                    <Header toggleSidebar={toggleSidebar} />
                  </header>
                  <div className="relative flex-grow overflow-hidden pt-[16%] pb-[10%]">
                    <Sidebar
                      isOpen={isSidebarOpen}
                      onClose={handleSidebarClose} // Sidebar closes first, then modal logic
                      onModeSelect={handleModeSelect}
                      onAlgorithmSelect={handleAlgorithmSelect}
                      selectedMode={selectedMode}
                      selectedAlgorithm={selectedAlgorithm}
                    />
                    {children}
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
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
