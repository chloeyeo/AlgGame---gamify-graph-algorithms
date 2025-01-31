"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const NODE_TYPES = {
  SOURCE: { color: "#22c55e" }, // Green
  SINK: { color: "#ef4444" }, // Red
  NORMAL: { color: "#ffffff" }, // White
};

const EDGE_TYPES = {
  CURRENT_PATH: { color: "#fbbf24" }, // Yellow
  CURRENT_EDGE: { color: "#ec4899" }, // Pink
  NORMAL: { color: "#64748b" }, // Gray
};

const NetworkFlowGraph = ({ graphState }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const nodeRadius = 25;

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    // Arrow marker definition
    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-10 -10 20 20")
      .attr("refX", nodeRadius + 9)
      .attr("refY", 0)
      .attr("markerWidth", 12)
      .attr("markerHeight", 12)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M-6.75,-6.75 L 0,0 L -6.75,6.75")
      .attr("fill", EDGE_TYPES.NORMAL.color);

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

      // Edge styling
      let edgeColor = EDGE_TYPES.NORMAL.color;
      let edgeWidth = 2;

      if (edge.highlight) {
        edgeColor = edge.color || EDGE_TYPES.CURRENT_PATH.color;
        edgeWidth = 3;
      }

      // Create edge group
      const edgeGroup = svg.append("g");

      // Draw edge line
      edgeGroup
        .append("path")
        .attr("d", `M${startX},${startY} L${endX},${endY}`)
        .attr("stroke", edgeColor)
        .attr("stroke-width", edgeWidth)
        .attr("fill", "none")
        .attr("marker-end", "url(#arrowhead)")
        .style("transition", "all 0.3s ease");

      // Add flow/capacity label
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      const offset = 15;
      const labelX = midX + offset * Math.cos(angle - Math.PI / 2);
      const labelY = midY + offset * Math.sin(angle - Math.PI / 2);

      const labelGroup = edgeGroup
        .append("g")
        .attr("transform", `translate(${labelX},${labelY})`);

      // Label background
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
        .attr("fill", edge.highlight ? "#854d0e" : "#1e293b")
        .attr("font-size", "14px")
        .attr("font-weight", edge.highlight ? "bold" : "normal")
        .text(`${edge.flow}/${edge.capacity}`);
    });

    // Draw nodes
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
        if (d.id === "S") return NODE_TYPES.SOURCE.color;
        if (d.id === "T") return NODE_TYPES.SINK.color;
        return NODE_TYPES.NORMAL.color;
      })
      .attr("stroke", (d) =>
        d.highlight ? EDGE_TYPES.CURRENT_PATH.color : EDGE_TYPES.NORMAL.color
      )
      .attr("stroke-width", (d) => (d.highlight ? 3 : 2));

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

    // Add legend
    const legendItems = [
      { color: NODE_TYPES.SOURCE.color, label: "Source Node" },
      { color: NODE_TYPES.SINK.color, label: "Sink Node" },
      { color: NODE_TYPES.NORMAL.color, label: "Internal Node" },
      { color: EDGE_TYPES.CURRENT_PATH.color, label: "Current Path" },
      { color: EDGE_TYPES.CURRENT_EDGE.color, label: "Current Edge" },
    ];

    const legend = svg.append("g").attr("transform", "translate(20, 20)");

    legendItems.forEach((item, i) => {
      const g = legend.append("g").attr("transform", `translate(0, ${i * 25})`);

      g.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", item.color)
        .attr("stroke", EDGE_TYPES.NORMAL.color)
        .attr("stroke-width", 2);

      g.append("text")
        .attr("x", 30)
        .attr("y", 15)
        .attr("fill", "#1e293b")
        .text(item.label);
    });
  }, [graphState]);

  return <svg ref={svgRef} />;
};

export default NetworkFlowGraph;
