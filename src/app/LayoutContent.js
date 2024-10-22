"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedMode,
  setSelectedAlgorithm,
} from "@/store/slices/algorithmSlice";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import NotFoundPage from "@/components/NotFoundPage";
import ChatBot from "@/components/ChatBot";

export default function LayoutContent({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [missingSelection, setMissingSelection] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  const validPaths = [
    "/",
    "/about",
    "/education",
    "/game",
    "/education/traversal/dfs",
    "/game/traversal/dfs",
    "/education/traversal/bfs",
    "/game/traversal/bfs",
    "/education/shortest-path/dijkstras",
    "/education/shortest-path/astar",
    "/education/minimum-spanning-tree/kruskals",
    "/education/minimum-spanning-tree/prims",
    // "/education/network-flow/edmonds-karp",
    // "/education/network-flow/fold-fulkerson",
    // "/education/matching/hungarian",
  ];

  const pageExists = validPaths.includes(pathname);

  const dispatch = useDispatch();
  const selectedMode = useSelector((state) => state.algorithm.selectedMode);
  const selectedAlgorithm = useSelector(
    (state) => state.algorithm.selectedAlgorithm
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleModeSelect = (mode) => {
    dispatch(setSelectedMode(mode));
    if (selectedAlgorithm && mode === "Education") {
      router.push("/education");
    } else if (selectedAlgorithm && mode === "Game") {
      router.push("/game");
    }

    if (selectedAlgorithm) {
      setIsSidebarOpen(false);
    }
  };

  const handleAlgorithmSelect = (algorithm) => {
    dispatch(setSelectedAlgorithm(algorithm));
    if (selectedMode && selectedMode === "Education") {
      router.push("/education");
    } else if (selectedMode && selectedMode === "Game") {
      router.push("/game");
    }
    if (selectedMode) {
      setIsSidebarOpen(false);
    }
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
    if (!selectedMode && !selectedAlgorithm) {
      return;
    }
    setTimeout(() => {
      if (!selectedMode || !selectedAlgorithm) {
        setMissingSelection(selectedMode ? "mode" : "algorithm");
        setIsModalOpen(true);
      }
    }, 300);
  };

  return (
    <>
      <header className="fixed top-0 w-screen z-50">
        <div className="sm:max-w-[576px] sm:mx-auto">
          <Header toggleSidebar={toggleSidebar} />
        </div>
      </header>
      <div className="relative flex-grow overflow-hidden py-[10%]">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          onModeSelect={handleModeSelect}
          onAlgorithmSelect={handleAlgorithmSelect}
          selectedMode={selectedMode}
          selectedAlgorithm={selectedAlgorithm}
        />
        {pageExists ? children : <NotFoundPage />}
      </div>
      <footer className="fixed bottom-0 w-screen z-50">
        <div className="sm:max-w-[576px] sm:mx-auto">
          <Footer />
        </div>
      </footer>
      <ChatBot />
      {isSidebarOpen && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 z-20"
          onClick={handleSidebarClose}
        ></div>
      )}
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          missingSelection={missingSelection}
        />
      )}
    </>
  );
}
