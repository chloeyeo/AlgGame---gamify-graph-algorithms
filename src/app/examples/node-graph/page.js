"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Node from "@/models/Node";

const generateRandomGraph = (nodeCount = 7) => {
  const nodes = [];
  const edges = [];
  const width = 400;
  const height = 400;

  // Create nodes with random initial positions
  for (let i = 0; i < nodeCount; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * 150;
    nodes.push(
      new Node({
        id: String.fromCharCode(65 + i),
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
        visited: false,
        distance: i === 0 ? 0 : Infinity,
        recentlyUpdated: false,
      })
    );
  }

  // Randomly connect nodes (ensuring connectivity)
  const unconnectedNodes = new Set(nodes.slice(1).map((n) => n.id));
  const connectedNodes = new Set([nodes[0].id]);

  // First ensure the graph is connected
  while (unconnectedNodes.size > 0) {
    const sourceId =
      Array.from(connectedNodes)[
        Math.floor(Math.random() * connectedNodes.size)
      ];
    const targetId =
      Array.from(unconnectedNodes)[
        Math.floor(Math.random() * unconnectedNodes.size)
      ];

    const source = nodes.find((n) => n.id === sourceId);
    const target = nodes.find((n) => n.id === targetId);

    const weight = Math.floor(Math.random() * 9) + 1;
    edges.push({ source, target, weight });
    source.addAdjacentNode(target.id);

    unconnectedNodes.delete(targetId);
    connectedNodes.add(targetId);
  }

  // Add some random additional edges
  const maxExtra = (nodeCount * (nodeCount - 1)) / 2 - (nodeCount - 1);
  const extraEdges = Math.floor(Math.random() * maxExtra);

  for (let i = 0; i < extraEdges; i++) {
    const sourceIndex = Math.floor(Math.random() * nodes.length);
    const targetIndex = Math.floor(Math.random() * nodes.length);

    if (sourceIndex !== targetIndex) {
      const source = nodes[sourceIndex];
      const target = nodes[targetIndex];

      const edgeExists = edges.some(
        (e) =>
          (e.source === source && e.target === target) ||
          (e.source === target && e.target === source)
      );

      if (!edgeExists) {
        const weight = Math.floor(Math.random() * 9) + 1;
        edges.push({ source, target, weight });
        source.addAdjacentNode(target.id);
      }
    }
  }

  return { nodes, edges };
};

const ExampleNodeGraph = () => {
  const svgRef = useRef(null);
  const [graph, setGraph] = useState(null);
  const [nodeCount, setNodeCount] = useState(7);

  const regenerateGraph = () => {
    const newGraph = generateRandomGraph(nodeCount);
    setGraph(newGraph);
  };

  useEffect(() => {
    if (!graph) {
      regenerateGraph();
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 400;
    const height = 400;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    // Create force simulation
    const simulation = d3
      .forceSimulation(graph.nodes)
      .force(
        "link",
        d3.forceLink(graph.edges).distance(() => Math.random() * 100 + 50)
      )
      .force(
        "charge",
        d3.forceManyBody().strength(() => Math.random() * -1000 - 500)
      )
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    // Draw edges
    const edges = svg.selectAll(".edge").data(graph.edges).enter().append("g");

    const lines = edges
      .append("line")
      .attr("stroke", "#64748b")
      .attr("stroke-width", 2);

    // Add weight labels
    const labels = edges
      .append("text")
      .attr("fill", "#64748b")
      .attr("text-anchor", "middle")
      .attr("dy", -5)
      .text((d) => d.weight);

    // Draw nodes
    const nodes = svg
      .selectAll(".node")
      .data(graph.nodes)
      .enter()
      .append("g")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    nodes
      .append("circle")
      .attr("r", 20)
      .attr("fill", "#fff")
      .attr("stroke", "#64748b")
      .attr("stroke-width", 2);

    nodes
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .text((d) => d.id);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      lines
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      labels
        .attr("x", (d) => (d.source.x + d.target.x) / 2)
        .attr("y", (d) => (d.source.y + d.target.y) / 2);

      nodes.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
  }, [graph]);

  return (
    <div className="w-full min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Random Graph Generator</h1>
      <div className="flex gap-4 mb-8">
        <input
          type="number"
          min="3"
          max="26"
          value={nodeCount}
          onChange={(e) =>
            setNodeCount(
              Math.min(26, Math.max(3, parseInt(e.target.value) || 3))
            )
          }
          className="px-4 py-2 border rounded"
        />
        <button
          onClick={regenerateGraph}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate New Graph
        </button>
      </div>
      <div className="border rounded-lg p-4">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default ExampleNodeGraph;
