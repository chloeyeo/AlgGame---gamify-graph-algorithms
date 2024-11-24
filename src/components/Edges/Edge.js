import * as d3 from "d3";
import { getNetworkFlowNodePositions } from "@/utils/graphUtils";

const Edges = {
  draw: (
    svg,
    links,
    nodes,
    graphState,
    {
      isKruskalsPage,
      isPrimsPage,
      isDijkstraPage,
      isAStarPage,
      isFordFulkersonPage,
      isEdmondsKarpPage,
      isDFSPage,
      isBFSPage,
      COLORS,
      onNodeClick,
    }
  ) => {
    // Get network flow positions if needed
    const networkFlowNodePositions =
      isFordFulkersonPage || isEdmondsKarpPage
        ? getNetworkFlowNodePositions()
        : null;

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
    }
  },
};

export default Edges;
