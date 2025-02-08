"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedAlgorithm } from "@/store/slices/algorithmSlice";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ModeToggle from "@/components/ModeToggle";
import NotFoundPage from "@/components/NotFoundPage";
import ChatBot from "@/components/ChatBot";

export default function LayoutContent({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const validPaths = [
    "/",
    "/about",
    "/education/traversal/dfs",
    "/game/traversal/dfs",
    "/education/traversal/bfs",
    "/game/traversal/bfs",
    "/education/shortest-path/dijkstras",
    "/game/shortest-path/dijkstras",
    "/education/shortest-path/astar",
    "/game/shortest-path/astar",
    "/education/minimum-spanning-tree/kruskals",
    "/game/minimum-spanning-tree/kruskals",
    "/education/minimum-spanning-tree/prims",
    "/game/minimum-spanning-tree/prims",
    "/education/network-flow/ford-fulkerson",
    "/game/network-flow/ford-fulkerson",
    // "/education/matching/hungarian-kuhn-munkres",
    // "/game/matching/hungarian-kuhn-munkres",
    "/auth",
    "/myaccount",
    "/leaderboard",
    "/examples/node-graph",
    "/sample",
  ];

  const pageExists = validPaths.includes(pathname);

  const selectedAlgorithm = useSelector(
    (state) => state.algorithm.selectedAlgorithm
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAlgorithmSelect = (algorithm) => {
    dispatch(setSelectedAlgorithm(algorithm));
    setIsSidebarOpen(false);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    if (!pageExists) {
      return <NotFoundPage />;
    }
    return children;
  };

  const handleModeToggle = () => {
    const currentPath = pathname;
    const isEducationMode = currentPath.includes("/education/");
    const isGameMode = currentPath.includes("/game/");

    let newPath;
    if (isEducationMode) {
      newPath = currentPath.replace("/education/", "/game/");
    } else if (isGameMode) {
      newPath = currentPath.replace("/game/", "/education/");
    }

    if (validPaths.includes(newPath)) {
      router.push(newPath);
    } else {
      // Redirect to the NotFoundPage route
      router.push("/not-found");
    }
  };

  return (
    <>
      <header className="fixed top-0 w-screen z-50">
        <div className="w-full max-w-[576px] mx-auto">
          <Header toggleSidebar={toggleSidebar} />
        </div>
      </header>
      <div className="relative flex-grow overflow-hidden pt-16 sm:pt-20">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          onAlgorithmSelect={handleAlgorithmSelect}
          selectedAlgorithm={selectedAlgorithm}
        />
        <ModeToggle onToggle={handleModeToggle} validPaths={validPaths} />
        {renderContent()}
      </div>
      <ChatBot />
      {isSidebarOpen && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 z-20"
          onClick={handleSidebarClose}
        ></div>
      )}
    </>
  );
}
