import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { bfs } from "../algorithms/bfs"; // Import BFS logic

// Dynamically import react-force-graph-2d
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

const GraphVisualization = ({ data, algorithm }) => {
  const fgRef = useRef();
  const [graphData, setGraphData] = useState(data);

  // Run the selected algorithm when it changes
  useEffect(() => {
    let traversalOrder;
    if (algorithm === "BFS") {
      traversalOrder = bfs(graphData, graphData.nodes[0]); // Start BFS from the first node
    }

    // If traversalOrder exists, update the graph to reflect it
    if (traversalOrder) {
      const updatedData = {
        ...graphData,
        nodes: graphData.nodes.map((node) => ({
          ...node,
          color: traversalOrder.find((n) => n.id === node.id) ? "red" : "blue", // Example coloring for BFS
        })),
      };
      setGraphData(updatedData);
    }
  }, [algorithm, data]);

  return (
    <ForceGraph2D ref={fgRef} graphData={graphData} nodeAutoColorBy="group" />
  );
};

export default GraphVisualization;
