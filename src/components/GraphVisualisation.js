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
