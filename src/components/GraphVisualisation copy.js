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

  // Setup SVG dimensions and container once on mount
  useEffect(() => {
    const svg = d3.select(svgRef.current);
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

    // Cleanup function will only remove visualization elements, not SVG attributes
    return () => {
      svg.selectAll(".nodes-group").remove();
      svg.selectAll(".edges-group").remove();
    };
  }, []); // Empty dependency array as this only needs to run once

  // Handle drawing/updating the visualization
  useEffect(() => {
    if (!graphState || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    
    // Remove only the visualization groups, not the entire SVG contents
    svg.selectAll(".nodes-group").remove();
    svg.selectAll(".edges-group").remove();

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

    // Create separate groups for edges and nodes
    const edgesGroup = svg.append("g").attr("class", "edges-group");
    const nodesGroup = svg.append("g").attr("class", "nodes-group");

    Edges.draw(edgesGroup, links, nodes, graphState, {
      isKruskalsPage,
      isPrimsPage,
      isDijkstraPage,
      isAStarPage,
      isFordFulkersonPage,
      isEdmondsKarpPage,
      COLORS,
      onNodeClick,
    });

    Nodes.draw(nodesGroup, nodes, graphState, {
      isFordFulkersonPage,
      isEdmondsKarpPage,
      isDijkstraPage,
      isAStarPage,
      COLORS,
      onNodeClick,
    });
  }, [
    graphState,
    isGraphA,
    selectedAlgorithm,
    onNodeClick,
    isAStarPage,
    isDFSPage,
    isDijkstraPage,
    isKruskalsPage,
    isPrimsPage,
    isFordFulkersonPage,
    isEdmondsKarpPage,
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