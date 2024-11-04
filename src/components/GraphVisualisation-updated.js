import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { useAlgorithmType } from "@/hooks/useAlgorithmType";
import { COLORS } from "@/constants/colors";
import { useGraphDimensions } from "@/hooks/useGraphDimensions";
import Legend from "@/components/Legend/Legend";
import {
  getDefaultNodes,
  getNetworkFlowNodePositions,
} from "@/utils/graphUtils";
import { usePathname } from "next/navigation";
import Edges from "@/components/Edges/Edge";
import Nodes from "@/components/Nodes/Node";

const GraphVisualisation = ({ graphState, onNodeClick, isGraphA }) => {
  const selectedAlgorithm = useSelector(
    (state) => state.algorithm.selectedAlgorithm
  );
  const svgRef = useRef(null);
  const pathname = usePathname();
  const {
    isAStarPage,
    isDFSPage,
    isDijkstraPage,
    isEdmondsKarpPage,
    isFordFulkersonPage,
    isKruskalsPage,
    isPrimsPage,
  } = useAlgorithmType(pathname);

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

    const allNodes = getDefaultNodes();
    const networkFlowNodePositions =
      (isFordFulkersonPage || isEdmondsKarpPage) &&
      getNetworkFlowNodePositions();

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

    Edges.draw(svg, links, nodes, graphState, {
      isKruskalsPage,
      isPrimsPage,
      isDijkstraPage,
      isAStarPage,
      isFordFulkersonPage,
      isEdmondsKarpPage,
      COLORS,
      onNodeClick,
    });

    Nodes.draw(svg, nodes, graphState, {
      isFordFulkersonPage,
      isEdmondsKarpPage,
      isDijkstraPage,
      isAStarPage,
      COLORS,
      onNodeClick,
    });

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

    if (isFordFulkersonPage || isEdmondsKarpPage) {
      nodeGroups.attr("fill", "#000").text((d) => d.id);
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
        <Legend
          svg={d3.select(svgRef.current)}
          isAStarPage={isAStarPage}
          isDFSPage={isDFSPage}
          isDijkstraPage={isDijkstraPage}
          isEdmondsKarpPage={isEdmondsKarpPage}
          isFordFulkersonPage={isFordFulkersonPage}
          isKruskalsPage={isKruskalsPage}
          isPrimsPage={isPrimsPage}
        />
      </svg>
    </div>
  );
};

export default GraphVisualisation;
