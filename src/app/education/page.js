"use client";

import Image from "next/image";
import GraphVisualisation from "@/components/GraphVisualisation";
import { useSelector } from "react-redux";

export default function EducationPage() {
  const selectedMode = useSelector((state) => state.algorithm.selectedMode);
  const selectedAlgorithm = useSelector(
    (state) => state.algorithm.selectedAlgorithm
  );
  return (
    <main className="flex flex-col p-4 pt-8 items-center justify-center overflow-y-auto no-scrollbar">
      <div className="flex-grow">
        {/* Graph Visualisation Section */}
        <div className="mb-6">
          <h2 className="text-xl mb-2 font-semibold">Graph Visualisation</h2>
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
  );
}
