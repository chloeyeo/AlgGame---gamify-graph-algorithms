import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { useAlgorithmType } from "@/hooks/useAlgorithmType";
import { COLORS } from "@/constants/colors";
import { useGraphDimensions } from "@/hooks/useGraphDimensions";
import Legend from "./Legend/Legend";

const GraphVisualisation = ({ graphState, onNodeClick, isGraphA }) => {
  const selectedAlgorithm = useSelector(
    (state) => state.algorithm.selectedAlgorithm
  );
  const svgRef = useRef(null);
  const {
    isAStarPage,
    isDFSPage,
    isDijkstraPage,
    isEdmondsKarpPage,
    isFordFulkersonPage,
    isKruskalsPage,
    isPrimsPage,
  } = useAlgorithmType();

  useEffect(() => {
    if (!graphState) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { viewBoxWidth, viewBoxHeight } = useGraphDimensions(
      isEdmondsKarpPage,
      isFordFulkersonPage,
      isKruskalsPage
    );

    svg
      .attr("viewBox", `0 -20 ${viewBoxWidth} ${viewBoxHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("width", "100%")
      .attr("height", "100%");

    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", "translate(20, 20)");

    const getLegendItems = () => {
      let commonItems = [];

      // Only add Current Node for non-Kruskal's and non-Prim's algorithms
      if (!isKruskalsPage && !isPrimsPage) {
        commonItems.push({ color: COLORS.CURRENT_NODE, text: "Current Node" });
      }

      // Add other common items
      commonItems.push(
        { color: COLORS.VISITED_NODE, text: "Visited Node" },
        {
          isUnvisited: true,
          text: "Unvisited Node",
        }
      );

      if (isFordFulkersonPage || isEdmondsKarpPage) {
        commonItems = [
          { color: COLORS.SOURCE_NODE, text: "Source Node" },
          { color: COLORS.SINK_NODE, text: "Sink Node" },
          { color: COLORS.FLOW_PATH, text: "Current Flow Path" },
          { isText: true, text: "Edge numbers show flow/capacity" },
        ];
      }

      if (isDFSPage) {
        commonItems.push({
          color: COLORS.BACKTRACKED_NODE,
          text: "Backtracked Node",
        });
      }

      if (isDijkstraPage || isAStarPage) {
        commonItems.push({
          color: COLORS.UPDATED_NODE,
          text: "Recently Updated Node",
        });
      }

      if (isKruskalsPage || isPrimsPage) {
        commonItems.push({ color: COLORS.EDGE_MST, text: "MST Edge" });
      }

      if (isDijkstraPage || isAStarPage || isKruskalsPage || isPrimsPage) {
        commonItems.push({
          isText: true,
          text: "Edge numbers represent weights",
        });
      }

      if (isDijkstraPage) {
        commonItems.push({
          isText: true,
          text: "Node values show shortest distance from start",
        });
      }

      if (isAStarPage) {
        commonItems.push({
          isText: true,
          text: "Node values show f, g, and h costs",
        });
      }

      return commonItems;
    };

    const legendItems = getLegendItems();

    legendItems.forEach((item, i) => {
      const legendItem = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 25})`);

      if (item.isText) {
        legendItem
          .append("text")
          .attr("x", 0)
          .attr("y", 15)
          .text(item.text)
          .attr("fill", "#000")
          .attr("font-size", "12px")
          .attr("font-style", "italic");
      } else if (item.isUnvisited) {
        // outer black box
        legendItem
          .append("rect")
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", "none")
          .attr("stroke", "#000")
          .attr("stroke-width", 1);

        // Add inner white rectangle with red border
        legendItem
          .append("rect")
          .attr("x", 2)
          .attr("y", 2)
          .attr("width", 16)
          .attr("height", 16)
          .attr("fill", COLORS.UNVISITED_NODE)
          .attr("stroke", COLORS.UNVISITED_BORDER)
          .attr("stroke-width", 2);

        // Add text next to rectangle
        legendItem
          .append("text")
          .attr("x", 30)
          .attr("y", 15)
          .text(item.text)
          .attr("fill", "#000")
          .attr("font-size", "12px");
      } else {
        // Add colored rectangle
        legendItem
          .append("rect")
          .attr("width", 20)
          .attr("height", 20)
          .attr("fill", item.color)
          .attr("stroke", "#000")
          .attr("stroke-width", 1);

        // Add text next to rectangle
        legendItem
          .append("text")
          .attr("x", 30)
          .attr("y", 15)
          .text(item.text)
          .attr("fill", "#000")
          .attr("font-size", "12px");
      }
    });

    const allNodes = [
      { id: "A", x: 300, y: 50 },
      { id: "B", x: 200, y: 200 },
      { id: "C", x: 400, y: 200 },
      { id: "D", x: 130, y: 350 },
      { id: "E", x: 270, y: 350 },
      { id: "F", x: 470, y: 350 },
      { id: "G", x: 80, y: 500 },
    ];

    const getNetworkFlowNodePositions = () => {
      if (isFordFulkersonPage || isEdmondsKarpPage) {
        return {
          S: { x: 100, y: 250 },
          A: { x: 300, y: 100 },
          B: { x: 500, y: 100 },
          C: { x: 300, y: 400 },
          D: { x: 500, y: 400 },
          T: { x: 700, y: 250 },
        };
      }
    };

    const networkFlowNodePositions = getNetworkFlowNodePositions();

    const nodes =
      (isPrimsPage || isKruskalsPage) && isGraphA
        ? allNodes.filter((node) => node.id !== "G")
        : isFordFulkersonPage || isEdmondsKarpPage
        ? graphState.nodes.map((n) => ({
            ...n,
            ...networkFlowNodePositions[n.id],
          }))
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

    edgeGroups.each(function (d, i) {
      const elem = d3.select(this);
      const sourceNode = nodes.find((n) => n.id === d.source);
      const targetNode = nodes.find((n) => n.id === d.target);

      if (!sourceNode || !targetNode) return;

      // For Kruskal's and Prim's make edges clickable
      if (isKruskalsPage || isPrimsPage) {
        elem.style("cursor", "pointer").on("click", (event) => {
          if (onNodeClick) {
            onNodeClick(i); // Pass the edge index instead of node id
          }
        });
      }

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
          .attr("y2", targetNode.y);
        if (!isFordFulkersonPage && !isEdmondsKarpPage) {
          elem
            .attr("stroke", (d) =>
              isActiveEdge(d) ? COLORS.EDGE_MST : COLORS.EDGE_NORMAL
            )
            .attr("stroke-width", (d) => (isActiveEdge(d) ? 6.5 : 4))
            .attr("opacity", (d) => (isActiveEdge(d) ? 1 : 0.7));
        }
      }
    });

    if (isDijkstraPage) {
      const distanceDisplay = svg
        .append("g")
        .attr("class", "distance-display")
        .attr("transform", "translate(550, 20)");

      distanceDisplay
        .append("text")
        .attr("y", 0)
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("Current Distances:");

      graphState.nodes.forEach((node, i) => {
        const textElement = distanceDisplay
          .append("text")
          .attr("y", (i + 1) * 25)
          .attr("font-size", "14px")
          .text(`Distance(${node.id}) = `);

        textElement
          .append("tspan")
          .attr("font-weight", "bold")
          .attr("fill", "red")
          .attr("stroke", "black")
          .attr("stroke-width", "0.3px")
          .attr("stroke-linejoin", "round")
          .text(node.distance === Infinity ? "∞" : node.distance);
      });
    }

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

    // Add floating edges list for Kruskal's algorithm
    if (isKruskalsPage) {
      const edgesList = svg
        .append("g")
        .attr("class", "floating-edges")
        .attr("transform", "translate(620, 100)");

      // Add title for the floating edges
      edgesList
        .append("text")
        .attr("x", 0)
        .attr("y", -20)
        .attr("font-size", "16px")
        .attr("font-weight", "bold")
        .text("Sorted Edges");

      // Get all edges sorted by weight
      const sortedEdges = [...graphState.edges].sort(
        (a, b) => a.weight - b.weight
      );

      // Create edge items
      sortedEdges.forEach((edge, index) => {
        const isUsed = graphState.mstEdges.some(
          (e) =>
            (e.source === edge.source && e.target === edge.target) ||
            (e.source === edge.target && e.target === edge.source)
        );

        const edgeGroup = edgesList
          .append("g")
          .attr("transform", `translate(0, ${index * 40})`);

        // Edge representation
        edgeGroup
          .append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", 50)
          .attr("y2", 0)
          .attr("stroke", isUsed ? "#ccc" : COLORS.EDGE_NORMAL)
          .attr("stroke-width", 3)
          .attr("opacity", isUsed ? 0.3 : 1);

        // Edge label
        const edgeLabel = edgeGroup
          .append("text")
          .attr("x", 60)
          .attr("y", 5)
          .attr("font-size", "14px")
          .attr("opacity", isUsed ? 0.3 : 1);

        // Edge vertices
        edgeLabel.append("tspan").text(`${edge.source}-${edge.target}`);

        // Edge weight
        edgeLabel.append("tspan").attr("x", 110).text(`(${edge.weight})`);

        // Strike-through line for used edges
        if (isUsed) {
          const textWidth = 80; // Approximate width of the text
          edgeGroup
            .append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", textWidth + 60)
            .attr("y2", 0)
            .attr("stroke", "#e74c3c")
            .attr("stroke-width", 2);
        }
      });
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
      .attr("r", isFordFulkersonPage || isEdmondsKarpPage ? 25 : 35)
      .attr("fill", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        if (d.id === graphState.currentNode) return COLORS.CURRENT_NODE;
        if (node && node.backtracked) return COLORS.BACKTRACKED_NODE;
        if (node && node.visited) return COLORS.VISITED_NODE;
        if (node && node.recentlyUpdated) return COLORS.UPDATED_NODE;
        if (isFordFulkersonPage || isEdmondsKarpPage) {
          return d.id === "S"
            ? COLORS.SOURCE_NODE
            : d.id === "T"
            ? COLORS.SINK_NODE
            : COLORS.UNVISITED_NODE;
        }
        return COLORS.UNVISITED_NODE;
      })
      .attr("stroke", (d) => {
        const node = graphState.nodes.find((n) => n.id === d.id);
        if (d.id === graphState.currentNode) return COLORS.CURRENT_NODE;
        if (node && node.backtracked) return COLORS.BACKTRACKED_NODE;
        if (node && node.visited) return COLORS.VISITED_NODE;
        if (isFordFulkersonPage || isEdmondsKarpPage) {
          return graphState.currentPath?.includes(d.id)
            ? COLORS.FLOW_PATH
            : "#64748b";
        }
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

    if (isFordFulkersonPage || isEdmondsKarpPage) {
      nodeGroups.attr("fill", "#000").text((d) => d.id);
    }

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

    if (isFordFulkersonPage || isEdmondsKarpPage) {
      // Define arrow markers
      svg
        .append("defs")
        .selectAll("marker")
        .data(["forward", "backward"])
        .enter()
        .append("marker")
        .attr("id", (d) => `arrow-${d}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 30)
        .attr("refY", 0)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", (d) =>
          d === "forward" ? "M0,-5L10,0L0,5" : "M10,-5L0,0L10,5"
        )
        .attr("fill", "#64748b");

      edgeGroups.each(function (d) {
        const elem = d3.select(this);
        const sourceNode = networkFlowNodePositions[d.source];
        const targetNode = networkFlowNodePositions[d.target];

        // Calculate control points for smoother curves
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const controlPoint = {
          x: (sourceNode.x + targetNode.x) / 2,
          y:
            (sourceNode.y + targetNode.y) / 2 +
            (Math.abs(dx) > Math.abs(dy) ? -30 : 0),
        };

        // Check if this is a backward flow in the current path
        const isBackwardFlow =
          graphState.currentPath?.includes(d.source) &&
          graphState.currentPath?.includes(d.target) &&
          graphState.currentPath[
            graphState.currentPath.indexOf(d.target) + 1
          ] === d.source;

        // Forward edge with arrow
        elem
          .append("path")
          .attr(
            "d",
            `M ${sourceNode.x} ${sourceNode.y} Q ${controlPoint.x} ${controlPoint.y} ${targetNode.x} ${targetNode.y}`
          )
          .attr("fill", "none")
          .attr(
            "stroke",
            isBackwardFlow
              ? "#64748b"
              : graphState.currentPath?.length > 0 &&
                graphState.currentPath?.includes(d.source) &&
                graphState.currentPath?.includes(d.target) &&
                graphState.currentPath[
                  graphState.currentPath.indexOf(d.source) + 1
                ] === d.target
              ? COLORS.FLOW_PATH
              : COLORS.FLOW_EDGE
          )
          .attr(
            "stroke-width",
            graphState.currentPath?.length > 0 &&
              graphState.currentPath?.includes(d.source) &&
              graphState.currentPath?.includes(d.target) &&
              graphState.currentPath[
                graphState.currentPath.indexOf(d.source) + 1
              ] === d.target
              ? "3"
              : "2"
          )
          .attr("marker-end", "url(#arrow-forward)");

        // Draw backward flow path
        if (isBackwardFlow) {
          // Calculate offset control point for backward flow
          // This creates the bend effect by moving the control point perpendicular to the edge
          const dx = targetNode.x - sourceNode.x;
          const dy = targetNode.y - sourceNode.y;
          const length = Math.sqrt(dx * dx + dy * dy);

          // Calculate perpendicular offset for the control point
          // Adjust these numbers to control the curve's bend amount
          const offsetX = (-dy / length) * 50; // Controls how far the curve bends out
          const offsetY = (dx / length) * 50; // Controls how far the curve bends out

          const backwardControlPoint = {
            x: (sourceNode.x + targetNode.x) / 2 + offsetX,
            y: (sourceNode.y + targetNode.y) / 2 + offsetY,
          };

          elem
            .append("path")
            .attr(
              "d",
              `M ${targetNode.x} ${targetNode.y} ` +
                `Q ${backwardControlPoint.x} ${backwardControlPoint.y} ` +
                `${sourceNode.x} ${sourceNode.y}`
            )
            .attr("fill", "none")
            .attr("stroke", COLORS.FLOW_PATH)
            .attr("stroke-width", "3")
            .attr("marker-end", "url(#arrow-forward)");
        }

        // Flow/capacity label
        elem
          .append("text")
          .attr("x", controlPoint.x)
          .attr("y", controlPoint.y)
          .attr("text-anchor", "middle")
          .attr("class", "text-md font-bold")
          .attr(
            "fill",
            graphState.currentPath?.length > 0 &&
              graphState.currentPath?.includes(d.source) &&
              graphState.currentPath?.includes(d.target) &&
              graphState.currentPath[
                graphState.currentPath.indexOf(d.source) + 1
              ] === d.target
              ? COLORS.FLOW_PATH
              : "#64748b"
          )
          .text(`${d.flow}/${d.capacity}`);
      });

      nodeGroups
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 25)
        .attr("fill", (d) => {
          if (d.id === "S") return COLORS.SOURCE_NODE;
          if (d.id === "T") return COLORS.SINK_NODE;
          return graphState.currentPath?.includes(d.id)
            ? COLORS.FLOW_PATH
            : COLORS.UNVISITED_NODE;
        })
        .attr("stroke", (d) =>
          graphState.currentPath?.includes(d.id) ? COLORS.FLOW_PATH : "#64748b"
        )
        .attr("stroke-width", 2);

      // Add text labels for nodes
      nodeGroups
        .append("text")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", "#000")
        .attr("class", "text-sm font-medium")
        .text((d) => d.id);
    }
  }, [
    graphState,
    isGraphA,
    selectedAlgorithm,
    onNodeClick,
    COLORS,
    isAStarPage,
    isDFSPage,
    isDijkstraPage,
    isKruskalsPage,
    isPrimsPage,
  ]);

  return (
    <div className="w-full h-full overflow-x-auto no-scrollbar">
      <svg ref={svgRef} className="min-w-[600px]">
        {/* <Legend
          svg={svgRef.current ? d3.select(svgRef.current) : null}
          isAStarPage={isAStarPage}
          isDFSPage={isDFSPage}
          isDijkstraPage={isDijkstraPage}
          isEdmondsKarpPage={isEdmondsKarpPage}
          isFordFulkersonPage={isFordFulkersonPage}
          isKruskalsPage={isKruskalsPage}
          isPrimsPage={isPrimsPage}
        /> */}
      </svg>
    </div>
  );
};

export default GraphVisualisation;
