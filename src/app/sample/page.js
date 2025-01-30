"use client";

import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const initialGraphState = {
  nodes: [
    { id: "S", x: 100, y: 300 }, // Source
    { id: "A", x: 300, y: 200 },
    { id: "B", x: 500, y: 200 },
    { id: "C", x: 300, y: 400 },
    { id: "D", x: 500, y: 400 },
    { id: "T", x: 700, y: 300 }, // Sink
  ],
  edges: [
    { source: "S", target: "A", capacity: 10, flow: 0 },
    { source: "S", target: "C", capacity: 8, flow: 0 },
    { source: "A", target: "B", capacity: 6, flow: 0 },
    { source: "A", target: "C", capacity: 4, flow: 0 },
    { source: "B", target: "T", capacity: 8, flow: 0 },
    { source: "C", target: "D", capacity: 9, flow: 0 },
    { source: "D", target: "B", capacity: 5, flow: 0 },
    { source: "D", target: "T", capacity: 10, flow: 0 },
  ],
  currentPath: [],
  maxFlow: 0,
  isRunning: false,
  stepDelay: 1000, // 1 second delay between steps
};

const FordFulkersonPage = () => {
  const [graphState, setGraphState] = useState(initialGraphState);
  const svgRef = useRef();

  // Helper function to find augmenting path using DFS
  const findPath = (source, sink, edges) => {
    const visited = new Set();
    const path = [];

    const dfs = (node) => {
      if (node === sink) return true;
      visited.add(node);

      for (const edge of edges) {
        if (edge.source === node && !visited.has(edge.target)) {
          const residualCapacity = edge.capacity - edge.flow;
          if (residualCapacity > 0) {
            path.push(edge.target);
            if (dfs(edge.target)) return true;
            path.pop();
          }
        }
        // Check reverse edges for residual capacity
        if (edge.target === node && !visited.has(edge.source)) {
          if (edge.flow > 0) {
            path.push(edge.source);
            if (dfs(edge.source)) return true;
            path.pop();
          }
        }
      }
      return false;
    };

    path.push(source);
    if (dfs(source)) return path;
    return null;
  };

  // Function to find minimum residual capacity along path
  const findMinResidualCapacity = (path, edges) => {
    let minCapacity = Infinity;

    for (let i = 0; i < path.length - 1; i++) {
      const current = path[i];
      const next = path[i + 1];

      const edge = edges.find(
        (e) =>
          (e.source === current && e.target === next) ||
          (e.source === next && e.target === current)
      );

      if (edge) {
        if (edge.source === current) {
          minCapacity = Math.min(minCapacity, edge.capacity - edge.flow);
        } else {
          minCapacity = Math.min(minCapacity, edge.flow);
        }
      }
    }

    return minCapacity;
  };

  // Function to update flow along path
  const augmentFlow = (path, minCapacity, edges) => {
    const newEdges = [...edges];

    for (let i = 0; i < path.length - 1; i++) {
      const current = path[i];
      const next = path[i + 1];

      const edge = newEdges.find(
        (e) =>
          (e.source === current && e.target === next) ||
          (e.source === next && e.target === current)
      );

      if (edge) {
        if (edge.source === current) {
          edge.flow += minCapacity;
        } else {
          edge.flow -= minCapacity;
        }
      }
    }

    return newEdges;
  };

  // Function to run one step of Ford-Fulkerson
  const runStep = async () => {
    const path = findPath("S", "T", graphState.edges);

    if (!path) {
      setGraphState((prev) => ({ ...prev, isRunning: false }));
      return false;
    }

    const minCapacity = findMinResidualCapacity(path, graphState.edges);
    const newEdges = augmentFlow(path, minCapacity, graphState.edges);

    const newMaxFlow = graphState.maxFlow + minCapacity;

    setGraphState((prev) => ({
      ...prev,
      edges: newEdges,
      currentPath: path,
      maxFlow: newMaxFlow,
    }));

    return true;
  };

  // Function to run the complete algorithm
  const runAlgorithm = async () => {
    setGraphState((prev) => ({ ...prev, isRunning: true }));

    let hasPath = true;
    while (hasPath) {
      hasPath = await runStep();
      if (hasPath) {
        await new Promise((resolve) =>
          setTimeout(resolve, graphState.stepDelay)
        );
      }
    }
  };

  // Reset function
  const resetGraph = () => {
    setGraphState({
      ...initialGraphState,
      edges: initialGraphState.edges.map((edge) => ({ ...edge, flow: 0 })),
    });
  };

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const nodeRadius = 25; // Define node radius for calculations

    // Set up SVG
    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    // Define arrow marker
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-10 -10 20 20")
      .attr("refX", nodeRadius + 9) // Adjusted refX to account for node radius
      .attr("refY", 0)
      .attr("markerWidth", 12)
      .attr("markerHeight", 12)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M-6.75,-6.75 L 0,0 L -6.75,6.75")
      .attr("fill", "#64748b");

    // Draw edges
    graphState.edges.forEach((edge) => {
      const source = graphState.nodes.find((n) => n.id === edge.source);
      const target = graphState.nodes.find((n) => n.id === edge.target);

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const angle = Math.atan2(dy, dx);

      const startX = source.x + nodeRadius * Math.cos(angle);
      const startY = source.y + nodeRadius * Math.sin(angle);
      const endX = target.x - nodeRadius * Math.cos(angle);
      const endY = target.y - nodeRadius * Math.sin(angle);

      // Check if edge is in current path
      const isInCurrentPath =
        graphState.currentPath?.length > 1 &&
        graphState.currentPath.some((node, i) => {
          if (i === graphState.currentPath.length - 1) return false;
          const nextNode = graphState.currentPath[i + 1];
          return (
            (edge.source === node && edge.target === nextNode) ||
            (edge.target === node && edge.source === nextNode)
          );
        });

      // Create edge group
      const edgeGroup = svg.append("g");

      // Draw the edge line - only yellow for current path, gray for everything else
      edgeGroup
        .append("path")
        .attr("d", `M${startX},${startY} L${endX},${endY}`)
        .attr("stroke", isInCurrentPath ? "#fbbf24" : "#64748b") // Yellow if in path, gray otherwise
        .attr("stroke-width", isInCurrentPath ? 3 : 2)
        .attr("fill", "none")
        .attr("marker-end", "url(#arrowhead)")
        .style("transition", "all 0.3s ease");

      // Add label group
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const offset = 15;
      const labelX = midX + offset * Math.cos(angle - Math.PI / 2);
      const labelY = midY + offset * Math.sin(angle - Math.PI / 2);

      const labelGroup = edgeGroup
        .append("g")
        .attr("transform", `translate(${labelX},${labelY})`);

      // Semi-transparent background for label
      labelGroup
        .append("rect")
        .attr("x", -15)
        .attr("y", -10)
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", "white")
        .attr("fill-opacity", 0.7)
        .attr("rx", 4);

      // Label text
      labelGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", isInCurrentPath ? "#854d0e" : "#1e293b") // Darker yellow for text if in path
        .attr("font-size", "14px")
        .attr("font-weight", isInCurrentPath ? "bold" : "normal")
        .text(`${edge.flow}/${edge.capacity}`);
    });

    // Draw nodes (on top of edges)
    const nodeGroups = svg
      .selectAll(".node")
      .data(graphState.nodes)
      .enter()
      .append("g")
      .attr("class", "node");

    // Node circles
    nodeGroups
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", nodeRadius)
      .attr("fill", (d) => {
        if (d.id === "S") return "#22c55e";
        if (d.id === "T") return "#ef4444";
        return "#ffffff";
      })
      .attr("stroke", (d) =>
        graphState.currentPath?.includes(d.id) ? "#fbbf24" : "#64748b"
      )
      .attr("stroke-width", (d) =>
        graphState.currentPath?.includes(d.id) ? 3 : 2
      );

    // Node labels
    nodeGroups
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", "#1e293b")
      .attr("font-size", "16px")
      .attr("font-weight", "bold")
      .text((d) => d.id);

    // Update legend with simplified scheme
    const legendItems = [
      { color: "#22c55e", label: "Source Node" },
      { color: "#ef4444", label: "Sink Node" },
      { color: "#ffffff", label: "Internal Node" },
      { color: "#fbbf24", label: "Current Path" },
    ];

    // Draw legend
    const legend = svg.append("g").attr("transform", "translate(20, 20)");

    legendItems.forEach((item, i) => {
      const g = legend.append("g").attr("transform", `translate(0, ${i * 25})`);

      g.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", item.color)
        .attr("stroke", "#64748b")
        .attr("stroke-width", 2);

      g.append("text")
        .attr("x", 30)
        .attr("y", 15)
        .attr("fill", "#1e293b")
        .text(item.label);
    });
  }, [graphState]);

  return (
    <main className="flex flex-col p-6 items-center justify-center min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Ford-Fulkerson Maximum Flow Graph
      </h1>

      <div className="w-full max-w-4xl">
        <div className="mb-6">
          <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
            <svg ref={svgRef} />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={runAlgorithm}
            disabled={graphState.isRunning}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {graphState.isRunning ? "Running..." : "Run Algorithm"}
          </button>

          <button
            onClick={resetGraph}
            disabled={graphState.isRunning}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:bg-gray-400"
          >
            Reset
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">
            Maximum Flow: {graphState.maxFlow}
          </p>
        </div>
      </div>
    </main>
  );
};

export default FordFulkersonPage;
