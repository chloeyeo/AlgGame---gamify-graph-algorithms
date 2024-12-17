import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import * as d3 from "d3";
import { useSelector } from "react-redux";
import { useAlgorithmType } from "@/hooks/useAlgorithmType";
import { COLORS } from "@/constants/colors";
import { useGraphDimensions } from "@/hooks/useGraphDimensions";
import Legend from "@/components/Legend/Legend";
import {
  getDefaultNodes,
  getDFSGameNodes,
  getNetworkFlowNodePositions,
  getDijkstraNodes,
  getKruskalEducationGraphNodes,
  getNodesForGraph,
} from "@/utils/graphUtils";
import { usePathname } from "next/navigation";
import Edges from "@/components/Edges/Edge";
import Nodes from "@/components/Nodes/Node";

const GraphVisualisation = ({
  graphState,
  onNodeClick,
  isGraphA,
  graphIndex = 0,
}) => {
  const [render, setRender] = useState(0);
  const selectedAlgorithm = useSelector(
    (state) => state.algorithm.selectedAlgorithm
  );
  const svgRef = useRef(null);
  const divRef = useRef(null);
  const pathname = usePathname();
  const {
    isAStarPage,
    isDFSPage,
    isBFSPage,
    isDijkstraPage,
    isEdmondsKarpPage,
    isFordFulkersonPage,
    isKruskalsPage,
    isPrimsPage,
  } = useAlgorithmType(pathname);

  const { viewBoxWidth, viewBoxHeight } = useGraphDimensions(
    isEdmondsKarpPage,
    isFordFulkersonPage,
    isKruskalsPage
  );

  // get width and height of svg
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const svg = d3.select(svgRef.current);
    setWidth(svg.node().getBoundingClientRect().width);
    setHeight(svg.node().getBoundingClientRect().height);
  }, [svgRef]);

  useEffect(() => {
    if (!graphState) return;

    const svg = d3.select(svgRef.current);

    if (render !== 0) svg.selectAll("*").remove();

    setRender(render + 1);

    let xOffset = -(viewBoxWidth + 100) / 10;

    // Adjust offset for Kruskal's algorithm
    if (isKruskalsPage) {
      xOffset = -80;
    }

    svg
      .attr("viewBox", `${xOffset} -30 ${viewBoxWidth} ${viewBoxHeight}`)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("width", "100%")
      .attr("height", "100%");

    let nodes;
    if (isDFSPage || isBFSPage) {
      const layout = getDFSGameNodes[graphIndex];
      nodes = graphState.nodes.map((node) => ({
        ...node,
        ...(layout?.[node.id] || {}),
      }));
    } else if (isDijkstraPage) {
      const layout = getDijkstraNodes[graphIndex];
      nodes = graphState.nodes.map((node) => ({
        ...node,
        ...(layout?.[node.id] || {}),
      }));
    } else if (isFordFulkersonPage || isEdmondsKarpPage) {
      const networkFlowNodePositions = getNetworkFlowNodePositions();
      nodes = graphState.nodes.map((n) => ({
        ...n,
        ...networkFlowNodePositions[n.id],
      }));
    } else if (isKruskalsPage) {
      // Use Kruskal's specific node positions
      const kruskalNodes = getKruskalEducationGraphNodes[graphIndex];
      nodes = graphState.nodes.map((node) => {
        const layoutNode = kruskalNodes.find((n) => n.id === node.id);
        return {
          ...node,
          ...(layoutNode || {}),
        };
      });
    } else if (isPrimsPage) {
      const allNodes = getDefaultNodes();
      nodes = isGraphA ? allNodes.filter((node) => node.id !== "G") : allNodes;
    } else {
      nodes = getDefaultNodes();
    }

    const links = graphState.edges;

    Edges.draw(svg, links, nodes, graphState, {
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
      graphIndex,
    });

    Nodes.draw(svg, nodes, graphState, {
      isFordFulkersonPage,
      isEdmondsKarpPage,
      isDijkstraPage,
      isAStarPage,
      isDFSPage,
      isBFSPage,
      COLORS,
      onNodeClick,
      graphIndex,
    });
  }, [
    graphState,
    isGraphA,
    selectedAlgorithm,
    onNodeClick,
    COLORS,
    isAStarPage,
    isDFSPage,
    isBFSPage,
    isDijkstraPage,
    isKruskalsPage,
    isPrimsPage,
  ]);

  return (
    <div
      ref={divRef}
      className={`w-full h-full flex justify-center items-center overflow-auto no-scrollbar`}
    >
      <div className="px-4 w-fit h-full overflow-hidden overflow-x-auto no-scrollbar">
        <svg ref={svgRef}>
          <Legend
            svg={d3.select(svgRef.current)}
            isAStarPage={isAStarPage}
            isDFSPage={isDFSPage}
            isBFSPage={isBFSPage}
            isDijkstraPage={isDijkstraPage}
            isEdmondsKarpPage={isEdmondsKarpPage}
            isFordFulkersonPage={isFordFulkersonPage}
            isKruskalsPage={isKruskalsPage}
            isPrimsPage={isPrimsPage}
          />
        </svg>
      </div>
    </div>
  );
};

export default GraphVisualisation;
