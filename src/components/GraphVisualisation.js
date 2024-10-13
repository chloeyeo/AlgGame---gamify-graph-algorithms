import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

const GraphVisualisation = ({ graphState, onNodeClick }) => {
  const selectedAlgorithm = useSelector(
    (state) => state.algorithm.selectedAlgorithm
  );
  const pathname = usePathname();
  const svgRef = useRef(null);
  const isDijkstraPage = pathname.includes("dijkstras");
  const isAStarPage = pathname.includes("astar");
  const isKruskalsPage = pathname.includes("kruskals");
  const isPrimsPage = pathname.includes("prims");

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

    const nodes = isPrimsPage
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

    edgeGroups.each(function (d) {
      const elem = d3.select(this);
      const sourceNode = nodes.find((n) => n.id === d.source);
      const targetNode = nodes.find((n) => n.id === d.target);

      if (
        isPrimsPage &&
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
            graphState.mstEdges.some(
              (e) =>
                (e.source === d.source && e.target === d.target) ||
                (e.source === d.target && e.target === d.source)
            )
              ? "red"
              : "black"
          )
          .attr("stroke-width", (d) =>
            graphState.mstEdges.some(
              (e) =>
                (e.source === d.source && e.target === d.target) ||
                (e.source === d.target && e.target === d.source)
            )
              ? 4
              : 2
          );
      } else {
        // Straight lines for other edges
        elem
          .append("line")
          .attr("x1", sourceNode.x)
          .attr("y1", sourceNode.y)
          .attr("x2", targetNode.x)
          .attr("y2", targetNode.y)
          .attr("stroke", (d) => {
            if (isKruskalsPage || isPrimsPage) {
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
            if (isKruskalsPage || isPrimsPage) {
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
      }
    });

    // Add edge weights
    if (
      selectedAlgorithm === "Dijkstra's" ||
      isDijkstraPage ||
      selectedAlgorithm === "A*" ||
      isAStarPage ||
      selectedAlgorithm === "Kruskal's" ||
      isKruskalsPage ||
      isPrimsPage
    ) {
      edgeGroups
        .append("text")
        .attr("class", "edge-weight")
        .attr("x", (d) => {
          const sourceNode = nodes.find((n) => n.id === d.source);
          const targetNode = nodes.find((n) => n.id === d.target);
          if (
            isPrimsPage &&
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
          if (
            isPrimsPage &&
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
    if (selectedAlgorithm === "A*" || isAStarPage) {
      nodeGroups.each(function (d) {
        const node = graphState.nodes.find((n) => n.id === d.id);
        if (node) {
          const fValue = node.f;
          const gValue = node.g;
          const hValue = node.h;

          if (
            fValue !== undefined ||
            gValue !== undefined ||
            hValue !== undefined
          ) {
            d3.select(this)
              .append("text")
              .attr("class", "astar-label")
              .attr("x", d.x)
              .attr("y", d.y + 45)
              .attr("text-anchor", "middle")
              .attr("dominant-baseline", "middle")
              .text(
                `f: ${fValue === Infinity ? "∞" : fValue}, g: ${
                  gValue === Infinity ? "∞" : gValue
                }, h: ${hValue === Infinity ? "∞" : hValue}`.trim()
              )
              .attr("font-size", "18px")
              .attr("font-weight", "bold")
              .attr("fill", "red");
          }
        }
      });
    }
  }, [graphState, selectedAlgorithm, onNodeClick]);

  return <svg ref={svgRef}></svg>;
};

export default GraphVisualisation;
