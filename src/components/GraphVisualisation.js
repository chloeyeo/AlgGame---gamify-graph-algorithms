import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const GraphVisualisation = ({ graphState, onNodeClick, mode }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!graphState) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous rendering

    svg
      .attr("viewBox", "0 -20 600 600")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("width", "100%")
      .attr("height", "100%");

    const nodes = [
      { id: "A", x: 300, y: 50 },
      { id: "B", x: 200, y: 200 },
      { id: "C", x: 400, y: 200 },
      { id: "D", x: 130, y: 350 },
      { id: "E", x: 270, y: 350 },
      { id: "F", x: 470, y: 350 },
      { id: "G", x: 80, y: 500 },
    ];

    const links = graphState.edges;

    // Draw links
    svg
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("x1", (d) => nodes.find((n) => n.id === d.source).x)
      .attr("y1", (d) => nodes.find((n) => n.id === d.source).y)
      .attr("x2", (d) => nodes.find((n) => n.id === d.target).x)
      .attr("y2", (d) => nodes.find((n) => n.id === d.target).y)
      .attr("stroke", "black")
      .attr("stroke-width", 3);

    // Draw nodes
    const circles = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 30)
      .attr("fill", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        return node && node.visited && !node.backtracked ? "blue" : "white";
      })
      .attr("stroke", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        if (d.id === graphState.currentNode) return "#2ecc71"; // Green for current node
        if (node && node.backtracked) return "#e74c3c"; // Red for backtracked nodes
        return node && node.visited ? "blue" : "black"; // Blue for visited, black for unvisited
      })
      .attr("stroke-width", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        return (node && node.backtracked) || d.id === graphState.currentNode
          ? 4
          : 2;
      });

    // Add labels
    svg
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text((d) => d.id)
      .style("font-size", "18px")
      .style("fill", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        return node && node.visited && !node.backtracked ? "white" : "black";
      });

    // Add click event listeners for both game and education modes
    circles.on("click", (event, d) => {
      if (onNodeClick) {
        onNodeClick(d.id);
      }
    });
  }, [graphState, mode, onNodeClick]);

  return <svg ref={svgRef} />;
};

export default GraphVisualisation;
