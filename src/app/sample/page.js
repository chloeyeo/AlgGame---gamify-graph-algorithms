"use client";

import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const generateRandomGraph = (nodeCount = 6, edgeDensity = 0.4) => {
  // Create nodes
  const nodes = [];
  const width = 800;
  const height = 600;
  const padding = 100; // Padding from edges

  // Always include source (S) and sink (T)
  nodes.push({ id: "S", x: padding, y: height / 2 });
  nodes.push({ id: "T", x: width - padding, y: height / 2 });

  // Generate other nodes with letters (A, B, C, ...)
  for (let i = 0; i < nodeCount - 2; i++) {
    nodes.push({
      id: String.fromCharCode(65 + i), // A, B, C, ...
      x: padding + ((width - 2 * padding) / (nodeCount - 1)) * (i + 1),
      y: padding + Math.random() * (height - 2 * padding),
    });
  }

  // Generate edges
  const edges = [];
  const maxCapacity = 15;

  // Helper function to add edge if it doesn't exist
  const addEdge = (source, target) => {
    if (
      !edges.some(
        (e) =>
          (e.source === source && e.target === target) ||
          (e.source === target && e.target === source)
      )
    ) {
      edges.push({
        source,
        target,
        capacity: Math.floor(Math.random() * maxCapacity) + 1,
        flow: 0,
      });
    }
  };

  // Ensure path from source to sink exists
  let current = "S";
  const visited = new Set([current]);

  while (current !== "T") {
    const availableNodes = nodes
      .filter((n) => !visited.has(n.id) && n.id !== "S")
      .sort(() => Math.random() - 0.5);

    const next = availableNodes[0].id;
    addEdge(current, next);
    visited.add(next);
    current = next;
  }

  // Add random additional edges based on density
  nodes.forEach((node1) => {
    nodes.forEach((node2) => {
      if (node1.id !== node2.id && Math.random() < edgeDensity) {
        // Prevent backwards flow to source and forward flow from sink
        if (node2.id !== "S" && node1.id !== "T") {
          addEdge(node1.id, node2.id);
        }
      }
    });
  });

  return { nodes, edges };
};

const FordFulkersonPage = () => {
  const [nodeCount, setNodeCount] = useState(6);
  const [graphState, setGraphState] = useState(() => ({
    ...generateRandomGraph(nodeCount),
    currentPath: null,
    currentEdgeIndex: -1,
    maxFlow: 0,
    isRunning: false,
    stepDelay: 1000,
  }));
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

    // First highlight the full path
    setGraphState((prev) => ({
      ...prev,
      currentPath: path,
      currentEdgeIndex: -1,
    }));

    await new Promise((resolve) =>
      setTimeout(resolve, graphState.stepDelay / 2)
    );

    const minCapacity = findMinResidualCapacity(path, graphState.edges);

    // Update edges one by one
    for (let i = 0; i < path.length - 1; i++) {
      const newEdges = [...graphState.edges];
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

      setGraphState((prev) => ({
        ...prev,
        edges: newEdges,
        currentEdgeIndex: i,
        maxFlow:
          i === path.length - 2 ? prev.maxFlow + minCapacity : prev.maxFlow,
      }));

      await new Promise((resolve) =>
        setTimeout(resolve, graphState.stepDelay / 2)
      );
    }

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
    setGraphState((prev) => ({
      ...generateRandomGraph(nodeCount),
      currentPath: null,
      currentEdgeIndex: -1,
      maxFlow: 0,
      isRunning: false,
      stepDelay: prev.stepDelay,
    }));
  };

  // Add new function to handle regeneration
  const regenerateGraph = () => {
    setGraphState((prev) => ({
      ...generateRandomGraph(nodeCount),
      currentPath: null,
      currentEdgeIndex: -1,
      maxFlow: 0,
      isRunning: false,
      stepDelay: prev.stepDelay,
    }));
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

      // Check if edge is in current path and get its index
      const pathIndex = graphState.currentPath
        ? graphState.currentPath.findIndex((node, i) => {
            if (i === graphState.currentPath.length - 1) return false;
            const nextNode = graphState.currentPath[i + 1];
            return (
              (edge.source === node && edge.target === nextNode) ||
              (edge.target === node && edge.source === nextNode)
            );
          })
        : -1;

      // Simplified edge color logic
      let edgeColor = "#64748b"; // Default gray
      let edgeWidth = 2;

      if (pathIndex !== -1) {
        // Edge is in current path
        if (pathIndex === graphState.currentEdgeIndex) {
          edgeColor = "#ec4899"; // Pink for current edge
        } else {
          edgeColor = "#fbbf24"; // Yellow for path edges
        }
        edgeWidth = 3;
      }

      // Create edge group
      const edgeGroup = svg.append("g");

      // Draw the edge line
      edgeGroup
        .append("path")
        .attr("d", `M${startX},${startY} L${endX},${endY}`)
        .attr("stroke", edgeColor)
        .attr("stroke-width", edgeWidth)
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

      // Simplified text color logic
      let textColor = "#1e293b"; // Default dark gray
      if (pathIndex !== -1) {
        if (pathIndex === graphState.currentEdgeIndex) {
          textColor = "#be185d"; // Dark pink for current edge
        } else {
          textColor = "#854d0e"; // Dark yellow for path edges
        }
      }

      // Label text
      labelGroup
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", textColor)
        .attr("font-size", "14px")
        .attr("font-weight", pathIndex !== -1 ? "bold" : "normal")
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
      { color: "#ec4899", label: "Current Edge", isLine: true },
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
        <div className="mb-4 flex justify-center items-center gap-4">
          <label className="flex items-center gap-2">
            Number of Nodes:
            <input
              type="number"
              min="3"
              max="10"
              value={nodeCount}
              onChange={(e) => {
                const value = Math.min(
                  10,
                  Math.max(3, parseInt(e.target.value) || 3)
                );
                setNodeCount(value);
              }}
              disabled={graphState.isRunning}
              className="w-20 px-2 py-1 border border-gray-300 rounded-md"
            />
          </label>
        </div>

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

          <button
            onClick={regenerateGraph}
            disabled={graphState.isRunning}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
          >
            Generate New Graph
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
