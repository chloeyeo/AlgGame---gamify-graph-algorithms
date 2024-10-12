"use client";

import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";

const GraphVisualisation = ({ graphState, onNodeClick }) => {
  const selectedAlgorithm = useSelector(
    (state) => state.algorithm.selectedAlgorithm
  );
  const pathname = usePathname();
  const svgRef = useRef(null);
  const isDijkstraPage = pathname.includes("dijkstras");
  const isAStarPage = pathname.includes("astar");
  const isKruskalsPage = pathname.includes("kruskals");

  useEffect(() => {
    if (!graphState) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

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

    // Draw edges
    const edgeGroups = svg
      .selectAll(".edge")
      .data(links)
      .enter()
      .append("g")
      .attr("class", "edge");

    edgeGroups
      .append("line")
      .attr("x1", (d) => nodes.find((n) => n.id === d.source).x)
      .attr("y1", (d) => nodes.find((n) => n.id === d.source).y)
      .attr("x2", (d) => nodes.find((n) => n.id === d.target).x)
      .attr("y2", (d) => nodes.find((n) => n.id === d.target).y)
      .attr("stroke", (d) => {
        if (isKruskalsPage) {
          return graphState.mstEdges.some(
            (e) =>
              (e.source === d.source && e.target === d.target) ||
              (e.source === d.target && e.target === d.source)
          )
            ? "red"
            : "black";
        }
        return "black";
      })
      .attr("stroke-width", (d) => {
        if (isKruskalsPage) {
          return graphState.mstEdges.some(
            (e) =>
              (e.source === d.source && e.target === d.target) ||
              (e.source === d.target && e.target === d.source)
          )
            ? 4
            : 2;
        }
        return 2;
      });

    // Add edge weights for Dijkstra's algorithm
    if (
      selectedAlgorithm === "Dijkstra's" ||
      isDijkstraPage ||
      selectedAlgorithm === "A*" ||
      isAStarPage ||
      selectedAlgorithm === "Kruskal's" ||
      isKruskalsPage
    ) {
      edgeGroups
        .append("text")
        .attr("class", "edge-weight")
        .attr(
          "x",
          (d) =>
            (nodes.find((n) => n.id === d.source).x +
              nodes.find((n) => n.id === d.target).x) /
            2
        )
        .attr(
          "y",
          (d) =>
            (nodes.find((n) => n.id === d.source).y +
              nodes.find((n) => n.id === d.target).y) /
              2 -
            10
        )
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text((d) => d.weight || d.distance || "")
        .attr("fill", "blue")
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .attr("dy", -5);
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
      .attr("r", 30)
      .attr("fill", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        return node && node.visited && !node.backtracked ? "blue" : "white";
      })
      .attr("stroke", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        if (d.id === graphState.currentNode) return "#2ecc71";
        if (node && node.backtracked) return "#e74c3c";
        return node && node.visited ? "blue" : "black";
      })
      .attr("stroke-width", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        return (node && node.backtracked) || d.id === graphState.currentNode
          ? 4
          : 2;
      });

    // Add node labels
    nodeGroups
      .append("text")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .text((d) => d.id)
      .attr("font-size", "18px")
      .attr("fill", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        return node && node.visited && !node.backtracked ? "white" : "black";
      });

    // Add distance labels for Dijkstra's algorithm
    if (selectedAlgorithm === "Dijkstra's" || isDijkstraPage) {
      nodeGroups
        .append("text")
        .attr("class", "distance-label")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y + 40)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text((d) => {
          const node = graphState.nodes.find((n) => n.id === d.id);
          return node.distance === Infinity ? "∞" : node.distance;
        })
        .attr("font-size", "20px")
        .attr("fill", "red")
        .attr("stroke", "white")
        .attr("stroke-width", "0.5px");
    }

    // Add A* specific labels
    if (selectedAlgorithm == "A*" || isAStarPage) {
      console.log("here in A*");
      console.log("selectedAlgorhtm: ", selectedAlgorithm);
      nodeGroups
        .append("text")
        .attr("class", "astar-label")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y + 45)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text((d) => {
          const node = graphState.nodes.find((n) => n.id === d.id);
          return `f: ${node.f === Infinity ? "∞" : node.f}, g: ${
            node.g === Infinity ? "∞" : node.g
          }, h: ${node.h === Infinity ? "∞" : node.h}`;
        })
        .attr("font-size", "18px")
        .attr("font-weight", "bold")
        .attr("fill", "red");
    }
  }, [graphState, selectedAlgorithm, onNodeClick]);

  return <svg ref={svgRef}></svg>;
};

export default GraphVisualisation;
