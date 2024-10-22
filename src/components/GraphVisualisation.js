import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

const GraphVisualisation = ({ graphState, onNodeClick, isGraphA }) => {
  const selectedAlgorithm = useSelector(
    (state) => state.algorithm.selectedAlgorithm
  );
  const pathname = usePathname();
  const svgRef = useRef(null);
  const isDijkstraPage = pathname.includes("dijkstras");
  const isAStarPage = pathname.includes("astar");
  const isKruskalsPage = pathname.includes("kruskals");
  const isPrimsPage = pathname.includes("prims");

  // Color constants
  const COLORS = {
    CURRENT_NODE: "#2ecc71",
    VISITED_NODE: "#3498db",
    UPDATED_NODE: "#ff69b4",
    UNVISITED_NODE: "#ffffff",
    UNVISITED_BORDER: "#e74c3c",
    EDGE_NORMAL: "#95a5a6",
    EDGE_MST: "#e74c3c",
    EDGE_WEIGHT: "#2980b9",
    NODE_TEXT_VISITED: "#ffffff",
    NODE_TEXT_UNVISITED: "#2c3e50",
    DISTANCE_LABEL: "#e74c3c",
  };

  useEffect(() => {
    if (!graphState) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("viewBox", "0 -20 600 600")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("width", "100%")
      .attr("height", "100%");

    const allNodes = [
      { id: "A", x: 300, y: 50 },
      { id: "B", x: 200, y: 200 },
      { id: "C", x: 400, y: 200 },
      { id: "D", x: 130, y: 350 },
      { id: "E", x: 270, y: 350 },
      { id: "F", x: 470, y: 350 },
      { id: "G", x: 80, y: 500 },
    ];

    const nodes =
      (isPrimsPage || isKruskalsPage) && isGraphA
        ? allNodes.filter((node) => node.id !== "G")
        : allNodes;

    const links = graphState.edges;

    // Draw edges
    const edgeGroups = svg
      .selectAll(".edge")
      .data(links)
      .enter()
      .append("g")
      .attr("class", "edge");

    // Function to determine if edge is part of MST or current path
    const isActiveEdge = (d) => {
      if (isKruskalsPage || isPrimsPage) {
        return graphState.mstEdges.some(
          (e) =>
            (e.source === d.source && e.target === d.target) ||
            (e.source === d.target && e.target === d.source)
        );
      }
      return false;
    };

    edgeGroups.each(function (d) {
      const elem = d3.select(this);
      const sourceNode = nodes.find((n) => n.id === d.source);
      const targetNode = nodes.find((n) => n.id === d.target);

      if (!sourceNode || !targetNode) return;

      if (
        (isPrimsPage || isKruskalsPage) &&
        ((d.source === "A" && d.target === "F") ||
          (d.source === "F" && d.target === "A"))
      ) {
        // Create a curved path for A-F edge in Prim's algorithm
        const midX = (sourceNode.x + targetNode.x) / 2;
        const midY = (sourceNode.y + targetNode.y) / 2 - 300;

        elem
          .append("path")
          .attr(
            "d",
            `M${sourceNode.x},${sourceNode.y} Q${midX},${midY} ${targetNode.x},${targetNode.y}`
          )
          .attr("fill", "none")
          .attr("stroke", (d) =>
            isActiveEdge(d) ? COLORS.EDGE_MST : COLORS.EDGE_NORMAL
          )
          .attr("stroke-width", (d) => (isActiveEdge(d) ? 4 : 1))
          .attr("opacity", (d) => (isActiveEdge(d) ? 1 : 0.3));
      } else {
        // Straight lines for other edges
        elem
          .append("line")
          .attr("x1", sourceNode.x)
          .attr("y1", sourceNode.y)
          .attr("x2", targetNode.x)
          .attr("y2", targetNode.y)
          .attr("stroke", (d) =>
            isActiveEdge(d) ? COLORS.EDGE_MST : COLORS.EDGE_NORMAL
          )
          .attr("stroke-width", (d) => (isActiveEdge(d) ? 6 : 3))
          .attr("opacity", (d) => (isActiveEdge(d) ? 1 : 0.4));
      }
    });

    // Add edge weight labels
    if (isDijkstraPage || isAStarPage || isKruskalsPage || isPrimsPage) {
      edgeGroups
        .append("text")
        .attr("class", "edge-weight")
        .attr("x", (d) => {
          const sourceNode = nodes.find((n) => n.id === d.source);
          const targetNode = nodes.find((n) => n.id === d.target);
          if (!sourceNode || !targetNode) return 0;
          if (
            (isPrimsPage || isKruskalsPage) &&
            ((d.source === "A" && d.target === "F") ||
              (d.source === "F" && d.target === "A"))
          ) {
            return (sourceNode.x + targetNode.x) / 2;
          }
          return (sourceNode.x + targetNode.x) / 2;
        })
        .attr("y", (d) => {
          const sourceNode = nodes.find((n) => n.id === d.source);
          const targetNode = nodes.find((n) => n.id === d.target);
          if (!sourceNode || !targetNode) return 0;
          if (
            (isPrimsPage || isKruskalsPage) &&
            ((d.source === "A" && d.target === "F") ||
              (d.source === "F" && d.target === "A"))
          ) {
            return (sourceNode.y + targetNode.y) / 2 - 120;
          }
          return (sourceNode.y + targetNode.y) / 2 - 10;
        })
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text((d) => d.weight || d.distance || "")
        .attr("fill", COLORS.EDGE_WEIGHT)
        .attr("font-size", "15px")
        .attr("font-weight", "bold")
        .attr("dy", -5)
        .attr("stroke", "white")
        .attr("stroke-width", "10px")
        .attr("paint-order", "stroke");
    }

    // Draw nodes
    const nodeGroups = svg
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .on("click", (event, d) => {
        if (onNodeClick) {
          onNodeClick(d.id);
        }
      });

    nodeGroups
      .append("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", 35)
      .attr("fill", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        if (d.id === graphState.currentNode) return COLORS.CURRENT_NODE;
        if (node && node.visited) return COLORS.VISITED_NODE;
        if (node && node.recentlyUpdated) return COLORS.UPDATED_NODE;
        return COLORS.UNVISITED_NODE;
      })
      .attr("stroke", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        if (d.id === graphState.currentNode) return COLORS.CURRENT_NODE;
        if (node && node.visited) return COLORS.VISITED_NODE;
        return COLORS.UNVISITED_BORDER;
      })
      .attr("stroke-width", 3)
      .style("cursor", "pointer")
      .style("transition", "all 0.3s ease");

    // Enhanced node labels
    nodeGroups
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text((d) => d.id)
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .attr("fill", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        return node && node.visited
          ? COLORS.NODE_TEXT_VISITED
          : COLORS.NODE_TEXT_UNVISITED;
      });

    // Enhanced distance labels for Dijkstra's algorithm
    if (isDijkstraPage) {
      nodeGroups
        .append("text")
        .attr("class", "distance-label")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y + 47)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text((d) => {
          const node = graphState.nodes.find((n) => n.id === d.id);
          return node.distance === Infinity ? "∞" : node.distance;
        })
        .attr("font-size", "20px")
        .attr("fill", COLORS.DISTANCE_LABEL)
        .attr("stroke", "white")
        .attr("stroke-width", "0.5px")
        .attr("paint-order", "stroke");
    }

    // Enhanced A* labels
    if (isAStarPage) {
      nodeGroups.each(function (d) {
        const node = graphState.nodes.find((n) => n.id === d.id);
        if (
          node &&
          (node.f !== undefined || node.g !== undefined || node.h !== undefined)
        ) {
          d3.select(this)
            .append("text")
            .attr("class", "astar-label")
            .attr("x", d.x)
            .attr("y", d.y + 45)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .text(
              `f=${node.f === Infinity ? "∞" : node.f}
               g=${node.g === Infinity ? "∞" : node.g}
               h=${node.h === Infinity ? "∞" : node.h}`.trim()
            )
            .attr("font-size", "16px")
            .attr("font-weight", "bold")
            .attr("fill", COLORS.DISTANCE_LABEL)
            .attr("stroke", "white")
            .attr("stroke-width", "1px")
            .attr("paint-order", "stroke");
        }
      });
    }
  }, [graphState, isGraphA, selectedAlgorithm, onNodeClick]);

  return <svg ref={svgRef}></svg>;
};

export default GraphVisualisation;
